// Wavesurfer-Instanz erstellen
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple',
    height: 150,
    responsive: true
});

// Audio-Upload-Handler
const audioUpload = document.getElementById('audio-upload');
audioUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const objectURL = URL.createObjectURL(file);
        wavesurfer.load(objectURL);
    }
});

// Zeitleisten-Container
const timeline = document.getElementById('timeline');
const addEventButton = document.getElementById('add-event');

// Ereignisse speichern
let events = [];

// Ereignis hinzufügen
addEventButton.addEventListener('click', () => {
    const currentTime = wavesurfer.getCurrentTime(); // Aktuelle Zeit der Audio-Wiedergabe
    const timelineWidth = timeline.offsetWidth; // Breite der Zeitleiste
    const duration = wavesurfer.getDuration(); // Gesamtdauer des Tracks

    // Berechnung der Position des Events auf der Zeitleiste
    const position = (currentTime / duration) * timelineWidth;

    // Neues Ereignis-Element
    const eventElement = document.createElement('div');
    eventElement.classList.add('event');
    eventElement.style.left = ${position}px;

    // Ereignis zur Zeitleiste hinzufügen
    timeline.appendChild(eventElement);

    // Ereignisdaten speichern
    events.push({ time: currentTime });
    console.log('Aktuelle Ereignisse:', events);
});

// Klick auf Wellenform -> Audio springt zu Punkt
wavesurfer.on('click', (e) => {
    const timelineWidth = timeline.offsetWidth;
    const clickX = e.offsetX;
    const duration = wavesurfer.getDuration();

    const clickedTime = (clickX / timelineWidth) * duration;
    wavesurfer.setCurrentTime(clickedTime);
});