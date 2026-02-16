const admin = require('firebase-admin');
const logger = require('../utils/logger');

let db = null;

const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      logger.info('Firebase already initialized');
      db = admin.firestore();
      return;
    }

    // Option 1: Using service account JSON file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(`../${process.env.FIREBASE_SERVICE_ACCOUNT_PATH}`);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      logger.info('Firebase initialized with service account file');
    } 
    // Option 2: Using individual credentials
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      });
      logger.info('Firebase initialized with environment variables');
    } else {
      throw new Error('Firebase credentials not found in environment variables');
    }

    db = admin.firestore();
    logger.info('Firestore database initialized successfully');
  } catch (error) {
    logger.error('Firebase initialization error:', error);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  get db() {
    if (!db) {
      throw new Error('Firestore not initialized. Call initializeFirebase() first.');
    }
    return db;
  },
  admin
};
