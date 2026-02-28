import * as admin from 'firebase-admin';

function getFirestore(): admin.firestore.Firestore {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return admin.firestore();
}

export const db = getFirestore();
