# Timezone-Aware Calendar Fix

## Problem
The calendar was not reflecting timezone changes when users switched between different timezones in the dropdown.

## Root Cause
1. **Frontend**: Events were using raw UTC times without timezone conversion
2. **Backend**: Date filtering was too restrictive and timezone-dependent
3. **FullCalendar**: Timezone property wasn't properly configured

## Solution Implemented

### 1. Frontend Changes (`PostCalender.tsx`)

#### Enhanced Event Conversion
```typescript
function convertPostsToEvents(posts: any[]): any[] {
    return posts.map((post) => {
        const scheduledTime = post.schedule.scheduled_time;
        
        // Use UTC ISO string and let FullCalendar handle timezone conversion
        const utcDate = new Date(scheduledTime);
        const isoString = utcDate.toISOString();
        
        return {
            start: isoString, // FullCalendar automatically converts to selected timezone
            end: isoString,
            extendedProps: {
                displayTimezone: selectedTimezone,
                originalTime: scheduledTime,
                // ... other props
            }
        };
    });
}
```

#### Timezone Change Handler
```typescript
const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
    
    // Force calendar re-render
    setTimeout(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.render();
        }
    }, 100);
};
```

#### FullCalendar Configuration
```typescript
<FullCalendar
    timeZone={selectedTimezone} // ✅ Now properly set
    // ... other props
/>
```

### 2. Backend Changes (`PostRepository.ts`)

#### Broader Date Range
```typescript
// Instead of filtering by current view range, get broader range
if (viewMode) {
    const now = DateTime.now();
    const startRange = now.minus({ months: 3 }).startOf('month');
    const endRange = now.plus({ months: 3 }).endOf('month');
    
    where.schedule = {
        scheduled_time: {
            gte: new Date(startRange.toISO()),
            lte: new Date(endRange.toISO())
        }
    };
}
```

### 3. Debug Features Added

#### Debug Panel
- Shows selected timezone
- Displays event count vs raw data count
- Shows sample event times for verification

#### Enhanced Logging
- Frontend logs timezone changes and event conversions
- Backend logs date range filters and result counts

## How to Test

### 1. Create Test Posts
```sql
-- Sample posts in different timezones
INSERT INTO post_schedules (scheduled_time, timezone, post_id) VALUES
('2025-07-29 22:42:06.963', 'Asia/Karachi', 25),
('2025-07-29 22:45:00.000', 'America/New_York', 26),
('2025-07-29 22:44:46.490', 'Europe/London', 27);
```

### 2. Test Timezone Switching
1. Open calendar
2. Note current event times
3. Switch timezone dropdown (e.g., from Asia/Karachi to America/New_York)
4. Verify events move to correct times in new timezone
5. Check debug panel for conversion details

### 3. Expected Behavior
- **Asia/Karachi to UTC**: Events should shift +5 hours
- **Asia/Karachi to America/New_York**: Events should shift +10 hours (during standard time)
- **UTC to any timezone**: Events should shift by that timezone's offset

### 4. Debug Console Logs
Look for these logs:
```
🌍 Timezone changed from Asia/Karachi to America/New_York
📅 Converting posts to events with timezone: America/New_York
🕰️ Post 25: { original: "...", isoString: "...", selectedTimezone: "America/New_York" }
📅 Backend calendar request: { viewMode: "dayGridMonth", selectedTimezone: "America/New_York" }
```

## Key Features

✅ **Timezone-aware display**: Events show in selected timezone  
✅ **Real-time switching**: No page refresh needed  
✅ **Debug visibility**: Clear logging and debug panel  
✅ **Broader data fetching**: Backend gets sufficient data range  
✅ **FullCalendar integration**: Proper timezone configuration  

## Cleanup
Remove the debug panel in production by deleting the "Debug Panel" section in `PostCalender.tsx`.

## Monitoring
- Watch browser console for timezone conversion logs
- Monitor backend logs for date range filtering
- Verify events appear at correct times after timezone changes