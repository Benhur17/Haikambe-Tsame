const { db } = require('../config/firebase');

const COLLECTION = 'newbornRequests';

class NewbornRequestService {
  // Create a new request
  static async create(requestData) {
    const requestDoc = {
      ...requestData,
      status: requestData.status || 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(COLLECTION).add(requestDoc);
    return { id: docRef.id, ...requestDoc };
  }

  // Find request by ID
  static async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Update request
  static async update(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    await db.collection(COLLECTION).doc(id).update(updateData);
    return await this.findById(id);
  }

  // Delete request
  static async delete(id) {
    await db.collection(COLLECTION).doc(id).delete();
  }

  // Get all requests with filters
  static async findAll(filters = {}) {
    let query = db.collection(COLLECTION);

    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Approve request
  static async approve(id, approvedBy) {
    return await this.update(id, {
      status: 'Approved',
      approvedBy,
      approvedAt: new Date()
    });
  }

  // Reject request
  static async reject(id, rejectedBy, reason) {
    return await this.update(id, {
      status: 'Rejected',
      rejectedBy,
      rejectedAt: new Date(),
      rejectionReason: reason
    });
  }
}

module.exports = NewbornRequestService;
