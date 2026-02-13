import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { membersAPI } from "../services/api";
import Layout from "../components/Layout";
import FamilyTree from "../components/FamilyTree";
import LoadingSpinner from "../components/LoadingSpinner";
import { HiUserGroup, HiSelector } from "react-icons/hi";

const FamilyTreePage = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [familyTreeData, setFamilyTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      fetchFamilyTree(selectedMember);
    }
  }, [selectedMember]);

  const fetchMembers = async () => {
    try {
      const { data } = await membersAPI.getAll({ limit: 1000 });
      setMembers(data.members);
      const rootMember = data.members.find((m) => m.generation === 1);
      if (rootMember) {
        setSelectedMember(rootMember._id);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilyTree = async (memberId) => {
    try {
      const { data } = await membersAPI.getFamilyTree(memberId);
      setFamilyTreeData(data);
    } catch (error) {
      console.error("Error fetching family tree:", error);
    }
  };

  const handleMemberClick = (member) => {
    navigate(`/members/${member._id}`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title flex items-center gap-3">
            <HiUserGroup className="w-8 h-8 text-[var(--color-accent)]" />
            Family Tree
          </h1>
          <p className="page-description">
            Explore the genealogy and lineage of the Haikambe Tsame Clan
          </p>
        </div>

        {/* Member Selection */}
        <div className="card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label htmlFor="memberSelect" className="text-sm font-semibold text-[var(--color-text)] whitespace-nowrap flex items-center gap-1.5">
              <HiSelector className="w-4 h-4 text-[var(--color-accent)]" />
              Root Member
            </label>
            <select
              id="memberSelect"
              value={selectedMember || ""}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="max-w-md text-sm"
            >
              <option value="">Select a member...</option>
              {members
                .filter((m) => m.generation <= 2)
                .map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.fullName} (Gen {member.generation})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Family Tree Visualization */}
        <div className="card">
          <FamilyTree
            rootMember={familyTreeData}
            onMemberClick={handleMemberClick}
          />
        </div>

        {/* Legend */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-[var(--color-text)] mb-3 uppercase tracking-wider">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)]"></div>
              <span className="text-[var(--color-text-secondary)]">Clan Member</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-success text-xs">Living</span>
              <span className="text-[var(--color-text-secondary)]">Living Member</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-neutral text-xs">Deceased</span>
              <span className="text-[var(--color-text-secondary)]">Deceased Member</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-info text-xs">Gen #</span>
              <span className="text-[var(--color-text-secondary)]">Generation Number</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FamilyTreePage;
