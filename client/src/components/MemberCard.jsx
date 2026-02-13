import React from "react";
import { Link } from "react-router-dom";
import { HiBriefcase, HiCalendar, HiUser } from "react-icons/hi";

const MemberCard = ({ member }) => {
  const getAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age;
  };

  return (
    <Link to={`/members/${member._id}`} className="block">
      <div className="card p-5 sm:p-6 hover:shadow-lg transition-all group">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
            {member.fullName?.charAt(0) || "?"}
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)] truncate mb-2">
              {member.fullName}
            </h3>
            
            <div className="space-y-2">
              {member.occupation && (
                <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2 truncate">
                  <HiBriefcase className="w-4 h-4 flex-shrink-0" />
                  {member.occupation}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                {member.gender && (
                  <span className="flex items-center gap-1">
                    <HiUser className="w-4 h-4" />
                    {member.gender}
                  </span>
                )}
                {member.dateOfBirth && (
                  <span className="flex items-center gap-1">
                    <HiCalendar className="w-4 h-4" />
                    {getAge(member.dateOfBirth)}y
                  </span>
                )}
              </div>
            </div>

            {/* Status and Generation */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span
                className={`badge ${
                  member.status === "Living"
                    ? "badge-success"
                    : "badge-neutral"
                }`}
              >
                {member.status}
              </span>
              {member.generation && (
                <span className="badge badge-info">
                  Gen {member.generation}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MemberCard;
