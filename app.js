document.addEventListener("DOMContentLoaded", () => {
  const eventForm = document.getElementById("eventForm");
  const eventList = document.getElementById("eventList");
  let currentEditIndex = -1;

  function saveEvent(event) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    let notificationsSent =
      JSON.parse(localStorage.getItem("notificationsSent")) || {};

    if (currentEditIndex >= 0) {
      const oldEvent = events[currentEditIndex];
      delete notificationsSent[oldEvent.date]; // Clear notification status for the old date
      events[currentEditIndex] = event;
      currentEditIndex = -1;
    } else {
      events.push(event);
    }

    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem(
      "notificationsSent",
      JSON.stringify(notificationsSent)
    );
    loadEvents();
    scheduleNotifications(); // Schedule notifications when an event is added
  }

  function loadEvents() {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    eventList.innerHTML = "";
    events.forEach((event, index) => {
      const card = document.createElement("div");
      card.classList.add("card", "col-12", "col-md-6", "col-lg-4", "mb-4");
      const formattedDate = formatEventDate(event.date);
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${event.name}</h5>
          <p class="card-text">${event.description}</p>
          <div class="card-countdown" id="countdown-${index}"></div>
          <p class="card-date">${formattedDate}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-blue edit-event" data-index="${index}">Edit</button>
          <button class="btn btn-danger remove-event" data-index="${index}">Remove</button>
        </div>
      `;
      eventList.appendChild(card);
      updateCountdown(index, event.date);
    });
  }

  function formatEventDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `Event date: ${formattedDate} at ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;
  }

  function updateCountdown(index, eventDate) {
    const countdownElement = document.getElementById(`countdown-${index}`);
    const eventTime = new Date(eventDate).getTime();
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = eventTime - currentTime;

      if (timeDifference <= 0) {
        clearInterval(interval);
        countdownElement.innerHTML = "Event has passed!";
      } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  }

  function removeEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    loadEvents();
    scheduleNotifications(); // Schedule notifications when an event is removed
  }

  function editEvent(index) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    const event = events[index];

    document.getElementById("eventName").value = event.name;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("eventDescription").value = event.description;

    currentEditIndex = index;
  }

  function scheduleNotifications() {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    let notificationsSent =
      JSON.parse(localStorage.getItem("notificationsSent")) || {};

    // Clear any existing notifications
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.getNotifications().then((notifications) => {
            notifications.forEach((notification) => {
              notification.close();
            });
          });

          events.forEach((event, index) => {
            const eventTime = new Date(event.date).getTime();
            const now = new Date().getTime();
            const timeDifference = eventTime - now;

            if (timeDifference <= 0) return; // Skip if the event has already started

            // Notification 1 day before
            const delay1Day = timeDifference - 24 * 1000 * 60 * 60;
            if (
              !notificationsSent[event.date + "-1day"] &&
              delay1Day > 0 &&
              delay1Day < 24 * 1000 * 60 * 60
            ) {
              setTimeout(() => {
                showNotification(`Event: ${event.name}`, `Event is in 1 day!`);
                notificationsSent[event.date + "-1day"] = true;
                localStorage.setItem(
                  "notificationsSent",
                  JSON.stringify(notificationsSent)
                );
              }, delay1Day);
            }

            // Notification 1 hour before
            const delay1Hour = timeDifference - 1 * 1000 * 60 * 60;
            if (
              !notificationsSent[event.date + "-1hour"] &&
              delay1Hour > 0 &&
              delay1Hour < 24 * 1000 * 60 * 60
            ) {
              setTimeout(() => {
                showNotification(
                  `Event: ${event.name}`,
                  `Event is happening in 1 hour!`
                );
                notificationsSent[event.date + "-1hour"] = true;
                localStorage.setItem(
                  "notificationsSent",
                  JSON.stringify(notificationsSent)
                );
              }, delay1Hour);
            }
          });
        });
      }
    });
  }

  function showNotification(title, message) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body: message,
            icon: "notification-icon.png", // Add an appropriate icon if available
          });
        });
      }
    });
  }

  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;
    const eventDescription = document.getElementById("eventDescription").value;

    const newEvent = {
      name: eventName,
      date: eventDate,
      description: eventDescription,
    };

    saveEvent(newEvent);
    eventForm.reset();
  });

  eventList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-event")) {
      const index = e.target.getAttribute("data-index");
      removeEvent(index);
    } else if (e.target.classList.contains("edit-event")) {
      const index = e.target.getAttribute("data-index");
      editEvent(index);
    }
  });

  // Load events on page load
  loadEvents();
  scheduleNotifications(); // Schedule notifications on page load
});
