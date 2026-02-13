import React, { useState, useEffect } from "react";
import { historyAPI } from "../services/api";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { HiBookOpen, HiPhotograph, HiTag } from "react-icons/hi";

const ClanHistory = () => {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await historyAPI.getAll();
      setHistoryEntries(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const groupedByCategory = historyEntries.reduce((acc, entry) => {
    const category = entry.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(entry);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title flex items-center gap-3">
            <HiBookOpen className="w-8 h-8 text-[var(--color-accent)]" />
            Clan History
          </h1>
          <p className="page-description">
            Preserving our stories, traditions, and heritage
          </p>
        </div>

        {/* Timeline */}
        {Object.entries(groupedByCategory).map(([category, entries]) => (
          <div key={category}>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <HiTag className="w-5 h-5 text-[var(--color-accent)]" />
              {category}
            </h2>
            <div className="space-y-4 stagger-children">
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className="card p-5 sm:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedEntry(entry);
                    setShowModal(true);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {entry.year && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                        {entry.year}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 line-clamp-2">
                        {entry.description}
                      </p>
                      {entry.images && entry.images.length > 0 && (
                        <p className="text-xs text-[var(--color-accent)] mt-2 flex items-center gap-1 font-semibold">
                          <HiPhotograph className="w-3.5 h-3.5" />
                          {entry.images.length} {entry.images.length === 1 ? "image" : "images"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {historyEntries.length === 0 && (
          <div className="card p-16 text-center">
            <HiBookOpen className="mx-auto text-6xl text-[var(--color-border)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No History Yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Start documenting your clan's heritage and traditions.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedEntry?.title || ""}
        size="lg"
      >
        {selectedEntry && (
          <div className="space-y-6">
            {selectedEntry.year && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] text-white font-bold text-lg shadow-sm">
                {selectedEntry.year}
              </div>
            )}
            <p className="text-[var(--color-text)] leading-relaxed">{selectedEntry.description}</p>
            {selectedEntry.content && (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-sm text-[var(--color-text-secondary)]">{selectedEntry.content}</p>
              </div>
            )}
            {selectedEntry.images && selectedEntry.images.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-[var(--color-text)] mb-3 flex items-center gap-1.5">
                  <HiPhotograph className="w-4 h-4 text-[var(--color-accent)]" />
                  Images
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedEntry.images.map((img, index) => (
                    <div key={index} className="aspect-video bg-[var(--color-border-light)] rounded-xl flex items-center justify-center">
                      <HiPhotograph className="w-8 h-8 text-[var(--color-text-tertiary)]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default ClanHistory;
