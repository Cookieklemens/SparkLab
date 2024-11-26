// Wavesurfer-Instanz erstellen
const wavesurfer = WaveSurfer.create({
    container: '#waveform',       // Container für die Wellenform
    waveColor: 'violet',          // Farbe der Wellenform
    progressColor: 'purple',      // Farbe des Fortschrittsbalkens
    height: 150,                  // Höhe der Wellenform
    responsive: true              // Passt sich an die Fenstergröße an
});

// Debugging: Wavesurfer geladen?
console.log('Wavesurfer geladen:', typeof WaveSurfer !== 'undefined');

// Automatisch eine Audiodatei laden (Beispiel-Datei)
window.addEventListener('load', function() {
    const audioFileUrl = 'audio/example.mp3';  // Beispiel-Audiodatei aus dem lokalen Ordner oder eine URL

    // Stelle sicher, dass die Datei existiert
    console.log("Lade Audiodatei:", audioFileUrl);

    // Überprüfe, ob der Pfad zur Datei korrekt ist
    wavesurfer.load(audioFileUrl);

    // Wenn Wavesurfer bereit ist, die Wellenform darzustellen
    wavesurfer.on('ready', function() {
        console.log("Wellenform geladen!");
        // Stelle sicher, dass das Canvas-Element korrekt gerendert wurde
    });

    wavesurfer.on('error', function(e) {
        console.error("Fehler beim Laden der Wellenform:", e);
    });
});

// Zeitleisten-Funktionen
const timeline = document.getElementById('timeline');
const addEventButton = document.getElementById('add-event');

// Ereignis-Liste speichern
let events = [];

// Ereignis hinzufügen
addEventButton.addEventListener('click', function() {
    const currentTime = wavesurfer.getCurrentTime(); // Aktuelle Wiedergabezeit
    const timelineWidth = timeline.offsetWidth;     // Breite der Zeitleiste
    const duration = wavesurfer.getDuration();      // Gesamtdauer des Tracks

    // Sicherheitsprüfung: Audio-Datei muss geladen sein
    if (duration === 0) {
        console.error("Keine Audio-Datei geladen oder Dauer ist 0.");
        return;
    }

    console.log("Aktuelle Wiedergabezeit:", currentTime); // Debugging
    console.log("Gesamtdauer des Tracks:", duration);    // Debugging

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
wavesurfer.on('error', function(e) {
    console.error("Fehler bei Wavesurfer:", e);
});