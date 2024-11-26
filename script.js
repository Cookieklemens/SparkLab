document.addEventListener('DOMContentLoaded', function () {
    // Wavesurfer erstellen
    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'orange',           // Farbe der Wellenform
        progressColor: 'darkorange',   // Farbe des Fortschrittsbalkens
        height: 150,
        responsive: true
    });

    // Audiodatei laden
    const audioFileUrl = 'audio/example.mp3';
    wavesurfer.load(audioFileUrl);

    // Debugging: Wenn Wellenform geladen wurde
    wavesurfer.on('ready', function () {
        console.log("Wellenform ist bereit!");
    });

    // Fehlerbehandlung
    wavesurfer.on('error', function (e) {
        console.error("Fehler beim Laden der Wellenform:", e);
    });

    // HTML-Elemente
    const timeline = document.getElementById('timeline');
    const playButton = document.createElement('button'); // Play/Pause-Button
    playButton.textContent = 'Play/Pause';
    document.body.insertBefore(playButton, timeline);

    const timestamp = document.createElement('div'); // Zeitstempel
    timestamp.id = 'timestamp';
    timestamp.style.position = 'absolute';
    timestamp.style.top = '0';
    timestamp.style.backgroundColor = 'yellow';
    timestamp.style.padding = '5px';
    document.body.appendChild(timestamp);

    // Abspielen/Pausieren der Musik
    playButton.addEventListener('click', function () {
        wavesurfer.playPause(); // Startet oder pausiert die Musik
    });

    // Zeitanzeige aktualisieren
    wavesurfer.on('audioprocess', function () {
        const currentTime = wavesurfer.getCurrentTime(); // Aktuelle Wiedergabezeit
        const duration = wavesurfer.getDuration();       // Gesamtdauer

        // Timestamp anzeigen
        timestamp.textContent = "Zeit: ${currentTime.toFixed(2)}s";

        // Position des Cursors auf der Zeitleiste berechnen
        const timelineWidth = timeline.offsetWidth;
        const position = (currentTime / duration) * timelineWidth;

        // Den Cursor bewegen
        timestamp.style.left = ${position}px;
    });

    // Zeitleiste mit Ereignissen
    const addEventButton = document.getElementById('add-event');
    addEventButton.addEventListener('click', function () {
        const currentTime = wavesurfer.getCurrentTime();
        const timelineWidth = timeline.offsetWidth;
        const duration = wavesurfer.getDuration();

        if (duration === 0) {
            console.error("Audio-Datei ist nicht geladen oder hat keine Dauer.");
            return;
        }

        // Berechnung der Position auf der Zeitleiste
        const position = (currentTime / duration) * timelineWidth;
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.style.left = ${position}px;
        eventElement.style.width = '5px';
        eventElement.style.height = '20px';
        eventElement.style.backgroundColor = 'red';
        timeline.appendChild(eventElement);
    });
});