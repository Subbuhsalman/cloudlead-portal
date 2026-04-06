# Post Scheduler Cron Setup

## Installation

1. Install the required dependency:
```bash
npm install node-cron
```

2. Import and start the cron in your main application file (e.g., app.ts or server.ts):
```typescript
// Add this import at the top of your main app file
import './startCrons';
```

## How it works

1. **Cron Schedule**: Runs every minute (`* * * * *`) to check for scheduled posts
2. **Post Selection**: Finds all posts with status `SCHEDULED` and checks timezone-aware scheduling:
   - Converts scheduled_time from UTC to the post's timezone
   - Compares with current time in the same timezone
   - Only selects posts where current_time >= scheduled_time in their respective timezone
3. **Publishing**: Uses your existing `publishToChannel` method to publish to Facebook/Instagram
4. **Status Updates**: Updates post status to `PUBLISHED` on success or `FAILED` on error

## Files Created

- `src/cron/PostSchedulerCron.ts` - Main cron logic
- `src/cron/index.ts` - Cron manager 
- `src/startCrons.ts` - Application startup file

## Usage

Once integrated, scheduled posts will automatically publish at their scheduled time. No additional code needed.

## Timezone Support

The cron system now properly handles timezones:
- Posts scheduled in `Asia/Karachi` will only publish when it's the scheduled time in Karachi
- Posts scheduled in `America/New_York` will only publish when it's the scheduled time in New York
- Each post's `timezone` field from `post_schedules` table is respected

## Monitoring

Check your application logs for:
- "Post scheduler cron started - checking every minute"
- "Found X posts ready for publishing"  
- "Publishing post X scheduled for YYYY-MM-DDTHH:mm:ss (timezone)"
- "✅ Successfully published post X to PLATFORM"
- Error messages for failed publications

## Debug Method

For troubleshooting timezone issues, you can call:
```typescript
const postService = new PostService();
await postService.debugScheduledPosts();
```

This will show all scheduled posts with their timezone calculations.