// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Dohvaćanje referenci na HTML elemente
const lightBulbBtn = document.querySelector(".Lightbulb-btn");
const brightnessRange = document.querySelector("#brightnessRange");
const brightnessLabel = document.querySelector("#brightnessLabel");

// Sluša promjene u Power i Brightness vrijednostima
lightBulbRef.on("value", (snapshot) => {
  const lightBulbData = snapshot.val();

  const power = lightBulbData.Power;
  const brightness = lightBulbData.Brightness;

  lightBulbBtn.disabled = false; // Omogućite gumb
  if (power) {
    lightBulbBtn.textContent = "Turn Off";
    brightnessRange.disabled = false; // Omogućite slider
    brightnessRange.value = brightness; // Postavi vrijednost slidera
  } else {
    lightBulbBtn.textContent = "Turn On";
    brightnessRange.disabled = true; // Onemogućite slider
    brightnessRange.value = 0; // Postavi vrijednost slidera na 0
    lightBulbRef.child("Brightness").set(0); 
  }
  updateBrightnessLabel(brightnessRange.value);
});

// Promjena Brightness vrijednosti
function promjeniSvjetlinu(input) {
  const value = input.value;
  lightBulbRef.child("Brightness").set(parseInt(value));
  updateBrightnessLabel(value);
}

// Promjena Power vrijednosti (paljenje/ugašenje svjetla)
function upaliSvjetlo() {
  lightBulbRef.child("Power").transaction((power) => {
    return !power; // Obrnuti trenutni status
  });
}

// Pomoćna funkcija za ažuriranje labela za svjetlinu
function updateBrightnessLabel(brightness) {
  brightnessLabel.textContent = `Brightness: ${brightness}%`;
}

// Ažuriranje Brightness vrijednosti kada se slider pomakne
brightnessRange.addEventListener("input", function(event) {
  const newValue = event.target.value;
  lightBulbRef.child("Brightness").set(parseInt(newValue));
  updateBrightnessLabel(newValue);
});




//TIMER

const timerRef = db.ref("Lightbulb/Timer");
const powerRef = db.ref("Lightbulb/Power");

let countdownInterval;
let timerRunning = false;
let timerValue = 0;

// Dohvatanje referenci na HTML elemente
const timerDisplay = document.getElementById("timerDisplay");
const timerInput = document.getElementById("lightTimer");

// Funkcija za ažuriranje prikaza tajmera
function updateTimerDisplay() {
    timerDisplay.textContent = `Timer: ${timerValue} seconds`;
}

function decreaseTimer() {
  timerRef.transaction((currentValue) => {
      if (currentValue <= 1) {
          clearInterval(countdownInterval);
          powerRef.set(false); // Postavljamo Power na false kad Timer dosegne 0
          timerRunning = false; // Resetiramo timerRunning kad Timer dosegne 0
          return 0; // Postavljamo Timer na 0
      }
      return currentValue - 1;
  });
}

// Funkcija za pokretanje tajmera
function startTimer() {
  countdownInterval = setInterval(() => {
      if (timerValue <= 0) {
          clearInterval(countdownInterval);
          timerRunning = false; // Postavljamo timerRunning na false kad se tajmer završi
          return;
      }

      decreaseTimer();
      updateTimerDisplay();
  }, 1000);
}


// Funkcija za paljenje svjetla s tajmerom
function ugasiSvjetloTimed() {
    if (timerRunning) {
        console.error("Timer is already running");
        return;
    }

    const timerSeconds = parseInt(timerInput.value);

    if (!isNaN(timerSeconds) && timerSeconds >= 0) {
        timerValue = timerSeconds;
        updateTimerValue(timerValue); // Ažuriramo Firebase Timer vrijednost
        powerRef.set(true); // Postavljamo Power na true
        timerRunning = true;
        updateTimerDisplay();
        startTimer();
        startLabelCountdown(); // Pozivamo funkciju za odbrojavanje na labeli
    } else {
        console.error("Invalid timer input");
    }
}

// Funkcija za ažuriranje Timer vrijednosti u Firebase bazi
function updateTimerValue(newValue) {
    timerRef.set(newValue)
        .then(() => {
            console.log("Timer value updated successfully:", newValue);
        })
        .catch((error) => {
            console.error("Error updating timer value:", error);
        });
}

// Funkcija za odbrojavanje na labeli
function startLabelCountdown() {
    const labelInterval = setInterval(() => {
        if (timerValue <= 0) {
            clearInterval(labelInterval);
            return;
        }

        timerValue--;
        updateTimerDisplay();
    }, 1000);
}

//AIR CONDITIONER

const airConditionerRef = db.ref("AirConditioner");

