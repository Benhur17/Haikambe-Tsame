import React, { useState, useEffect } from "react";
import { eventsAPI } from "../services/api";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { 
  HiCalendar, 
  HiLocationMarker, 
  HiUsers, 
  HiOfficeBuilding, 
  HiTag,
  HiClock
} from "react-icons/hi";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [filterStatus]);

  const fetchEvents = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const { data } = await eventsAPI.getAll(params);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const upcomingEvents = events.filter(
    (e) => new Date(e.eventDate) >= new Date()
  );
  const pastEvents = events.filter((e) => new Date(e.eventDate) < new Date());

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Clan Events</h1>
          <p className="page-description">
            Gatherings, ceremonies, and important occasions that bring our community together
          </p>
        </div>

        {/* Status Filter */}
        <div className="card p-6">
          <div className="flex flex-wrap gap-3">
            {["", "Planned", "Completed"].map((status) => (
              <button
                key={status || "all"}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  filterStatus === status
                    ? "bg-[var(--color-accent)] text-white shadow-md"
                    : "bg-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
                }`}
              >
                {status || "All Events"}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && !filterStatus && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <HiClock className="w-6 h-6 text-[var(--color-accent)]" />
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {(pastEvents.length > 0 || filterStatus) && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <HiCalendar className="w-6 h-6 text-[var(--color-text-secondary)]" />
              {filterStatus ? "Events" : "Past Events"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(filterStatus ? events : pastEvents).map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="empty-state">
            <HiCalendar className="empty-state-icon" />
            <h3 className="empty-state-title">No Events Found</h3>
            <p className="empty-state-description">
              Start planning your clan gatherings and ceremonies.
            </p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedEvent?.title || ""}
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div>
              <p className="text-base text-[var(--color-text)] leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--color-border-light)]">
                <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1 flex items-center gap-1">
                  <HiCalendar className="w-3 h-3" />
                  Date
                </p>
                <p className="text-[var(--color-text)] font-semibold">
                  {new Date(selectedEvent.eventDate).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-border-light)]">
                <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1 flex items-center gap-1">
                  <HiTag className="w-3 h-3" />
                  Type
                </p>
                <p className="text-[var(--color-text)] font-semibold">{selectedEvent.type}</p>
              </div>
              {selectedEvent.location && (
                <div className="p-4 rounded-xl bg-[var(--color-border-light)]">
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <HiLocationMarker className="w-3 h-3" />
                    Location
                  </p>
                  <p className="text-[var(--color-text)] font-semibold">{selectedEvent.location}</p>
                </div>
              )}
              {selectedEvent.venue && (
                <div className="p-4 rounded-xl bg-[var(--color-border-light)]">
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <HiOfficeBuilding className="w-3 h-3" />
                    Venue
                  </p>
                  <p className="text-[var(--color-text)] font-semibold">{selectedEvent.venue}</p>
                </div>
              )}
            </div>

            {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                  <HiUsers className="w-4 h-4" />
                  Attendees ({selectedEvent.attendees.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.attendees.map((attendee) => (
                    <span
                      key={attendee._id}
                      className="badge badge-neutral"
                    >
                      {attendee.fullName}
                    </span>
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

const EventCard = ({ event, onClick }) => {
  const isPast = new Date(event.eventDate) < new Date();

  return (
    <div
      className="card p-6 hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-3">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)] mb-2">
            {event.title}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
            {event.description}
          </p>
        </div>
        <span
          className={`badge flex-shrink-0 ${
            isPast
              ? "badge-neutral"
              : "badge-success"
          }`}
        >
          {isPast ? "Past" : "Upcoming"}
        </span>
      </div>

      <div className="space-y-2.5 mt-4">
        <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
          <HiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
        </div>
        {event.location && (
          <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
            <HiLocationMarker className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        <div className="flex items-center text-sm font-semibold text-[var(--color-accent)]">
          <HiTag className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{event.type}</span>
        </div>
      </div>
    </div>
  );
};

export default Events;
