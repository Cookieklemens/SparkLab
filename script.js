document.addEventListener('DOMContentLoaded', function () {
    // Wavesurfer erstellen
    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'orange',
        progressColor: 'darkorange',
        height: 150,
        responsive: true
    });

    // Audiodatei laden
    const audioFileUrl = 'audio/example.wav';
    wavesurfer.load(audioFileUrl);

    wavesurfer.on('ready', function () {
        console.log("Wellenform ist bereit!");
    });

    wavesurfer.on('error', function (e) {
        console.error("Fehler beim Laden der Wellenform:", e);
    });

    // HTML-Elemente
    const timeline = document.getElementById('timeline');
    const playButton = document.createElement('button');
    playButton.textContent = 'Play/Pause';
    document.body.insertBefore(playButton, timeline);

    const timestamp = document.createElement('div');
    timestamp.id = 'timestamp';
    timestamp.style.position = 'absolute';
    timestamp.style.top = '0';
    timestamp.style.backgroundColor = 'yellow';
    timestamp.style.padding = '5px';
    document.body.appendChild(timestamp);

    // Abspielen/Pausieren der Musik
    playButton.addEventListener('click', function () {
        wavesurfer.playPause();
    });

    wavesurfer.on('audioprocess', function () {
        const currentTime = wavesurfer.getCurrentTime();
        const duration = wavesurfer.getDuration();

        timestamp.textContent = 'Zeit: ' + currentTime.toFixed(2) + 's';

        const timelineWidth = timeline.offsetWidth;
        const position = (currentTime / duration) * timelineWidth;
        timestamp.style.left = position + 'px';
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

        const position = (currentTime / duration) * timelineWidth;

        // Ereignis erstellen
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.style.position = 'absolute';
        eventElement.style.left = position + 'px';
        eventElement.style.width = '5px';
        eventElement.style.height = '20px';
        eventElement.style.backgroundColor = 'red';
        eventElement.dataset.startTime = currentTime.toFixed(2);
        eventElement.dataset.duration = 1; // Standardwert
        eventElement.dataset.color = 'red';
        eventElement.dataset.name = 'Neues Ereignis';

        // Klick auf Ereignis zum Bearbeiten
        eventElement.addEventListener('click', function () {
            openEditDialog(eventElement);
        });

        timeline.appendChild(eventElement);
    });

    // Bearbeitungsdialog erstellen
    function openEditDialog(eventElement) {
        // Überprüfen, ob der Dialog schon existiert
        let dialog = document.getElementById('edit-dialog');
        if (!dialog) {
            dialog = document.createElement('div');
            dialog.id = 'edit-dialog';
            dialog.style.position = 'absolute';
            dialog.style.backgroundColor = 'white';
            dialog.style.border = '1px solid black';
            dialog.style.padding = '10px';
            dialog.style.zIndex = '10';

            dialog.innerHTML = `
                <label>
                    Name: 
                    <input type="text" id="edit-name">
                </label>
                <br>
                <label>
                    Anfangszeit: 
                    <input type="number" step="0.1" id="edit-start-time">
                </label>
                <br>
                <label>
                    Dauer: 
                    <input type="number" step="0.1" id="edit-duration">
                </label>
                <br>
                <label>
                    Farbe: 
                    <input type="color" id="edit-color">
                </label>
                <br>
                <button id="save-event">Speichern</button>
                <button id="cancel-edit">Abbrechen</button>
            `;

            document.body.appendChild(dialog);
        }

        // Dialogposition basierend auf dem Ereignis setzen
        const rect = eventElement.getBoundingClientRect();
        dialog.style.left = rect.left + 'px';
        dialog.style.top = rect.bottom + 'px';

        // Werte in das Formular einfügen
        document.getElementById('edit-name').value = eventElement.dataset.name;
        document.getElementById('edit-start-time').value = parseFloat(eventElement.dataset.startTime);
        document.getElementById('edit-duration').value = parseFloat(eventElement.dataset.duration);
        document.getElementById('edit-color').value = eventElement.dataset.color;

        // Klick auf Speichern
        document.getElementById('save-event').onclick = function () {
            eventElement.dataset.name = document.getElementById('edit-name').value;
            eventElement.dataset.startTime = parseFloat(document.getElementById('edit-start-time').value);
            eventElement.dataset.duration = parseFloat(document.getElementById('edit-duration').value);
            eventElement.dataset.color = document.getElementById('edit-color').value;

            // Aktualisiere das Ereignis
            eventElement.style.left = ((eventElement.dataset.startTime / wavesurfer.getDuration()) * timeline.offsetWidth) + 'px';
            eventElement.style.backgroundColor = eventElement.dataset.color;

            closeEditDialog();
        };

        // Klick auf Abbrechen
        document.getElementById('cancel-edit').onclick = function () {
            closeEditDialog();
        };
    }

    function closeEditDialog() {
        const dialog = document.getElementById('edit-dialog');
        if (dialog) {
            dialog.remove();
        }
    }
});