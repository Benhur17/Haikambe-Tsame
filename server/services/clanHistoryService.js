const { db } = require('../config/firebase');

const COLLECTION = 'clanHistory';

class ClanHistoryService {
  // Create a new history entry
  static async create(historyData) {
    const historyDoc = {
      ...historyData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(COLLECTION).add(historyDoc);
    return { id: docRef.id, ...historyDoc };
  }

  // Find entry by ID
  static async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Update entry
  static async update(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    await db.collection(COLLECTION).doc(id).update(updateData);
    return await this.findById(id);
  }

  // Delete entry
  static async delete(id) {
    await db.collection(COLLECTION).doc(id).delete();
  }

  // Get all history entries
  static async findAll() {
    const snapshot = await db.collection(COLLECTION)
      .orderBy('year', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get entries by year range
  static async getByYearRange(startYear, endYear) {
    const snapshot = await db.collection(COLLECTION)
      .where('year', '>=', parseInt(startYear))
      .where('year', '<=', parseInt(endYear))
      .orderBy('year', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get entries by category
  static async getByCategory(category) {
    const snapshot = await db.collection(COLLECTION)
      .where('category', '==', category)
      .orderBy('year', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = ClanHistoryService;
