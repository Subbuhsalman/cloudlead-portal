# AI Content Generation Features

This document describes the AI content generation features implemented in the Cloud Lead API.

## Overview

The AI module provides endpoints for generating various types of marketing content using OpenAI's GPT-4 model. The system is designed to create engaging, brand-appropriate content based on user specifications.

## API Endpoints

### Base URL
All AI endpoints are prefixed with `/ai`

### Available Endpoints

1. **Generate General Content**
   - `POST /ai/generate-content`
   - Generates general marketing content

2. **Generate Social Media Post**
   - `POST /ai/generate-social-post`
   - Creates social media posts with hashtags and call-to-action

3. **Generate Email Content**
   - `POST /ai/generate-email`
   - Creates professional email content with subject lines

4. **Generate Blog Post**
   - `POST /ai/generate-blog`
   - Creates comprehensive blog posts with proper structure

5. **Generate B2B Content**
   - `POST /ai/generate-b2b-content`
   - Creates business-focused content for B2B audiences

## Request Format

All endpoints accept the same request body structure:

```json
{
  "topic": "string (required)",
  "postObjective": "string (required)",
  "program": "string (optional)",
  "targetedIndustry": "string (required)",
  "targetedAudience": "string (required)",
  "toneOfVoice": "string (required)",
  "contentType": "social_post | email | blog | b2b_content | marketing_content (optional)",
  "platform": "string (optional)",
  "brandName": "string (optional)",
  "additionalContext": "string (optional)"
}
```

## Response Format

```json
{
  "content": "string",
  "hashtags": ["string"],
  "callToAction": "string",
  "images": ["string"]
}
```

## Authentication

All AI endpoints require JWT authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

The following environment variables need to be configured:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `500`: Internal Server Error

## Mobile App Integration

The mobile app includes a dedicated AI Assistant screen that:

1. Collects user input through a form
2. Sends requests to the AI endpoints
3. Displays generated content
4. Provides options to copy content or modify prompts

## Security Considerations

1. All requests are validated using Zod schemas
2. JWT authentication is required for all endpoints
3. Input sanitization is performed
4. Rate limiting should be implemented in production

## Usage Examples

### Generate a Social Media Post

```javascript
const response = await fetch('/ai/generate-social-post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    topic: "Introducing our new shipping solution",
    postObjective: "Generate awareness and drive sign-ups",
    targetedIndustry: "Logistics and E-commerce",
    targetedAudience: "Small to medium business owners",
    toneOfVoice: "Professional yet approachable"
  })
});
```

## Future Enhancements

1. Content templates for different industries
2. Multi-language support
3. Content scheduling integration
4. Performance analytics
5. Custom brand voice training
