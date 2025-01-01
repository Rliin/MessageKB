// Kullanıcı Oturumunu Dinleme
auth.onAuthStateChanged((user) => {
  if (user) {
    authContainer.style.display = "none";
    chatContainer.style.display = "block";
    db.ref(`users/${user.uid}/name`).once("value").then((snapshot) => {
      const name = snapshot.val();
      document.getElementById("current-user-name").textContent = `Merhaba, ${name}`;
    });
  } else {
    authContainer.style.display = "flex";
    chatContainer.style.display = "none";
  }
});

// Kullanıcı Adını Değiştirme
document.getElementById("change-name-button").addEventListener("click", () => {
  const newName = document.getElementById("new-user-name").value.trim();
  if (newName) {
    const user = auth.currentUser;
    db.ref(`users/${user.uid}/name`).set(newName).then(() => {
      document.getElementById("current-user-name").textContent = `Hello, ${newName}`;
      alert("Adınız başarıyla değiştirildi!");
    }).catch((error) => {
      alert("Ad değiştirme hatası: " + error.message);
    });
  }
});

// Mesaj Gönderme
document.getElementById("send-button").addEventListener("click", () => {
  const message = document.getElementById("message-input").value.trim(); // Mesaj alanı
  if (message) {
    const user = auth.currentUser; // Şu anki kullanıcı
    if (!user) {
      alert("Mesaj göndermek için giriş yapmanız gerekiyor!");
      return;
    }
    db.ref(`users/${user.uid}/name`).once("value").then((snapshot) => {
      const name = snapshot.val(); // Kullanıcının adı
      if (!name) {
        alert("Adınız veritabanında bulunamadı. Lütfen tekrar giriş yapın.");
        return;
      }
      db.ref("messages").push({
        sender: name, // Gönderici
        content: message, // Mesaj içeriği
        timestamp: Date.now() // Zaman damgası
      });
      document.getElementById("message-input").value = ""; // Mesaj alanını temizle
    }).catch((error) => {
      console.error("Ad alınırken hata:", error);
    });
  } else {
    alert("Boş mesaj gönderemezsiniz!");
  }
});


// Mesajları Alma
db.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val(); // Firebase'den mesaj verisi
  if (data) {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${data.sender}: ${data.content}`; // Gönderici ve mesaj
    document.getElementById("messages").appendChild(messageElement); // Mesajı ekle
  } else {
    console.error("Mesaj verisi alınamadı:", snapshot);
  }
});

// Çıkış Yapma
document.getElementById("logout-button").addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      alert("Başarıyla çıkış yaptınız!");
      authContainer.style.display = "flex";
      chatContainer.style.display = "none";
    })
    .catch((error) => {
      console.error("Çıkış yaparken hata:", error);
    });
});
