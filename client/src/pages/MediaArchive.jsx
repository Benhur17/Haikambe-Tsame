import React, { useState, useEffect } from "react";
import { mediaAPI } from "../services/api";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { 
  HiPhotograph, 
  HiVideoCamera, 
  HiMusicNote, 
  HiCalendar, 
  HiLocationMarker,
  HiFolder,
  HiCollection
} from "react-icons/hi";

const MediaArchive = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchAlbums();
  }, [filterCategory]);

  const fetchAlbums = async () => {
    try {
      const params = filterCategory ? { category: filterCategory } : {};
      const { data } = await mediaAPI.getAll(params);
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const categories = ["Events", "Ceremonies", "Portraits", "Historical", "Gatherings"];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Media Archive</h1>
          <p className="page-description">
            Photos, videos, and memories preserving our clan's heritage
          </p>
        </div>

        {/* Category Filter */}
        <div className="card p-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterCategory("")}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                filterCategory === ""
                  ? "bg-[var(--color-accent)] text-white shadow-md"
                  : "bg-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              }`}
            >
              All Albums
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  filterCategory === category
                    ? "bg-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Albums Grid */}
        {albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album._id}
                className="card overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
                onClick={() => {
                  setSelectedAlbum(album);
                  setShowModal(true);
                }}
              >
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white transition-transform group-hover:scale-105">
                  <HiPhotograph className="w-20 h-20 opacity-80" />
                </div>

                {/* Album Info */}
                <div className="p-5">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)] mb-2 truncate">
                    {album.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
                    {album.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="badge badge-success">
                      {album.category}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
                      <HiCollection className="w-4 h-4" />
                      {album.items?.length || 0}
                    </span>
                  </div>
                  {album.eventDate && (
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-3 flex items-center gap-1">
                      <HiCalendar className="w-3 h-3" />
                      {new Date(album.eventDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <HiFolder className="empty-state-icon" />
            <h3 className="empty-state-title">No Albums Found</h3>
            <p className="empty-state-description">
              Start creating your media archive to preserve memories.
            </p>
          </div>
        )}
      </div>

      {/* Album Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedAlbum?.name || ""}
        size="xl"
      >
        {selectedAlbum && (
          <div className="space-y-6">
            <div>
              <p className="text-[var(--color-text)] leading-relaxed">{selectedAlbum.description}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {selectedAlbum.eventDate && (
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
                    <HiCalendar className="w-4 h-4" />
                    {new Date(selectedAlbum.eventDate).toLocaleDateString()}
                  </span>
                )}
                {selectedAlbum.location && (
                  <span className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
                    <HiLocationMarker className="w-4 h-4" />
                    {selectedAlbum.location}
                  </span>
                )}
              </div>
            </div>

            {/* Media Items */}
            {selectedAlbum.items && selectedAlbum.items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedAlbum.items.map((item, index) => {
                  const MediaIcon = item.type === "image" ? HiPhotograph : item.type === "video" ? HiVideoCamera : HiMusicNote;
                  return (
                    <div key={index} className="card p-4 hover:shadow-md transition-all">
                      <div className="aspect-square bg-gradient-to-br from-[var(--color-border-light)] to-[var(--color-background)] rounded-xl mb-2 flex items-center justify-center">
                        <MediaIcon className="w-12 h-12 text-[var(--color-text-tertiary)]" />
                      </div>
                      {item.title && (
                        <p className="text-sm font-medium truncate text-[var(--color-text)]">{item.title}</p>
                      )}
                      <p className="text-xs text-[var(--color-text-tertiary)] capitalize mt-1">{item.type}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state py-8">
                <HiCollection className="mx-auto text-5xl opacity-20 mb-3" />
                <p className="text-sm">No media items in this album</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default MediaArchive;