// Dohvaćanje referenci na HTML elemente za Air Conditioner
const airConditionerBtn = document.querySelector(".AirConditioner-btn");
const temperatureRange = document.querySelector("#temperatureRange");
const temperatureLabel = document.querySelector("#temperatureLabel");

// Sluša promjene u Power i Temperature vrijednostima za Air Conditioner
airConditionerRef.on("value", (snapshot) => {
  const airConditionerData = snapshot.val();

  const power = airConditionerData.Power;
  const temperature = airConditionerData.Temperature;

  airConditionerBtn.disabled = false; // Omogućite gumb
  if (power) {
    airConditionerBtn.textContent = "Turn Off";
    temperatureRange.disabled = false; // Omogućite slider
    temperatureRange.value = temperature; // Postavi vrijednost slidera
  } else {
    airConditionerBtn.textContent = "Turn On";
    temperatureRange.disabled = true; // Onemogućite slider
    temperatureRange.value = 0; // Postavi vrijednost slidera na 0
    airConditionerRef.child("Temperature").set(0);

  }

  updateTemperatureLabel(temperature);
});

// Promjena Temperature vrijednosti za Air Conditioner
function promjeniTemperaturu(input) {
  const value = input.value;
  airConditionerRef.child("Temperature").set(parseInt(value));
  updateTemperatureLabel(value);
}

// Promjena Power vrijednosti za Air Conditioner (paljenje/ugašenje)
function upaliKlimu() {
  airConditionerRef.child("Power").transaction((power) => {
    return !power; // Obrnuti trenutni status
  });
}

// Pomoćna funkcija za ažuriranje labela za temperaturu
function updateTemperatureLabel(temperature) {
  temperatureLabel.textContent = `Temperature: ${temperature}°C`;
}


//TIMER AC
// Definirajte referencu na "AirConditioner/Timer" i "Lightbulb/Power" u Firebase bazi podataka
const acTimerRef = db.ref("AirConditioner/Timer");
const acPowerRef = db.ref("AirConditioner/Power");

let acCountdownInterval;
let acTimerRunning = false;
let acTimerValue = 0;

// Dohvatanje referenci na HTML elemente za klimu
const acTimerDisplay = document.getElementById("timerDisplayKlima");
const acTimerInput = document.getElementById("acTimer");

// Funkcija za ažuriranje prikaza klima tajmera
function updateAcTimerDisplay() {
    acTimerDisplay.textContent = `Timer: ${acTimerValue} seconds`;
}

function decreaseAcTimer() {
    acTimerRef.transaction((currentValue) => {
        if (currentValue <= 1) {
            clearInterval(acCountdownInterval);
            acPowerRef.set(false); // Postavljamo Power na false kad Timer za klimu dosegne 0
            acTimerRunning = false; // Resetiramo acTimerRunning kad Timer za klimu dosegne 0
            return 0; // Postavljamo Timer za klimu na 0
        }
        return currentValue - 1;
    });
}

// Funkcija za pokretanje klima tajmera
function startAcTimer() {
    acCountdownInterval = setInterval(() => {
        if (acTimerValue <= 0) {
            clearInterval(acCountdownInterval);
            acTimerRunning = false; // Postavljamo acTimerRunning na false kad se klima tajmer završi
            return;
        }

        decreaseAcTimer();
        updateAcTimerDisplay();
    }, 1000);
}

// Funkcija za paljenje klime s tajmerom
function ugasiKlimuTimer() {
    if (acTimerRunning) {
        console.error("AC Timer is already running");
        return;
    }

    const acTimerSeconds = parseInt(acTimerInput.value);

    if (!isNaN(acTimerSeconds) && acTimerSeconds >= 0) {
        acTimerValue = acTimerSeconds;
        updateAcTimerValue(acTimerValue); // Ažuriramo Firebase Timer vrijednost za klimu
        acPowerRef.set(true); // Postavljamo Power na true
        acTimerRunning = true;
        updateAcTimerDisplay();
        startAcTimer();
        startAcLabelCountdown(); // Pozivamo funkciju za odbrojavanje na labeli
    } else {
        console.error("Invalid AC timer input");
    }
}

// Funkcija za ažuriranje Timer vrijednosti za klimu u Firebase bazi
function updateAcTimerValue(newValue) {
    acTimerRef.set(newValue)
        .then(() => {
            console.log("AC Timer value updated successfully:", newValue);
        })
        .catch((error) => {
            console.error("Error updating AC timer value:", error);
        });
}

// Funkcija za odbrojavanje na labeli za klimu
function startAcLabelCountdown() {
    const acLabelInterval = setInterval(() => {
        if (acTimerValue <= 0) {
            clearInterval(acLabelInterval);
            return;
        }

        acTimerValue--;
        updateAcTimerDisplay();
    }, 1000);
}
