const admin = require('../firebase'); // Adjust path if needed
const db = admin.firestore();

// Define mapping from simple type query param to Firestore location_type
const typeMapping = {
    'executive': 'Executive Golf Course',
    'championship': 'Championship Golf Course',
    'pitch-putt': 'Pitch & Putt' 
};

// Fetch courses, potentially filtered by type
exports.getAllCourses = async (req, res) => {
    try {
        const requestedType = req.query.type;
        // ... (validation for requestedType as before) ...
        if (!typeMapping[requestedType]) {
             return res.status(400).send(`Invalid course type requested: ${requestedType}`);
        }

        // 1. Fetch the filtered list of courses/locations
        let locationsQuery = db.collection('unofficial_locations')
                               .where('location_type', '==', typeMapping[requestedType])
                               .orderBy('location_name');

        const locationsSnapshot = await locationsQuery.get();
        if (locationsSnapshot.empty) {
            return res.status(200).json([]);
        }

        // 2. Prepare conditions query parameters
        const courseIds = locationsSnapshot.docs.map(doc => doc.id);
        // const fourDaysAgo = new Date();
        // fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
        // const fourDaysAgoString = fourDaysAgo.toISOString().split('T')[0];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];
        // 3. Fetch recent conditions in BATCHES
        let recentConditions = [];
        const batchSize = 30; // Firestore 'in' query limit (use 30 for v1 queries)
        const fetchPromises = [];

        // console.log(`Fetching conditions for ${courseIds.length} courses in batches of ${batchSize}`);

        for (let i = 0; i < courseIds.length; i += batchSize) {
            const batchIds = courseIds.slice(i, i + batchSize);
            if (batchIds.length > 0) {
                // console.log(` - Fetching batch starting at index ${i} with ${batchIds.length} IDs`);
                const conditionsQuery = db.collection('villages_course_conditions')
                                          .where('course_id', 'in', batchIds)
                                          .where('date_played', '>=', sevenDaysAgoString)
                                          .orderBy('date_played', 'desc'); // Keep index requirement consistent

                // Add the promise for this batch's query to the array
                fetchPromises.push(conditionsQuery.get());
            }
        }

        // Execute all batch queries in parallel
        const allBatchSnapshots = await Promise.all(fetchPromises);

        // Combine results from all batches
        allBatchSnapshots.forEach(snapshot => {
            snapshot.docs.forEach(doc => {
                recentConditions.push(doc.data());
            });
        });

        //  console.log(`Fetched total ${recentConditions.length} recent conditions.`);

        // 4. Calculate average rating for each course (same logic as before)
        const coursesWithAvgRating = locationsSnapshot.docs.map(doc => {
            const courseData = doc.data();
            const courseId = doc.id;
            const relevantConditions = recentConditions.filter(cond => cond.course_id === courseId);
            let avgRating = null;
            if (relevantConditions.length > 0) {
                const sum = relevantConditions.reduce((acc, cond) => acc + cond.rating, 0);
                avgRating = parseFloat((sum / relevantConditions.length).toFixed(1));
            }
            return {
                id: courseId,
                locationName: courseData.location_name,
                recentAverageRating: avgRating,
            };
        });

        res.status(200).json(coursesWithAvgRating);

    } catch (error) {
        console.error('Error fetching courses with avg rating:', error);
         if (error.code === 9 /* FAILED_PRECONDITION */ && error.details?.includes('index')) {
             console.error("Firestore query for recent conditions requires a composite index (course_id IN, date_played >=). Please create it.");
         }
        res.status(500).send('Error fetching courses');
    }
};

// Keep getCourseById if you need it, make sure it uses 'unofficial_locations' collection too
exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const courseDoc = await db.collection('unofficial_locations').doc(courseId).get(); // Use correct collection

        if (!courseDoc.exists) {
            return res.status(404).send('Course not found');
        }

        const docData = courseDoc.data();
        // Map data similarly to getAllCourses if needed, or send raw data
         const courseData = {
            id: courseDoc.id,
            locationName: docData.location_name,
            aka: docData.aka,
            streetAddress: docData.street_address,
            zipCode: docData.zip_code,
            phoneNumber: docData.phone_number,
            latitude: docData.latitude,
            longitude: docData.longitude,
            amenities: docData.amenities,
            locationType: docData.location_type,
            notes: docData.notes,
            dateCreated: docData.date_created?.toDate ? docData.date_created.toDate() : null,
         };

        res.status(200).json(courseData);
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).send('Error fetching course');
    }
};