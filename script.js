document.addEventListener('DOMContentLoaded', function () {
    // Erstellen der Wavesurfer-Instanz
    const wavesurfer = WaveSurfer.create({
        container: '#waveform',        // Container für die Wellenform
        waveColor: 'violet',           // Farbe der Wellenform
        progressColor: 'purple',       // Farbe des Fortschrittsbalkens
        height: 150,                   // Höhe der Wellenform
        responsive: true               // Passt sich der Fenstergröße an
    });

    // Debugging: Wavesurfer geladen
    console.log('Wavesurfer geladen:', wavesurfer);

    // Pfad zur Audiodatei (hier lokal oder von einer URL)
    const audioFileUrl = 'audio/example.wav';  // Ändere den Pfad zur Datei, wenn nötig

    // Audiodatei laden
    wavesurfer.load(audioFileUrl);

    // Wenn Wavesurfer die Wellenform geladen hat
    wavesurfer.on('ready', function () {
        console.log("Wellenform wurde geladen!");
    });

    // Fehlerbehandlung
    wavesurfer.on('error', function (e) {
        console.error("Fehler beim Laden der Wellenform:", e);
    });

    // Hinzufügen eines Ereignisses auf der Zeitleiste
    const timeline = document.getElementById('timeline');
    const addEventButton = document.getElementById('add-event');

    addEventButton.addEventListener('click', function () {
        const currentTime = wavesurfer.getCurrentTime();  // aktuelle Wiedergabezeit des Audio
        const timelineWidth = timeline.offsetWidth;       // Breite der Zeitleiste
        const duration = wavesurfer.getDuration();        // Gesamtdauer des Tracks

        // Debugging-Ausgabe für alle Variablen
        console.log("Aktuelle Wiedergabezeit:", currentTime);
        console.log("Gesamtdauer des Tracks:", duration);
        console.log("Breite der Zeitleiste:", timelineWidth);

        // Sicherheitsprüfung: Wenn keine Datei geladen oder die Dauer 0 ist
        if (duration === 0) {
            console.error("Audio-Datei ist nicht geladen oder hat keine Dauer.");
            return;
        }

        // Berechnung der Position auf der Zeitleiste
        const position = (currentTime / duration) * timelineWidth;

        // Debugging-Ausgabe für berechnete Position
        console.log("Berechnete Position auf der Zeitleiste:", position);

        // Neues Ereignis-Element erstellen
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');

        // Stellen Sie sicher, dass die position korrekt als String mit px gesetzt wird
        eventElement.style.left = position + 'px';  // Alternative zu Template-Literal

        eventElement.style.width = '5px';
        eventElement.style.height = '20px';
        eventElement.style.backgroundColor = 'red';

        // Das Ereignis zur Zeitleiste hinzufügen
        timeline.appendChild(eventElement);
    });
});