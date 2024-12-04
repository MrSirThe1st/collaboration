// tests/directMessage.test.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/direct-messages";
let authToken;
let testMessageId;

// Test user credentials
const testUser = {
  email: "Rebeccakatumbay@gmail.com",
  password: "123456",
};

// Create axios instance with default config
const axiosInstance = axios.create({
  withCredentials: true,
  // Setting default headers for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Login function to get auth token
const login = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/user/login",
      testUser,
      { withCredentials: true }
    );

    // Add debug logging for response
    console.log("Login response:", response.data);

    // Get token from cookie
    const cookies = response.headers["set-cookie"];
    if (cookies) {
      const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
      if (tokenCookie) {
        authToken = tokenCookie.split(";")[0].split("=")[1];
      }
    }

    if (!authToken) {
      console.error("✗ No token received in response");
      return false;
    }

    console.log("✓ Login successful with token:", authToken);
    return true;
  } catch (error) {
    console.error("✗ Login failed:", error.response?.data || error.message);
    return false;
  }
};

// Helper function to get request config with cookie
const getRequestConfig = () => ({
  headers: {
    Cookie: `token=${authToken}`,
  },
  withCredentials: true,
});

// Test sending a direct message
const testSendMessage = async (recipientId) => {
  try {
    console.log("Sending message with token:", authToken); // Debug log
    const response = await axios.post(
      `${BASE_URL}/send`,
      {
        recipientId,
        content: "Hello, this is a test message!",
      },
      getRequestConfig()
    );

    if (response.data.success) {
      testMessageId = response.data.message._id;
      console.log("✓ Send message test passed");
      return response.data.message;
    }
  } catch (error) {
    console.error(
      "✗ Send message test failed:",
      error.response?.data || error.message,
      "\nFull error:",
      error
    );
  }
};

// Test getting a conversation
const testGetConversation = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/conversation/${userId}`,
      getRequestConfig()
    );

    if (response.data.success) {
      console.log("✓ Get conversation test passed");
      console.log("Messages:", response.data.messages.length);
    }
  } catch (error) {
    console.error(
      "✗ Get conversation test failed:",
      error.response?.data || error.message
    );
  }
};

// Test getting conversation list
const testGetConversationList = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/conversations`,
      getRequestConfig()
    );

    if (response.data.success) {
      console.log("✓ Get conversation list test passed");
      console.log("Conversations:", response.data.conversations.length);
    }
  } catch (error) {
    console.error(
      "✗ Get conversation list test failed:",
      error.response?.data || error.message
    );
  }
};

// Test marking a message as read
const testMarkMessageAsRead = async (messageId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/read/${messageId}`,
      {},
      getRequestConfig()
    );

    if (response.data.success) {
      console.log("✓ Mark message as read test passed");
    }
  } catch (error) {
    console.error(
      "✗ Mark message as read test failed:",
      error.response?.data || error.message
    );
  }
};

// Test editing a message
const testEditMessage = async (messageId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${messageId}`,
      {
        content: "This message has been edited",
      },
      getRequestConfig()
    );

    if (response.data.success) {
      console.log("✓ Edit message test passed");
    }
  } catch (error) {
    console.error(
      "✗ Edit message test failed:",
      error.response?.data || error.message
    );
  }
};

// Test deleting a message
const testDeleteMessage = async (messageId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/${messageId}`,
      getRequestConfig()
    );

    if (response.data.success) {
      console.log("✓ Delete message test passed");
    }
  } catch (error) {
    console.error(
      "✗ Delete message test failed:",
      error.response?.data || error.message
    );
  }
};

// Run all tests
const runTests = async () => {
  console.log("Starting Direct Message API tests...\n");

  // First login to get the auth token
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("Tests aborted due to login failure");
    return;
  }

  // Add a small delay after login to ensure cookie is set
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const recipientId = "66fdc24a9d6b669f957a50a7";

  // Run the tests in sequence
  const message = await testSendMessage(recipientId);
  if (message) {
    await testMarkMessageAsRead(message._id);
    await testEditMessage(message._id);
    await testGetConversation(recipientId);
    await testGetConversationList();
    await testDeleteMessage(message._id);
  }

  console.log("\nTests completed!");
};

runTests();
