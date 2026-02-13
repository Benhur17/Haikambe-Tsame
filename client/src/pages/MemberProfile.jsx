import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { membersAPI } from "../services/api";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  HiUser,
  HiCalendar,
  HiMail,
  HiPhone,
  HiAcademicCap,
  HiBriefcase,
  HiArrowLeft,
  HiUserGroup,
  HiHeart,
} from "react-icons/hi";

const MemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      const { data } = await membersAPI.getById(id);
      setMember(data);
    } catch (error) {
      console.error("Error fetching member:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!member) {
    return (
      <Layout>
        <div className="card p-12 text-center">
          <HiUser className="mx-auto text-6xl text-[var(--color-border)] mb-4" />
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Member Not Found</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This member may have been removed or doesn't exist.
          </p>
          <Link to="/members" className="btn btn-primary mt-4 inline-flex items-center gap-2">
            <HiArrowLeft className="w-4 h-4" /> Back to Members
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          to="/members"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>

        {/* Profile Header */}
        <div className="card overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          </div>
          <div className="px-6 sm:px-8 pb-8 -mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-4xl sm:text-5xl font-bold flex-shrink-0 ring-4 ring-white shadow-lg">
                {member.fullName?.charAt(0)}
              </div>
              <div className="flex-1 pt-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
                  {member.fullName}
                </h1>
                {member.occupation && (
                  <p className="text-base text-[var(--color-text-secondary)] mt-1 flex items-center gap-1.5">
                    <HiBriefcase className="w-4 h-4" />
                    {member.occupation}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span
                    className={`badge ${
                      member.status === "Living" ? "badge-success" : "badge-neutral"
                    }`}
                  >
                    {member.status}
                  </span>
                  <span className="badge badge-info">
                    Generation {member.generation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-5 flex items-center gap-2">
            <HiUser className="w-5 h-5 text-[var(--color-accent)]" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoItem icon={HiUser} label="Gender" value={member.gender} />
            <InfoItem
              icon={HiCalendar}
              label="Date of Birth"
              value={member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : "N/A"}
            />
            {member.dateOfDeath && (
              <InfoItem
                icon={HiCalendar}
                label="Date of Death"
                value={new Date(member.dateOfDeath).toLocaleDateString()}
              />
            )}
            <InfoItem icon={HiMail} label="Email" value={member.email || "N/A"} />
            <InfoItem icon={HiPhone} label="Phone" value={member.phone || "N/A"} />
            <InfoItem icon={HiAcademicCap} label="Education" value={member.education || "N/A"} />
          </div>
        </div>

        {/* Biography */}
        {member.biography && (
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <HiBriefcase className="w-5 h-5 text-[var(--color-accent)]" />
              Biography
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
              {member.biography}
            </p>
          </div>
        )}

        {/* Family Relationships */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-5 flex items-center gap-2">
            <HiUserGroup className="w-5 h-5 text-[var(--color-accent)]" />
            Family Relationships
          </h2>
          <div className="space-y-5">
            {member.father && (
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Father</p>
                <FamilyMember member={member.father} />
              </div>
            )}
            {member.mother && (
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Mother</p>
                <FamilyMember member={member.mother} />
              </div>
            )}
            {member.spouse && member.spouse.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                  <HiHeart className="w-3 h-3 inline mr-1" />
                  Spouse(s)
                </p>
                <div className="space-y-2">
                  {member.spouse.map((s) => (
                    <FamilyMember key={s._id} member={s} />
                  ))}
                </div>
              </div>
            )}
            {member.children && member.children.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                  Children ({member.children.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {member.children.map((child) => (
                    <FamilyMember key={child._id} member={child} />
                  ))}
                </div>
              </div>
            )}
            {!member.father && !member.mother && (!member.spouse || member.spouse.length === 0) && (!member.children || member.children.length === 0) && (
              <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">
                No family relationships recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="p-4 rounded-xl bg-[var(--color-border-light)] hover:bg-[var(--color-border)] transition-colors">
    <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1 flex items-center gap-1">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </p>
    <p className="text-sm font-medium text-[var(--color-text)]">{value}</p>
  </div>
);

const FamilyMember = ({ member }) => (
  <Link
    to={`/members/${member._id}`}
    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-border-light)] transition-all group"
  >
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-sm font-bold group-hover:scale-105 transition-transform">
      {member.fullName?.charAt(0)}
    </div>
    <div>
      <p className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
        {member.fullName}
      </p>
    </div>
  </Link>
);

export default MemberProfile;
