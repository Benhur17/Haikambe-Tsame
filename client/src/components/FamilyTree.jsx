import React, { useState } from "react";
import { HiChevronDown, HiChevronRight, HiUserGroup } from "react-icons/hi";

const FamilyTreeNode = ({ member, onMemberClick, depth = 0 }) => {
  const [expanded, setExpanded] = useState(depth < 2);

  if (!member) return null;

  const hasChildren = member.children && member.children.length > 0;

  return (
    <div className="relative">
      {/* Member Node */}
      <div
        className={`inline-block mb-6 ${depth > 0 ? "ml-8" : ""}`}
        style={{ animationDelay: `${depth * 0.1}s` }}
      >
        <div
          className="card p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all max-w-xs border-l-3 border-l-[var(--color-accent)]"
          onClick={() => onMemberClick && onMemberClick(member)}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-sm">
              {member.fullName?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-[var(--color-text)] truncate">
                {member.fullName}
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {member.gender} · Gen {member.generation || 1}
              </p>
              {member.dateOfBirth && (
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {new Date(member.dateOfBirth).getFullYear()}
                  {member.dateOfDeath && ` - ${new Date(member.dateOfDeath).getFullYear()}`}
                </p>
              )}
            </div>
          </div>
          
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="mt-3 text-xs text-[var(--color-accent)] font-semibold flex items-center gap-1 hover:underline"
            >
              {expanded ? <HiChevronDown className="w-3.5 h-3.5" /> : <HiChevronRight className="w-3.5 h-3.5" />}
              {member.children.length} {member.children.length === 1 ? "child" : "children"}
            </button>
          )}
        </div>
      </div>

      {/* Children Nodes */}
      {hasChildren && expanded && (
        <div className="ml-8 border-l-2 border-[var(--color-accent)]/20 pl-4">
          {member.children.map((child) => (
            <FamilyTreeNode
              key={child._id}
              member={child}
              onMemberClick={onMemberClick}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FamilyTree = ({ rootMember, onMemberClick }) => {
  if (!rootMember) {
    return (
      <div className="card p-12 text-center">
        <HiUserGroup className="mx-auto text-5xl text-[var(--color-border)] mb-3" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          Select a root member to display the family tree
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-auto">
      <div className="inline-block min-w-full">
        <FamilyTreeNode member={rootMember} onMemberClick={onMemberClick} />
      </div>
    </div>
  );
};

export default FamilyTree;
