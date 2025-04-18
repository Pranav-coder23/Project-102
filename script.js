// script.js

const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const typingIndicator = document.getElementById("typing-indicator");

// ✅ Gemini API Setup
const API_KEY = "AIzaSyDoGOXcgqnHs-vrqjpTAPc28ALZJr-akp8"; // Caution: Do NOT expose in production
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Scroll to the latest message
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Add message to chat window
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = text;
  chatWindow.appendChild(messageDiv);
  scrollToBottom();
}

async function getBotResponse(userMessage) {
  typingIndicator.style.display = "block";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();
    typingIndicator.style.display = "none";

    if (
      response.ok &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content.parts.length > 0
    ) {
      const reply = data.candidates[0].content.parts[0].text;
      addMessage(reply, "bot");
    } else {
      addMessage("⚠️ I couldn't understand that. Please try again.", "bot");
    }
  } catch (error) {
    console.error("API Error:", error);
    typingIndicator.style.display = "none";
    addMessage("❌ Error connecting to AI. Please try again later.", "bot");
  }
}

// Form submit handler
chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message === "") return;

  addMessage(message, "user");
  userInput.value = "";
  getBotResponse(message);
});

