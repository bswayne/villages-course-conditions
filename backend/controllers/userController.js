const admin = require('../firebase'); // Adjust path if needed
const db = admin.firestore();

// --- Get current user's profile ---
exports.getUserProfile = async (req, res) => {
    const userId = req.user.uid; // From auth middleware

    try {
        const userDocRef = db.collection('users').doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            // If profile doesn't exist in 'users', create a basic one? Or return 404?
            // Option: Return basic info from auth token
            // console.log(`User profile not found in Firestore for UID: ${userId}. Returning basic info.`);
            // You might want to create a basic profile upon first login instead.
             return res.status(200).json({
                  userId: userId,
                  email: req.user.email, // From token
                  // Default other fields to null or empty
                  dateCreated: req.user.metadata?.creationTime ? new Date(req.user.metadata.creationTime) : new Date(), // Approx from token or now
                  firstName: null,
                  lastName: null,
                  photoUrl: req.user.picture || null, // From token if available
                  isPremium: false, // Default?
                  village: null,
                  displayName: req.user.name || req.user.email, // From token or email
             });

            // Option: Return 404
            // return res.status(404).send('User profile not found.');
        }

        const userData = userDoc.data();
         // Map Firestore data (snake_case) to camelCase if desired for frontend consistency
         // Ensure date_created is converted
         const profileData = {
             userId: userData.user_id || userId, // Use doc ID if field missing
             email: userData.email || req.user.email, // Fallback to token email
             dateCreated: userData.date_created?.toDate ? userData.date_created.toDate() : new Date(), // Convert timestamp
             firstName: userData.first_name || null,
             lastName: userData.last_name || null,
             photoUrl: userData.photo_url || req.user.picture || null, // Fallback to token picture
             isPremium: userData.is_premium || false,
             village: userData.village || null,
             displayName: userData.display_name || req.user.name || req.user.email, // Fallback display name
         };

        res.status(200).json(profileData);

    } catch (error) {
        console.error(`Error fetching profile for user ${userId}:`, error);
        res.status(500).send('Error fetching user profile.');
    }
};

// --- Update current user's profile ---
exports.updateUserProfile = async (req, res) => {
    const userId = req.user.uid;
    // Extract allowed fields from request body (prevent unwanted updates)
    const { firstName, lastName, village, displayName } = req.body;

    // Basic validation (add more as needed)
    if (!firstName && !lastName && !village && !displayName) {
         return res.status(400).send('No fields provided for update.');
    }

    try {
        const userDocRef = db.collection('users').doc(userId);

        // Construct update object with only provided fields (using snake_case for Firestore)
        const updateData = {};
        if (firstName !== undefined) updateData.first_name = firstName; 
        if (lastName !== undefined) updateData.last_name = lastName;
        if (village !== undefined) updateData.village = village;
        if (displayName !== undefined) updateData.display_name = displayName;
        // Prevent updating fields like email, userId, dateCreated, isPremium here

        // Use set with merge:true to create the doc if it doesn't exist, or update existing fields
        await userDocRef.set(updateData, { merge: true });

        // Fetch the updated profile to return it
        const updatedDoc = await userDocRef.get();
        const updatedUserData = updatedDoc.data();

         const profileData = {
             userId: updatedUserData.user_id || userId,
             email: updatedUserData.email || req.user.email,
             dateCreated: updatedUserData.date_created?.toDate ? updatedUserData.date_created.toDate() : new Date(),
             firstName: updatedUserData.first_name || null,
             lastName: updatedUserData.last_name || null,
             photoUrl: updatedUserData.photo_url || req.user.picture || null,
             isPremium: updatedUserData.is_premium || false,
             village: updatedUserData.village || null,
             displayName: updatedUserData.display_name || req.user.name || req.user.email,
        };

        try {
            await admin.auth().updateUser(userId, {
                 displayName: profileData.displayName 
             });
            // console.log(`Successfully updated Firebase Auth display name for ${userId}`);
         } catch (authError) {
            console.error(`Failed to update Firebase Auth display name for ${userId}:`, authError);
             // Log the error but don't fail the whole request just for this
         }

        res.status(200).json(profileData); // Return the updated profile

    } catch (error) {
        console.error(`Error updating profile for user ${userId}:`, error);
        res.status(500).send('Error updating user profile.');
    }
};