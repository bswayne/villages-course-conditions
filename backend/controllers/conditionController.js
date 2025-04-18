const admin = require('../firebase'); // Adjust path if needed
const db = admin.firestore();

exports.getConditionsByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId; // This is the ID from unofficial_locations

        // Validate courseId exists in the unofficial_locations collection
        const locationDoc = await db.collection('unofficial_locations').doc(courseId).get();
        if (!locationDoc.exists) {
            // console.log(`[getConditions] Course/Location with ID ${courseId} not found in unofficial_locations.`);
            return res.status(404).send('Course not found');
        }

        // Query the NEW collection
        const conditionsSnapshot = await db.collection('villages_course_conditions')
            .where('course_id', '==', courseId) // Filter by course_id field
            .orderBy('date_played', 'desc')      
            .limit(50)
            .get();

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];
            let conditions = []; 
            conditionsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const datePlayed = new Date(data.date_played + 'T00:00:00Z'); // Parse string date as UTC
    
                if (datePlayed >= sevenDaysAgo) {
                     conditions.push({
                         id: doc.id,
                         course_id: data.course_id,
                         user_id: data.user_id,
                         user_email: data.user_email || null,
                         rating: data.rating,
                         user_display_name: data.user_display_name || null,
                         comment: data.comment || null,
                         date_played: data.date_played, // The string 'YYYY-MM-DD'
                         timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : null,
                     });
                }
                // --- END ADD ---
            });

        res.status(200).json(conditions);

    } catch (error) {
        // Check specifically for missing index error
        if (error.code === 9 /* FAILED_PRECONDITION */ && error.details?.includes('index')) {
             console.error("Firestore query requires a composite index. Please create it using the link in the error details or the Firebase Console.", error);
             // Optionally send a more specific error message back
             return res.status(500).send("Database configuration error: Missing index. See server logs.");
        } else {
            console.error('Error fetching conditions:', error);
        }
        res.status(500).send('Error fetching conditions');
    }
};

// --- Updated: Add condition to 'villages_course_conditions' ---
exports.addCondition = async (req, res) => {
    try {
        const { courseId, rating, comment, conditionDate } = req.body;
        const userId = req.user.uid;
        const userEmail = req.user.email;
        // --- Get display name from Firebase Auth token (best source) ---
        let userDisplayName = null;
        try {
            const userDocRef = db.collection('users').doc(userId);
            const userDoc = await userDocRef.get();
            if (userDoc.exists) {
                userDisplayName = userDoc.data().display_name || null; // Get from 'display_name' field
            }
        } catch (profileError) {
            console.error(`Error fetching Firestore profile for ${userId} during addCondition:`, profileError);
            // Decide how critical this is - maybe fallback to token name or fail?
            // For now, let the check below handle it if null.
        }
        if (!userDisplayName && req.user.name) {
            console.warn(`Using display name from token for ${userId} as Firestore fetch failed or profile/field missing.`);
            userDisplayName = req.user.name;
        }
        if (!userDisplayName) {
            console.warn(`User ${userId} (${userEmail}) attempted to add condition without a display name set in Auth profile.`);
            // You could fetch the profile from Firestore here as a fallback, but it's better
            // to rely on the frontend preventing the submission if the profile/display name is missing.
            return res.status(400).send('User display name is required. Please update your profile.');
        }
        // Basic Validation (keep this)
        if (!courseId || !rating || !conditionDate) {
            return res.status(400).send('Missing required fields: courseId, rating, conditionDate');
        }
        if (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
             return res.status(400).send('Invalid rating value. Must be between 1 and 5.');
        }

        // Validate courseId exists in the unofficial_locations collection
        const locationDoc = await db.collection('unofficial_locations').doc(courseId).get();
        if (!locationDoc.exists) {
            //  console.log(`[addCondition] Attempt to add condition for non-existent Course/Location ID ${courseId}.`);
             return res.status(404).send('Course not found');
         }

        // --- Structure the data for the NEW collection ---
        const newConditionData = {
            course_id: courseId,                         // Reference to unofficial_locations ID
            user_id: userId,                             // Firebase Auth UID
            user_email: userEmail || null,               // User's email (optional)
            user_display_name: userDisplayName,
            rating: Number(rating),                      // Ensure rating is a number
            comment: comment || null,                    // Store comment or null
            date_played: conditionDate,        // Store the 'YYYY-MM-DD' string directly
            timestamp: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp for creation time
        };
        // --- End Structure ---

        // Add to the NEW collection
        const docRef = await db.collection('villages_course_conditions').add(newConditionData);
        // console.log(`Condition report added to villages_course_conditions with ID: ${docRef.id}`);

        // Return the newly created data (fetch it back to get server timestamp?)
        // Or just construct it client-side approximately
        const createdCondition = {
             id: docRef.id,
             ...newConditionData,
             date_played: newConditionData.date_played, // Keep as JS Date
             timestamp: new Date() // Approximate timestamp for immediate frontend use
        };
        // Remove serverTimestamp field value before sending back
       // delete createdCondition.timestamp;


        res.status(201).json(createdCondition);

    } catch (error) {
        console.error('Error adding condition report:', error);
        res.status(500).send('Error adding condition report');
    }
};