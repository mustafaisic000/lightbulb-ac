const firebaseConfig = {
  apiKey: "AIzaSyDIh-z3zg8tc3zukbRmpytgJBI0hf9DXHo",
  authDomain: "iot-project---seminarski.firebaseapp.com",
  databaseURL: "https://iot-project---seminarski-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "iot-project---seminarski",
  storageBucket: "iot-project---seminarski.appspot.com",
  messagingSenderId: "563912690752",
  appId: "1:563912690752:web:7e185a32e029db2766a3a5",
  measurementId: "G-WW5ZXKLL8E"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const lightBulbRef = db.ref("Lightbulb");
const bulb = document.getElementById("bulb");
const bulbBefore = document.getElementById("bulb").querySelector(":before");

lightBulbRef.child("Power").on("value", (powerSnapshot) => {
  const power = powerSnapshot.val();
  const body = document.querySelector("body");

  if (power) {
    // Add class to body for the on state
    body.classList.add("on");
    body.classList.remove("off");

    lightBulbRef.child("Brightness").on("value", (brightnessSnapshot) => {
      const brightness = brightnessSnapshot.val();

      // Update bulb color and brightness
      bulb.style.background = "yellow";
      bulb.style.filter = "brightness(" + brightness + "%)";
    });
  } else {
    // Remove class from body for the on state
    body.classList.remove("on");
    body.classList.add("off");
    
  }
});


//Air Conditioner
// Inicijalizacija Firebase konfiguracije
const acRef = db.ref("AirConditioner");

// Elementi ekrana klima uređaja
const mainScreen = document.querySelector(".ac-screen-main");
const temperatureScreen = document.querySelector(".ac-screen-temperature .ac-status");


// Praćenje promena u Firebase-u
acRef.child("Power").on("value", (powerSnapshot) => {
    const power = powerSnapshot.val();

    if (power) {
        mainScreen.classList.remove("off");
        mainScreen.classList.add("on");
        mainScreen.style.background = "green"
    } else {
        mainScreen.classList.remove("on");
        mainScreen.classList.add("off");
        mainScreen.style.background = "red"
    }
});

acRef.child("Temperature").on("value", (temperatureSnapshot) => {
    const temperature = temperatureSnapshot.val();
    temperatureScreen.textContent = temperature + "°C";
});

//timer prikaz
// Definirajte referencu na "Timer" unutar "AirConditioner" u Firebase bazi podataka
const acTimerRef = db.ref("AirConditioner/Timer");

// Dohvatanje referenci na HTML elemente za prikaz tajmera za klimu
const acTimerStatus = document.getElementById("acTimerStatus");

// Funkcija za osvježavanje prikaza tajmera za klimu
function refreshAcTimerStatus() {
    acTimerRef.on("value", (timerSnapshot) => {
        const timerValue = timerSnapshot.val();
        acTimerStatus.textContent = timerValue + " seconds";
    });
}

// Periodično osvježavanje prikaza tajmera za klimu
setInterval(refreshAcTimerStatus, 1000); // Osvježavaj svake sekunde

