const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

const COLLECTION = 'users';

class UserService {
  // Create a new user
  static async create(userData) {
    // Hash password before storing
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    const userDoc = {
      ...userData,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      isEmailVerified: userData.isEmailVerified || false,
      role: userData.role || 'Viewer',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(COLLECTION).add(userDoc);
    return { id: docRef.id, ...userDoc };
  }

  // Find user by ID
  static async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Find user by email
  static async findByEmail(email) {
    const snapshot = await db.collection(COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Find user by username
  static async findByUsername(username) {
    const snapshot = await db.collection(COLLECTION)
      .where('username', '==', username)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Find user by email or username
  static async findByEmailOrUsername(email, username) {
    // Check email first
    let user = await this.findByEmail(email);
    if (user) return user;
    
    // Then check username
    return await this.findByUsername(username);
  }

  // Update user
  static async update(id, updates) {
    // Don't allow updating password directly with this method
    if (updates.password) {
      delete updates.password;
    }

    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    await db.collection(COLLECTION).doc(id).update(updateData);
    return await this.findById(id);
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.collection(COLLECTION).doc(id).update({
      password: hashedPassword,
      updatedAt: new Date()
    });
  }

  // Update last login
  static async updateLastLogin(id) {
    await db.collection(COLLECTION).doc(id).update({
      lastLogin: new Date()
    });
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Delete user
  static async delete(id) {
    await db.collection(COLLECTION).doc(id).delete();
  }

  // Get all users
  static async findAll(filters = {}) {
    let query = db.collection(COLLECTION);

    if (filters.role) {
      query = query.where('role', '==', filters.role);
    }
    if (filters.isActive !== undefined) {
      query = query.where('isActive', '==', filters.isActive);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = UserService;
