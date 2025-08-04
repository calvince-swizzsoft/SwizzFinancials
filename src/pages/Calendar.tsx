

import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

 

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  // FETCH EVENTS FROM BACKEND
  useEffect(() => {
    fetch("http://197.232.170.121:8594/api/club/getAllEvent")
      .then((res) => res.json())
      .then((data) => {
        const mappedEvents = data.map((item: any) => ({
          id: item.id?.toString() || Date.now().toString(),
          title: item.title,
          start: item.startDate,
          end: item.endDate,
          extendedProps: {
            calendar: "Primary", // Can map dynamically if color is provided
          },
        }));
        setEvents(mappedEvents);
      })
      .catch((error) => console.error("Failed to fetch events:", error));
  }, []);

  // HANDLE DATE SELECT
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  // HANDLE CLICK ON EVENT
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  // HANDLE ADD/UPDATE EVENT
  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update in UI only (no backend update implemented)
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel },
              }
            : event
        )
      );
    } else {
      // Create via API
      const payload = {
        title: eventTitle,
        description: "Auto-generated event",
        location: "Club Venue",
        startDate: eventStartDate,
        endDate: eventEndDate,
        organizerId: 1,
        maxAttendees: 100,
        coverCharge: 0,
        rsvpDeadline: eventStartDate,
      };

      fetch("http://102.209.56.234:8586/api/club/createEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response?.status === "00" || response?.success) {
            const newEvent: CalendarEvent = {
              id: Date.now().toString(),
              title: eventTitle,
              start: eventStartDate,
              end: eventEndDate,
              allDay: true,
              extendedProps: { calendar: eventLevel },
            };
            setEvents((prev) => [...prev, newEvent]);
          } else {
            alert("Failed to create event");
          }
        })
        .catch((err) => console.error("Create event failed:", err));
    }

    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta title="Event Calendar" description="Manage and view events" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Add Event +",
                click: openModal,
              },
            }}
          />
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? "Edit Event" : "Add Event"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Plan your next big moment: schedule or edit an event to stay on track
              </p>
            </div>

            {/* Title */}
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Title
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Color */}
            <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Color
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key]) => (
                  <label key={key} className="flex items-center text-sm text-gray-700 dark:text-gray-400">
                    <input
                      type="radio"
                      name="event-level"
                      value={key}
                      checked={eventLevel === key}
                      onChange={() => setEventLevel(key)}
                      className="mr-2"
                    />
                    {key}
                  </label>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Start Date
              </label>
              <input
                type="date"
                value={eventStartDate}
                onChange={(e) => setEventStartDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* End Date */}
            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                End Date
              </label>
              <input
                type="date"
                value={eventEndDate}
                onChange={(e) => setEventEndDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6 sm:justify-end">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                {selectedEvent ? "Update Event" : "Add Event"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase()}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
