const { db } = require('../config/firebase');

const COLLECTION = 'members';

class MemberService {
  // Create a new member
  static async create(memberData) {
    const memberDoc = {
      ...memberData,
      status: memberData.status || 'Living',
      generation: memberData.generation || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(COLLECTION).add(memberDoc);
    return { id: docRef.id, ...memberDoc };
  }

  // Find member by ID
  static async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Update member
  static async update(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    await db.collection(COLLECTION).doc(id).update(updateData);
    return await this.findById(id);
  }

  // Delete member
  static async delete(id) {
    await db.collection(COLLECTION).doc(id).delete();
  }

  // Get all members with optional filters
  static async findAll(filters = {}) {
    let query = db.collection(COLLECTION);

    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    if (filters.gender) {
      query = query.where('gender', '==', filters.gender);
    }
    if (filters.generation) {
      query = query.where('generation', '==', parseInt(filters.generation));
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Search members by name
  static async searchByName(searchTerm) {
    const snapshot = await db.collection(COLLECTION).get();
    const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side filtering (Firestore doesn't support text search directly)
    const lowerSearch = searchTerm.toLowerCase();
    return members.filter(member => 
      member.fullName?.toLowerCase().includes(lowerSearch) ||
      member.firstName?.toLowerCase().includes(lowerSearch) ||
      member.lastName?.toLowerCase().includes(lowerSearch)
    );
  }

  // Get family relationships
  static async getFamily(memberId) {
    const member = await this.findById(memberId);
    if (!member) return null;

    const family = { member };

    // Get father
    if (member.father) {
      family.father = await this.findById(member.father);
    }

    // Get mother
    if (member.mother) {
      family.mother = await this.findById(member.mother);
    }

    // Get spouse(s)
    if (member.spouse && member.spouse.length > 0) {
      family.spouses = await Promise.all(
        member.spouse.map(id => this.findById(id))
      );
    }

    // Get children
    if (member.children && member.children.length > 0) {
      family.children = await Promise.all(
        member.children.map(id => this.findById(id))
      );
    }

    // Get siblings
    if (member.siblings && member.siblings.length > 0) {
      family.siblings = await Promise.all(
        member.siblings.map(id => this.findById(id))
      );
    }

    return family;
  }

  // Get members by generation
  static async getByGeneration(generation) {
    const snapshot = await db.collection(COLLECTION)
      .where('generation', '==', parseInt(generation))
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get statistics
  static async getStats() {
    const snapshot = await db.collection(COLLECTION).get();
    const members = snapshot.docs.map(doc => doc.data());

    const stats = {
      total: members.length,
      living: members.filter(m => m.status === 'Living').length,
      deceased: members.filter(m => m.status === 'Deceased').length,
      male: members.filter(m => m.gender === 'Male').length,
      female: members.filter(m => m.gender === 'Female').length,
      byGeneration: {}
    };

    // Count by generation
    members.forEach(m => {
      const gen = m.generation || 1;
      stats.byGeneration[gen] = (stats.byGeneration[gen] || 0) + 1;
    });

    return stats;
  }
}

module.exports = MemberService;
