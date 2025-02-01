const API_KEY = "API_Key";  //Add Your API Key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

async function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    let chatbox = document.getElementById("chatbox");

    if (userInput.trim() === "") return;

    displayMessage("You", userInput, "user");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }]
            })
        });

        if (!response.ok) {
            throw new Error("API Error");
        }

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't understand that.";

        displayMessage("Cortexa", botReply, "bot");

    } catch (error) {
        console.error("Error:", error);
        displayMessage("Bot", "An error occurred. Please try again later.", "bot");
    } finally {
        document.getElementById("userInput").value = "";
    }
}

function displayMessage(sender, message, className) {
    let chatbox = document.getElementById("chatbox");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);

    message = message
    
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>")
        .replace(/\* (.*?)\*/g, "<li>$1</li>");

    if (message.includes("<li>")) {
        message = "<ul>" + message + "</ul>";
    }

    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

document.getElementById("userInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
