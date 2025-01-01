// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC-HS24dGBD_bllLyCvZIxAc_GTqu_YPyE",
  authDomain: "messagekb.firebaseapp.com",
  databaseURL: "https://messagekb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "messagekb",
  storageBucket: "messagekb.firebasestorage.app",
  messagingSenderId: "1005747914315",
  appId: "1:1005747914315:web:e816790a8258edec1eafce",
  measurementId: "G-RK87J80XJR"
};

// Firebase'i Başlat
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Mesajlaşma Elemanları
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Mesajı ekrana eklemek için bir fonksiyon
function addMessage(content, type = "user") {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${type}`;
  messageElement.textContent = content;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Otomatik kaydırma
}

// Veritabanına mesaj ekleme
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    db.ref("messages").push({
      sender: "user1",
      content: message,
      timestamp: Date.now()
    });
    messageInput.value = "";
  }
});

// Veritabanından mesajları alma
db.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const messageType = data.sender === "user1" ? "user" : "bot";
  addMessage(data.content, messageType);
});
