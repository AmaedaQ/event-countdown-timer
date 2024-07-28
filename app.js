document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('eventForm');
    const eventList = document.getElementById('eventList');

    function saveEvent(event) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
    }

    function loadEvents() {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        eventList.innerHTML = '';
        events.forEach(event => {
            const li = document.createElement('li');
            li.classList.add('event-list-item');
            li.innerHTML = `
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <div class="countdown" id="countdown-${event.name}"></div>
                <small><em>Event Date: ${new Date(event.date).toLocaleString()}</em></small>
            `;
            eventList.appendChild(li);
        });
    }

    function updateCountdowns() {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        events.forEach(event => {
            const countdownElement = document.getElementById(`countdown-${event.name}`);
            if (countdownElement) {
                const eventDate = new Date(event.date).getTime();
                const now = new Date().getTime();
                const distance = eventDate - now;

                if (distance < 0) {
                    countdownElement.innerHTML = "Event has passed";
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

                setTimeout(updateCountdowns, 1000);
            }
        });
    }

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const event = {
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            description: document.getElementById('eventDescription').value
        };
        saveEvent(event);
        loadEvents();
        eventForm.reset();
    });

    loadEvents();
    updateCountdowns();
});
