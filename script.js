// Wavesurfer-Instanz erstellen
const wavesurfer = WaveSurfer.create({
    container: '#waveform',       // Container für die Wellenform
    waveColor: 'violet',         // Farbe der Wellenform
    progressColor: 'purple',     // Farbe des Fortschrittsbalkens
    height: 150,                 // Höhe der Wellenform
    responsive: true             // Passt sich an die Fenstergröße an
});

// Datei-Upload
const audioUpload = document.getElementById('audio-upload');
audioUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file); // Erstellt URL aus Datei
        wavesurfer.load(objectURL);                 // Wellenform laden
        console.log("Audio geladen:", file.name);
    } else {
        console.error("Keine Datei ausgewählt.");
    }
});

// Zeitleisten-Funktionen
const timeline = document.getElementById('timeline');
const addEventButton = document.getElementById('add-event');

// Ereignis-Liste speichern
let events = [];

// Ereignis hinzufügen
addEventButton.addEventListener('click', () => {
    const currentTime = wavesurfer.getCurrentTime(); // Aktuelle Wiedergabezeit
    const timelineWidth = timeline.offsetWidth;     // Breite der Zeitleiste
    const duration = wavesurfer.getDuration();      // Gesamtdauer des Tracks

    // Sicherheitsprüfung: Audio-Datei muss geladen sein
    if (duration === 0) {
        console.error("Keine Audio-Datei geladen oder Dauer ist 0.");
        return;
    }

    // Berechnung der Position auf der Zeitleiste
    const position = (currentTime / duration) * timelineWidth;

    // Neues Ereignis-Element erstellen
    const eventElement = document.createElement('div');
    eventElement.classList.add('event');
    eventElement.style.left = ${position}px;

    // Ereignis zur Zeitleiste hinzufügen
    timeline.appendChild(eventElement);

    // Ereignisdaten speichern
    events.push({ time: currentTime });
    console.log("Ereignis hinzugefügt bei:", currentTime, "Sekunden");
});

// Fehler-Handler für Wavesurfer
wavesurfer.on('error', (e) => {
    console.error("Fehler bei Wavesurfer:", e);
});

// Debugging: Prüfen, ob Wavesurfer erfolgreich geladen wurde
console.log(typeof WaveSurfer !== 'undefined' ? 'Wavesurfer.js geladen!' : 'Fehler beim Laden von Wavesurfer.js.');