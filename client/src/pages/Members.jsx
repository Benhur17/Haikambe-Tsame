import React, { useState, useEffect, useCallback, useRef } from "react";
import { membersAPI } from "../services/api";
import Layout from "../components/Layout";
import MemberCard from "../components/MemberCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { HiSearch, HiFilter, HiPlusSm, HiUsers } from "react-icons/hi";

const MemberForm = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    member || {
      fullName: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phone: "",
      occupation: "",
      education: "",
      biography: "",
      status: "Living",
      generation: 1
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Living">Living</option>
            <option value="Deceased">Deceased</option>
          </select>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="occupation">Occupation</label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="education">Education</label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="generation">Generation</label>
          <input
            type="number"
            id="generation"
            name="generation"
            value={formData.generation}
            onChange={handleChange}
            min="1"
          />
        </div>
      </div>

      <div>
        <label htmlFor="biography">Biography</label>
        <textarea
          id="biography"
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          rows="4"
          placeholder="Brief biography of the member..."
        ></textarea>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {member ? "Update Member" : "Create Member"}
        </button>
      </div>
    </form>
  );
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const { hasRole } = useAuth();
  const debounceRef = useRef(null);

  // Debounce search
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [debouncedSearch, filterStatus]);

  const fetchMembers = async () => {
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (filterStatus) params.status = filterStatus;
      const { data } = await membersAPI.getAll(params);
      setMembers(data.members);
    } catch (err) {
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async (formData) => {
    try {
      await membersAPI.create(formData);
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      alert("Failed to create member");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
              Clan Members
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {members.length} members found
            </p>
          </div>
          {hasRole(["Super Admin", "Clan Admin", "Editor"]) && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              <HiPlusSm className="w-5 h-5" />
              Add Member
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
            <div className="flex gap-2">
              {["", "Living", "Deceased"].map((status) => (
                <button
                  key={status || "all"}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    filterStatus === status
                      ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                      : "bg-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  {status || "All"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Members Grid */}
        {members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {members.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <HiUsers className="mx-auto text-6xl text-[var(--color-border)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No Members Found</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {searchTerm || filterStatus
                ? "Try adjusting your search or filter criteria."
                : "Add your first member to get started."}
            </p>
          </div>
        )}
      </div>

      {/* Create Member Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Member"
        size="lg"
      >
        <MemberForm
          onSubmit={handleCreateMember}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </Layout>
  );
};

export default Members;
