const admin = require('firebase-admin');
const serviceAccount = require('./unofficialguidetothevillages-firebase-adminsdk-mm71t-947b26d826.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;