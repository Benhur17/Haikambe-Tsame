const { db } = require('../config/firebase');

const COLLECTION = 'mediaAlbums';

class MediaService {
  // Create a new album
  static async create(albumData) {
    const albumDoc = {
      ...albumData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection(COLLECTION).add(albumDoc);
    return { id: docRef.id, ...albumDoc };
  }

  // Find album by ID
  static async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Update album
  static async update(id, updates) {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    await db.collection(COLLECTION).doc(id).update(updateData);
    return await this.findById(id);
  }

  // Delete album
  static async delete(id) {
    await db.collection(COLLECTION).doc(id).delete();
  }

  // Get all albums
  static async findAll(filters = {}) {
    let query = db.collection(COLLECTION);

    if (filters.type) {
      query = query.where('type', '==', filters.type);
    }
    if (filters.isPublic !== undefined) {
      query = query.where('isPublic', '==', filters.isPublic);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Add media item to album
  static async addMediaItem(albumId, mediaItem) {
    const album = await this.findById(albumId);
    if (!album) throw new Error('Album not found');

    const items = album.items || [];
    items.push({
      ...mediaItem,
      addedAt: new Date()
    });

    return await this.update(albumId, { items });
  }

  // Remove media item from album
  static async removeMediaItem(albumId, itemIndex) {
    const album = await this.findById(albumId);
    if (!album) throw new Error('Album not found');

    const items = album.items || [];
    items.splice(itemIndex, 1);

    return await this.update(albumId, { items });
  }
}

module.exports = MediaService;
