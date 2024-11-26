document.addEventListener('DOMContentLoaded', function () {
    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'orange',
        progressColor: 'darkorange',
        height: 150,
        responsive: true
    });

    const audioFileUrl = 'audio/example.wav';
    wavesurfer.load(audioFileUrl);

    wavesurfer.on('ready', function () {
        console.log("Wellenform ist bereit!");
    });

    wavesurfer.on('error', function (e) {
        console.error("Fehler beim Laden der Wellenform:", e);
    });

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

        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.style.position = 'absolute';
        eventElement.style.left = position + 'px';
        eventElement.style.height = '20px';
        eventElement.style.backgroundColor = 'red';

        // Standardwerte für Ereignis
        eventElement.dataset.startTime = currentTime.toFixed(2);
        eventElement.dataset.duration = 1; // Standarddauer
        eventElement.dataset.color = 'red';
        eventElement.dataset.name = 'Neues Ereignis';

        // Dynamische Breite basierend auf Dauer
        updateEventWidth(eventElement, timelineWidth, duration);

        // Tooltip beim Hover anzeigen
        eventElement.title = eventElement.dataset.name;

        // Klick auf Ereignis zum Bearbeiten
        eventElement.addEventListener('click', function () {
            openEditDialog(eventElement);
        });

        timeline.appendChild(eventElement);
    });

    function updateEventWidth(eventElement, timelineWidth, totalDuration) {
        const minWidth = 10; // Mindestbreite in Pixeln
        const duration = parseFloat(eventElement.dataset.duration);
        const width = Math.max((duration / totalDuration) * timelineWidth, minWidth);
        eventElement.style.width = width + 'px';
    }

    function openEditDialog(eventElement) {
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
                <button id="delete-event">Löschen</button>
                <button id="cancel-edit">Abbrechen</button>
            `;

            document.body.appendChild(dialog);
        }

        const rect = eventElement.getBoundingClientRect();
        dialog.style.left = rect.left + 'px';
        dialog.style.top = rect.bottom + 'px';

        document.getElementById('edit-name').value = eventElement.dataset.name;
        document.getElementById('edit-start-time').value = parseFloat(eventElement.dataset.startTime);
        document.getElementById('edit-duration').value = parseFloat(eventElement.dataset.duration);
        document.getElementById('edit-color').value = eventElement.dataset.color;

        // Speichern der Änderungen
        document.getElementById('save-event').onclick = function () {
            const newName = document.getElementById('edit-name').value;
            const newStartTime = parseFloat(document.getElementById('edit-start-time').value);
            const newDuration = parseFloat(document.getElementById('edit-duration').value);
            const newColor = document.getElementById('edit-color').value;

            eventElement.dataset.name = newName;
            eventElement.dataset.startTime = newStartTime;
            eventElement.dataset.duration = newDuration;
            eventElement.dataset.color = newColor;

            eventElement.title = newName; // Tooltip aktualisieren
            eventElement.style.backgroundColor = newColor;

            const timelineWidth = timeline.offsetWidth;
            const totalDuration = wavesurfer.getDuration();

            // Position und Breite aktualisieren
            eventElement.style.left = ((newStartTime / totalDuration) * timelineWidth) + 'px';
            updateEventWidth(eventElement, timelineWidth, totalDuration);

            closeEditDialog();
        };

        // Löschen des Ereignisses
        document.getElementById('delete-event').onclick = function () {
            eventElement.remove();
            closeEditDialog();
        };

        // Abbrechen des Bearbeitens
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

    // Tastenkürzel für Steuerung hinzufügen
    document.addEventListener('keydown', function (event) {
        const currentTime = wavesurfer.getCurrentTime();
        const duration = wavesurfer.getDuration();

        // Leertaste für Play/Pause
        if (event.code === 'Space') {
            wavesurfer.playPause();
        }

        // Pfeiltasten für Zurück-/Vorwärtsbewegung
        if (event.code === 'ArrowRight') {
            wavesurfer.seekTo((currentTime + 5) / duration); // 5 Sekunden vorwärts
        }
        if (event.code === 'ArrowLeft') {
            wavesurfer.seekTo((currentTime - 5) / duration); // 5 Sekunden zurück
        }

        // Feinere Steuerung für Vorwärts/Rückwärts in 0,5s
        if (event.code === 'Period') { // Punkt (.)
            wavesurfer.seekTo((currentTime + 0.5) / duration); // 0.5 Sekunden vorwärts
        }
        if (event.code === 'Comma') { // Komma (,)
            wavesurfer.seekTo((currentTime - 0.5) / duration); // 0.5 Sekunden zurück
        }
    });
});