const admin = require('firebase-admin');

let serviceAccount;

if (process.env.NODE_ENV === 'production') {
  // --- PRODUCTION MODE: Load from environment variable ---
  console.log("Running in production mode: Loading Firebase credentials from environment variable.");
  const firebaseAdminSdkJsonContent = process.env.FIREBASE_ADMIN_SDK_JSON_CONTENT;

  if (!firebaseAdminSdkJsonContent) {
      throw new Error("Firebase Admin SDK JSON content is missing from environment variable 'FIREBASE_ADMIN_SDK_JSON_CONTENT' in production mode.");
  }
  try {
      serviceAccount = JSON.parse(firebaseAdminSdkJsonContent);
  } catch (error) {
      console.error("Failed to parse Firebase Admin SDK JSON from environment variable:", error);
      throw new Error("Invalid Firebase Admin SDK JSON content in environment variable.");
  }
  // --- End Production Mode ---

} else {
  // --- DEVELOPMENT MODE: Load from local JSON file ---
  // console.log("Running in development mode: Loading Firebase credentials from local file.");
  try {
      // IMPORTANT: Adjust the path relative to where this firebase.js file is located
      // Assuming firebase.js is in the root of the backend folder:
      serviceAccount = require('./unofficialguidetothevillages-firebase-adminsdk-mm71t-947b26d826.json');
  } catch (error) {
      console.error("Failed to load local Firebase Admin SDK JSON file:", error);
      console.error("Ensure 'unofficialguidetothevillages-firebase-adminsdk-mm71t-947b26d826.json' exists in the backend directory and is correctly formatted.");
      throw new Error("Could not load local Firebase credentials for development.");
  }
  // --- End Development Mode ---
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  // console.log("Firebase Admin SDK initialized successfully.");
} catch (initError) {
  console.error("Firebase Admin SDK initialization failed:", initError);
  throw new Error("Could not initialize Firebase Admin SDK.");
}

module.exports = admin;
