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
const auth = firebase.auth();
const db = firebase.database();

// DOM Elemanları
const registerName = document.getElementById("register-name");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerButton = document.getElementById("register-button");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");
const googleButton = document.getElementById("google-button");
const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");

// Kullanıcı Kaydı
registerButton.addEventListener("click", () => {
  const name = registerName.value;
  const email = registerEmail.value;
  const password = registerPassword.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      db.ref(`users/${user.uid}`).set({
        name: name,
        email: email
      });
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    })
    .catch((error) => {
      alert("Kayıt hatası: " + error.message);
    });
});

// Kullanıcı Girişi
loginButton.addEventListener("click", () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      authContainer.style.display = "none";
      chatContainer.style.display = "block";
    })
    .catch((error) => {
      alert("Giriş hatası: " + error.message);
    });
});

// Google ile Giriş
googleButton.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      db.ref(`users/${user.uid}`).once("value", (snapshot) => {
        if (!snapshot.exists()) {
          db.ref(`users/${user.uid}`).set({
            name: user.displayName || "Google User",
            email: user.email
          });
        }
      });
      authContainer.style.display = "none";
      chatContainer.style.display = "block";
    })
    .catch((error) => {
      alert("Google ile giriş hatası: " + error.message);
    });
});
