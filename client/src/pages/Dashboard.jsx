import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { membersAPI, newbornAPI, eventsAPI } from "../services/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { 
  HiUsers, 
  HiHeart, 
  HiUserGroup, 
  HiUser,
  HiArrowRight,
  HiClock,
  HiLocationMarker,
  HiBadgeCheck
} from "react-icons/hi";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMembers, setRecentMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, membersRes, requestsRes, eventsRes] = await Promise.all([
        membersAPI.getStats(),
        membersAPI.getAll({ limit: 5, page: 1 }),
        newbornAPI.getAll({ status: "Pending" }),
        eventsAPI.getAll({ upcoming: true })
      ]);

      setStats(statsRes.data);
      setRecentMembers(membersRes.data.members);
      setPendingRequests(requestsRes.data);
      setUpcomingEvents(eventsRes.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d0d0d] via-[#1a1a2e] to-[#0d0d0d] text-white p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-info)]/10 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
              {user?.fullName}
            </h1>
            <p className="text-sm sm:text-base text-white/60 max-w-lg">
              Preserving our heritage, one story at a time. Manage the clan archive seamlessly.
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid stagger-children">
          <StatCard
            title="Total Members"
            value={stats?.totalMembers || 0}
            icon={HiUsers}
            color="primary"
          />
          <StatCard
            title="Living Members"
            value={stats?.livingMembers || 0}
            icon={HiHeart}
            color="success"
          />
          <StatCard
            title="Male Members"
            value={stats?.maleCount || 0}
            icon={HiUser}
            color="secondary"
          />
          <StatCard
            title="Female Members"
            value={stats?.femaleCount || 0}
            icon={HiUserGroup}
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Members */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold">Recent Members</h2>
              <Link to="/members" className="text-[var(--color-accent)] hover:text-[var(--color-accent-secondary)] text-xs font-semibold flex items-center gap-1 transition-colors uppercase tracking-wider">
                View All <HiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentMembers.length > 0 ? (
                recentMembers.map((member, i) => (
                  <Link
                    key={member._id}
                    to={`/members/${member._id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-accent-light)]/50 transition-all group"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                      {member.fullName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[var(--color-text)] truncate">
                        {member.fullName}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                        {member.occupation || "No occupation listed"}
                      </p>
                    </div>
                    <span className="badge badge-success text-[10px] flex-shrink-0">
                      Gen {member.generation}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="empty-state py-8">
                  <HiUsers className="mx-auto text-5xl opacity-20 mb-3" />
                  <p className="text-sm">No members yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Requests (Admin/Clan Admin only) */}
          {user?.role !== "Viewer" && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">Pending Requests</h2>
                  {pendingRequests.length > 0 && (
                    <span className="w-5 h-5 bg-[var(--color-warning)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {pendingRequests.length}
                    </span>
                  )}
                </div>
                <Link to="/newborn-requests" className="text-[var(--color-accent)] hover:text-[var(--color-accent-secondary)] text-xs font-semibold flex items-center gap-1 transition-colors uppercase tracking-wider">
                  View All <HiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-2">
                {pendingRequests.length > 0 ? (
                  pendingRequests.slice(0, 5).map((request) => (
                    <div
                      key={request._id}
                      className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 hover:border-amber-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-[var(--color-text)]">
                            {request.fullName}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                            {request.gender} -- {new Date(request.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="badge badge-warning text-[10px]">Pending</span>
                      </div>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2 flex items-center gap-1">
                        <HiClock className="w-3 h-3" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state py-8">
                    <HiBadgeCheck className="mx-auto text-5xl opacity-20 mb-3" />
                    <p className="text-sm">No pending requests</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {user?.role === "Viewer" && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold">Upcoming Events</h2>
                <Link to="/events" className="text-[var(--color-accent)] hover:text-[var(--color-accent-secondary)] text-xs font-semibold flex items-center gap-1 transition-colors uppercase tracking-wider">
                  View All <HiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-2">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event._id} className="p-4 rounded-xl bg-[var(--color-border-light)] hover:bg-[var(--color-border)] transition-colors">
                      <p className="font-semibold text-sm text-[var(--color-text)]">
                        {event.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 flex items-center gap-2">
                        <HiClock className="w-3.5 h-3.5" />
                        {new Date(event.eventDate).toLocaleDateString()}
                        {event.location && (
                          <>
                            <HiLocationMarker className="w-3.5 h-3.5 ml-1" />
                            {event.location}
                          </>
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="empty-state py-8">
                    <p className="text-sm">No upcoming events</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Generation Distribution */}
        {stats?.generations && stats.generations.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6">Generation Distribution</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 stagger-children">
              {stats.generations.map((gen) => (
                <div key={gen._id} className="text-center p-5 rounded-2xl bg-gradient-to-br from-[var(--color-border-light)] to-[var(--color-background)] hover:shadow-lg hover:-translate-y-1 transition-all cursor-default border border-transparent hover:border-[var(--color-accent)]/20">
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mb-2 font-bold uppercase tracking-widest">
                    Gen {gen._id}
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
                    {gen.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
