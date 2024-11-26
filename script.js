document.addEventListener('DOMContentLoaded', function () {
    // Daten für alle Timelines und deren Ereignisse
    let timelines = {};

    // Funktion zum Erstellen einer neuen Timeline
    function createNewTimeline(timelineName) {
        const timelineContainer = document.createElement('div');
        timelineContainer.classList.add('timeline');
        timelineContainer.style.position = 'relative';
        timelineContainer.style.height = '200px';
        timelineContainer.style.marginBottom = '20px';
        timelineContainer.style.border = '1px solid #ccc';

        const timelineLabel = document.createElement('div');
        timelineLabel.classList.add('timeline-label');
        timelineLabel.textContent = timelineName;
        timelineContainer.appendChild(timelineLabel);

        // Timeline zu den Timelines hinzufügen
        timelines[timelineName] = {
            container: timelineContainer,
            events: []
        };

        // Timeline in das Dokument einfügen
        document.body.appendChild(timelineContainer);
    }

    // Standard-Timeline erstellen
    createNewTimeline('Timeline 1');

    // Dropdown für Timeline-Auswahl
    const timelineSelect = document.createElement('select');
    for (const name in timelines) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        timelineSelect.appendChild(option);
    }
    document.body.appendChild(timelineSelect);

    // Wavesurfer initialisieren
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

    const addEventButton = document.getElementById('add-event');
    addEventButton.addEventListener('click', function () {
        const currentTime = wavesurfer.getCurrentTime();
        const timelineName = timelineSelect.value;
        const timeline = timelines[timelineName];
        const timelineWidth = timeline.container.offsetWidth;
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
        eventElement.dataset.timeline = timelineName; // Timeline zuordnen

        // Dynamische Breite basierend auf Dauer
        updateEventWidth(eventElement, timelineWidth, duration);

        // Tooltip beim Hover anzeigen
        eventElement.title = eventElement.dataset.name;

        // Klick auf Ereignis zum Bearbeiten
        eventElement.addEventListener('click', function () {
            openEditDialog(eventElement);
        });

        // Ereignis zur Timeline hinzufügen
        timeline.container.appendChild(eventElement);
        timeline.events.push(eventElement);
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
                <label>
                    Timeline: 
                    <select id="edit-timeline">
                    </select>
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

        // Dropdown mit Timelines füllen
        const timelineDropdown = document.getElementById('edit-timeline');
        timelineDropdown.innerHTML = ''; // Vorherige Optionen löschen
        for (const name in timelines) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            if (name === eventElement.dataset.timeline) {
                option.selected = true;
            }
            timelineDropdown.appendChild(option);
        }

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
            const newTimeline = document.getElementById('edit-timeline').value;

            eventElement.dataset.name = newName;
            eventElement.dataset.startTime = newStartTime;
            eventElement.dataset.duration = newDuration;
            eventElement.dataset.color = newColor;
            eventElement.dataset.timeline = newTimeline;

            eventElement.title = newName; // Tooltip aktualisieren
            eventElement.style.backgroundColor = newColor;

            const timelineWidth = timelines[newTimeline].container.offsetWidth;
            const totalDuration = wavesurfer.getDuration();

            // Position und Breite aktualisieren
            eventElement.style.left = ((newStartTime / totalDuration) * timelineWidth) + 'px';
            updateEventWidth(eventElement, timelineWidth, totalDuration);

            // Ereignis zur neuen Timeline verschieben
            timelines[newTimeline].container.appendChild(eventElement);
            closeEditDialog();
        };

        // Löschen des Ereignisses
        document.getElementById('delete-event').onclick = function () {
            const timelineName = eventElement.dataset.timeline;
            const index = timelines[timelineName].events.indexOf(eventElement);
            if (index > -1) {
                timelines[timelineName].events.splice(index, 1);
            }
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
            if (wavesurfer.isPlaying()) {
                wavesurfer.pause();
            } else {
                wavesurfer.play();
            }
        }

        // Punkt (.) für schnellen Vorlauf 0.5s
        if (event.code === 'Period') {
            wavesurfer.seekTo(Math.min((currentTime + 0.5) / duration, 1));
        }

        // Komma (,) für schnellen Rücklauf 0.5s
        if (event.code === 'Comma') {
            wavesurfer.seekTo(Math.max((currentTime - 0.5) / duration, 0));
        }
    });
});