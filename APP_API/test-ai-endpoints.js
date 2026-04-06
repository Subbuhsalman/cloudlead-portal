const axios = require('axios');

const BASE_URL = 'http://localhost:3750';
const TEST_TOKEN = 'your-test-jwt-token'; // Replace with actual test token

const testData = {
  topic: "Introducing Cloud Lead Express Freight",
  postObjective: "Generate awareness and drive sign-ups for our new B2B shipping solution",
  program: "Express Freight Program",
  targetedIndustry: "Logistics and E-commerce",
  targetedAudience: "Small to medium business owners and logistics managers",
  toneOfVoice: "Professional yet approachable, emphasizing trust and efficiency",
  contentType: "social_post",
  platform: "LinkedIn",
  brandName: "Cloud Lead",
  additionalContext: "Focus on B2B benefits, real-time tracking, and seamless integration"
};

async function testAIEndpoints() {
  console.log('Testing AI Content Generation Endpoints...\n');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
  };

  try {
    // Test social post generation
    console.log('1. Testing Social Post Generation...');
    const socialResponse = await axios.post(`${BASE_URL}/ai/generate-social-post`, testData, { headers });
    console.log('✅ Social Post Response:', JSON.stringify(socialResponse.data, null, 2));
    console.log('');

    // Test email generation
    console.log('2. Testing Email Generation...');
    const emailResponse = await axios.post(`${BASE_URL}/ai/generate-email`, testData, { headers });
    console.log('✅ Email Response:', JSON.stringify(emailResponse.data, null, 2));
    console.log('');

    // Test blog generation
    console.log('3. Testing Blog Generation...');
    const blogResponse = await axios.post(`${BASE_URL}/ai/generate-blog`, testData, { headers });
    console.log('✅ Blog Response:', JSON.stringify(blogResponse.data, null, 2));
    console.log('');

    // Test B2B content generation
    console.log('4. Testing B2B Content Generation...');
    const b2bResponse = await axios.post(`${BASE_URL}/ai/generate-b2b-content`, testData, { headers });
    console.log('✅ B2B Content Response:', JSON.stringify(b2bResponse.data, null, 2));
    console.log('');

    console.log('🎉 All AI endpoints tested successfully!');

  } catch (error) {
    console.error('❌ Error testing AI endpoints:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Make sure to update the TEST_TOKEN with a valid JWT token');
    }
  }
}

// Run the test
testAIEndpoints();
