import React, { useState, useEffect } from "react";
import { newbornAPI, membersAPI } from "../services/api";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { HiPlusSm, HiUser, HiCalendar, HiDocumentAdd } from "react-icons/hi";

const NewbornRequestForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "",
    father: "",
    mother: "",
    notes: ""
  });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await membersAPI.getAll({ status: "Living", limit: 1000 });
      setMembers(data.members);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

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
          </select>
        </div>

        <div>
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="placeOfBirth">Place of Birth</label>
          <input
            type="text"
            id="placeOfBirth"
            name="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="father">Father *</label>
          <select
            id="father"
            name="father"
            value={formData.father}
            onChange={handleChange}
            required
          >
            <option value="">Select Father</option>
            {members
              .filter((m) => m.gender === "Male")
              .map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fullName}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="mother">Mother *</label>
          <select
            id="mother"
            name="mother"
            value={formData.mother}
            onChange={handleChange}
            required
          >
            <option value="">Select Mother</option>
            {members
              .filter((m) => m.gender === "Female")
              .map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fullName}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Any additional information..."
        ></textarea>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit Request
        </button>
      </div>
    </form>
  );
};

const NewbornRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const { data } = await newbornAPI.getAll(params);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (formData) => {
    try {
      await newbornAPI.create(formData);
      setShowModal(false);
      fetchRequests();
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create request");
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this request?")) return;
    try {
      await newbornAPI.approve(id, "Approved by admin");
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    const notes = window.prompt("Reason for rejection:");
    if (!notes) return;
    try {
      await newbornAPI.reject(id, notes);
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
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
              Newborn Registration
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Submit and manage newborn registration requests
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <HiPlusSm className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {["Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === status
                    ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                    : "bg-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="space-y-4 stagger-children">
            {requests.map((request) => (
              <div key={request._id} className="card p-5 sm:p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--color-text)]">
                      {request.fullName}
                    </h3>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1.5">
                        <HiUser className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                        {request.gender}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1.5">
                        <HiCalendar className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
                        {new Date(request.dateOfBirth).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        <span className="font-medium text-[var(--color-text)]">Father:</span>{" "}
                        {request.father?.fullName || "N/A"}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        <span className="font-medium text-[var(--color-text)]">Mother:</span>{" "}
                        {request.mother?.fullName || "N/A"}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-3">
                      Submitted {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-3">
                    <span
                      className={`badge ${
                        request.status === "Pending"
                          ? "badge-warning"
                          : request.status === "Approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {request.status}
                    </span>

                    {request.status === "Pending" &&
                      hasRole(["Super Admin", "Clan Admin"]) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            className="btn btn-primary text-xs px-3 py-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            className="btn btn-outline text-xs px-3 py-2"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <HiDocumentAdd className="mx-auto text-6xl text-[var(--color-border)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No Requests Found</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              No {filterStatus.toLowerCase()} requests at this time.
            </p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Submit Newborn Registration"
        size="lg"
      >
        <NewbornRequestForm
          onSubmit={handleSubmitRequest}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </Layout>
  );
};

export default NewbornRequests;
