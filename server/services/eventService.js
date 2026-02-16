const { db } = require('../config/firebase');

const COLLECTION = 'events';

class EventService {
  // Create a new event
  static async create(eventData) {
    const eventDoc = {
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(COLLECTION).add(eventDoc);
    return { id: docRef.id, ...eventDoc };
  }

  // Find event by ID
  static async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Update event
  static async update(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    await db.collection(COLLECTION).doc(id).update(updateData);
    return await this.findById(id);
  }

  // Delete event
  static async delete(id) {
    await db.collection(COLLECTION).doc(id).delete();
  }

  // Get all events
  static async findAll(filters = {}) {
    let query = db.collection(COLLECTION);

    if (filters.type) {
      query = query.where('type', '==', filters.type);
    }
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    const snapshot = await query.orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get upcoming events
  static async getUpcoming() {
    const now = new Date();
    const snapshot = await db.collection(COLLECTION)
      .where('date', '>=', now)
      .orderBy('date', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get past events
  static async getPast() {
    const now = new Date();
    const snapshot = await db.collection(COLLECTION)
      .where('date', '<', now)
      .orderBy('date', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = EventService;
