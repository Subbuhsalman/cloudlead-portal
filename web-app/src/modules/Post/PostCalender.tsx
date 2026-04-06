"use client";
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ChevronLeft, ChevronRight, Plus, Grid3X3, Globe, ChevronDown, X } from 'lucide-react';
import { usePostHook } from './PostHook';
import { Post } from '@/types';
import momentTimezonePlugin from '@fullcalendar/moment-timezone'

// Event Creation/Edit Modal
const EventModal = ({ isOpen, onClose, onSave, onDelete, selectedDate, existingEvent = null }: any) => {


    return (
        <>
        </>
    );
};

const PostCalender = ({ channelId }: any) => {
    const calendarRef = useRef<any>(null);

    const { getPaginatedPostCalender, calendarList } = usePostHook()

    function convertPostsToEvents(posts: any[]): any[] {
        return posts.map((post) => {
            const scheduledTime = post.schedule.scheduled_time;
            
            // Simple approach: use the stored UTC time and let FullCalendar handle timezone conversion
            // FullCalendar will automatically convert UTC times to the specified timezone
            console.log("scheduledTime", scheduledTime)
            const isPublished = post.status === "PUBLISHED";
            return {
                id: String(post.post_id),
                title: post.content,
                start: scheduledTime, // Use ISO string, let FullCalendar handle timezone conversion
                end: scheduledTime,
                backgroundColor: isPublished ? "#8B5CF6" : "#F59E0B",
                borderColor: isPublished ? "#7C3AED" : "#D97706",
                textColor: "#FFFFFF",
                extendedProps: {
                    status: post.status,
                    timezone: post.schedule.timezone,
                    originalTime: scheduledTime,
                    displayTimezone: selectedTimezone,
                    channel_id: post.channel_id,
                },
            };
        });
    }



    const [events, setEvents] = useState<any[]>([]); // ✅ Safe default
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [selectedTimezone, setSelectedTimezone] = useState('Asia/Karachi');
    const [viewMode, setViewMode] = useState('timeGridWeek');

    const channels = ['All Channels', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'TikTok'];
    const timezones = [
        { label: 'UTC (Coordinated Universal Time)', value: 'UTC' },
        { label: 'GMT (Greenwich Mean Time)', value: 'Etc/GMT' },
        { label: 'New York (Eastern Time)', value: 'America/New_York' },
        { label: 'Chicago (Central Time)', value: 'America/Chicago' },
        { label: 'Denver (Mountain Time)', value: 'America/Denver' },
        { label: 'Los Angeles (Pacific Time)', value: 'America/Los_Angeles' },
        { label: 'Toronto (Eastern Time - Canada)', value: 'America/Toronto' },
        { label: 'Vancouver (Pacific Time - Canada)', value: 'America/Vancouver' },
        { label: 'São Paulo (Brazil)', value: 'America/Sao_Paulo' },
        { label: 'London (UK)', value: 'Europe/London' },
        { label: 'Paris (France)', value: 'Europe/Paris' },
        { label: 'Berlin (Germany)', value: 'Europe/Berlin' },
        { label: 'Moscow (Russia)', value: 'Europe/Moscow' },
        { label: 'Istanbul (Turkey)', value: 'Europe/Istanbul' },
        { label: 'Cairo (Egypt)', value: 'Africa/Cairo' },
        { label: 'Dubai (UAE)', value: 'Asia/Dubai' },
        { label: 'Karachi (Pakistan)', value: 'Asia/Karachi' },
        { label: 'Kolkata (India)', value: 'Asia/Kolkata' },
        { label: 'Dhaka (Bangladesh)', value: 'Asia/Dhaka' },
        { label: 'Bangkok (Thailand)', value: 'Asia/Bangkok' },
        { label: 'Singapore', value: 'Asia/Singapore' },
        { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
        { label: 'Tokyo (Japan)', value: 'Asia/Tokyo' },
        { label: 'Seoul (South Korea)', value: 'Asia/Seoul' },
        { label: 'Shanghai (China)', value: 'Asia/Shanghai' },
        { label: 'Sydney (Australia)', value: 'Australia/Sydney' },
        { label: 'Melbourne (Australia)', value: 'Australia/Melbourne' },
        { label: 'Auckland (New Zealand)', value: 'Pacific/Auckland' }
    ];
    const viewModes = [
        { value: 'timeGridDay', label: 'Day' },
        { value: 'timeGridWeek', label: 'Week' },
        { value: 'dayGridMonth', label: 'Month' }
    ];

    // Handle date cell click
    const handleDateSelect = (selectInfo: any) => {
        setSelectedDate(selectInfo.start);
        setEditingEvent(null);
        setShowEventModal(true);
    };

    // Handle event click
    const handleEventClick = (clickInfo: any) => {
        setEditingEvent(clickInfo.event);
        setSelectedDate(clickInfo.event.start);
        setShowEventModal(true);
    };

    // Save event (create or update)
    const handleSaveEvent = (eventData: any) => {
        if (editingEvent) {
            // Update existing event
            setEvents(events.map(event =>
                event.id === editingEvent.id ? eventData : event
            ));
        } else {
            // Create new event
            setEvents([...events, eventData]);
        }
    };

    // Delete event
    const handleDeleteEvent = (eventId: any) => {
        setEvents(events.filter(event => event.id !== eventId));
    };

    // Navigation functions
    const goToPrev = () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.prev();
        setCurrentDate(calendarApi.getDate());
    };

    const goToNext = () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.next();
        setCurrentDate(calendarApi.getDate());
    };

    const goToToday = () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.today();
        setCurrentDate(new Date());
    };


    // Change view
    const handleViewChange = (newView: any) => {
        setViewMode(newView);
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(newView);
    };
    const [currentDate, setCurrentDate] = useState(new Date());

    const getCurrentMonthYear = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    };

    // Handle timezone change
    const handleTimezoneChange = (newTimezone: string) => {
        console.log("🌍 Timezone changed from", selectedTimezone, "to", newTimezone);
        setSelectedTimezone(newTimezone);
        
        // Force calendar to re-render with new timezone
        setTimeout(() => {
            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi) {
                calendarApi.render();
            }
        }, 100);
    };

    // useEffect(() => {
    //     const events: any = convertPostsToEvents(calendarList);
    //     setEvents(events);
    //     return () => { }
    // }, [calendarList])

    useEffect(() => {
        if (!calendarList || !Array.isArray(calendarList)) return;
        const events = convertPostsToEvents(calendarList);
        setEvents(events);
    }, [calendarList, selectedTimezone]); // Added selectedTimezone dependency

    useEffect(() => {
        getPaginatedPostCalender({ selectedTimezone, viewMode });
    }, [currentDate, selectedTimezone, viewMode]);


    return (
        <div className="w-full h-screen bg-gray-50 p-4">
            {/* Custom Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToPrev}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>

                    <h1 className="text-lg font-medium text-gray-900">{getCurrentMonthYear()}</h1>
                    <button
                        onClick={goToToday}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Today
                    </button>

                    <div className="relative">
                        <select
                            value={viewMode}
                            onChange={(e) => handleViewChange(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {viewModes.map(mode => (
                                <option key={mode.value} value={mode.value}>{mode.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={selectedTimezone}
                            onChange={(e) => handleTimezoneChange(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 pl-8 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {timezones.map(timezone => (
                                <option key={timezone.value} value={timezone.value}>{timezone.label}</option>
                            ))}
                        </select>
                        <Globe size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                        <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>
            {/* FullCalendar Component */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, momentTimezonePlugin]}
                    initialView="dayGridMonth"
                    initialDate={new Date()}
                    headerToolbar={false} // We're using custom header
                    events={events}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    slotMinTime="00:00:00"
                    slotMaxTime="24:00:00"
                    slotDuration="01:00:00"
                    slotLabelInterval="01:00:00"
                    height="100%"
                    timeZone={selectedTimezone}
                    expandRows={true}
                    nowIndicator={true}
                    scrollTime="08:00:00"
                    allDaySlot={false}
                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        omitZeroMinute: false,
                        meridiem: 'short'
                    }}
                    dayHeaderFormat={{
                        weekday: 'long',
                        day: 'numeric'
                    }}
                    eventDisplay="block"
                    eventTextColor="#FFFFFF"
                    eventBackgroundColor="#8B5CF6"
                    eventBorderColor="#7C3AED"
                    // Custom styling
                    dayHeaderContent={(args) => {
                        const isToday = args.date.toDateString() === new Date().toDateString();
                        return (
                            <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                    {args.date.toLocaleDateString('en-US', { weekday: 'long' })}
                                </div>
                                <div className={`text-sm font-medium ${isToday
                                    ? 'text-white bg-[var(--primary-color)] w-6 h-6 rounded-full flex items-center justify-center mx-auto'
                                    : 'text-gray-900'
                                    }`}>
                                    {args.date.getDate()}
                                </div>
                            </div>
                        );
                    }}
                    // Custom CSS classes
                    eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                    dayCellClassNames="hover:bg-gray-50 transition-colors"
                />
            </div>

            {/* Event Modal */}
            <EventModal
                isOpen={showEventModal}
                onClose={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                    setSelectedDate(null);
                }}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                selectedDate={selectedDate}
                existingEvent={editingEvent}
            />

            {/* Custom CSS for FullCalendar styling */}
            <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        
        .fc-theme-standard td, 
        .fc-theme-standard th {
          border-color: #e5e7eb;
        }
        
        .fc-timegrid-slot {
          height: 60px;
        }
        
        .fc-timegrid-slot-label {
          font-size: 12px;
          color: #6b7280;
        }
        
        .fc-col-header-cell {
          background-color: #f9fafb;
          padding: 12px;
        }
        
        .fc-timegrid-axis {
          background-color: #f9fafb;
        }
        
        .fc-event {
          border-radius: 4px;
          font-size: 12px;
          padding: 2px 4px;
        }
        
        .fc-event-title {
          font-weight: 500;
        }
        
        .fc-daygrid-event {
          margin: 1px;
        }
        
        .fc-timegrid-event {
          margin: 1px;
        }
        
        .fc-h-event {
          background-color: #8B5CF6 !important;
          border-color: #7C3AED !important;
        }
        
        .fc-today {
          background-color: rgba(139, 92, 246, 0.05) !important;
        }
        
        .fc-timegrid-col.fc-day-today {
          background-color: rgba(139, 92, 246, 0.05);
        }
        
        .fc-scrollgrid {
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>

            {/* Stats Bar */}
            <div className="mt-4 text-sm text-gray-600 text-center">
                Total Events: {events?.length || 0} | Channel: | Timezone: {selectedTimezone}
            </div>
        </div>
    );
};

export { PostCalender };


