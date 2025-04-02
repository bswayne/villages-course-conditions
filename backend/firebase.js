const admin = require('firebase-admin');
// const serviceAccount = require('./unofficialguidetothevillages-firebase-adminsdk-mm71t-947b26d826.json');
const firebaseAdminSdkJsonContent = process.env.FIREBASE_ADMIN_SDK_JSON_CONTENT;

if (!firebaseAdminSdkJsonContent) {
  throw new Error("Firebase Admin SDK JSON content is missing from environment variable 'FIREBASE_ADMIN_SDK_JSON_CONTENT'");
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(firebaseAdminSdkJsonContent);
} catch (error) {
  console.error("Failed to parse Firebase Admin SDK JSON from environment variable:", error);
  throw new Error("Invalid Firebase Admin SDK JSON content in environment variable.");
}

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
} catch (initError) {
  console.error("Firebase Admin SDK initialization failed:", initError);
  throw new Error("Could not initialize Firebase Admin SDK.");
}

module.exports = admin;
