document.addEventListener("DOMContentLoaded", () => {
  const eventForm = document.getElementById("eventForm");
  const eventList = document.getElementById("eventList");

  function saveEvent(event) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));
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
          <button class="btn remove-event" data-index="${index}">Remove</button>
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
    return `Event date: ${formattedDate} At  ${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;
  }

  function updateCountdown(index, eventDate) {
    const countdownElement = document.getElementById(`countdown-${index}`);
    const eventTime = new Date(eventDate).getTime();
    setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = eventTime - currentTime;
      if (timeDifference <= 0) {
        countdownElement.innerHTML = "Event has started!";
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

  function scheduleNotifications() {
    let events = JSON.parse(localStorage.getItem("events")) || [];

    // Clear any existing notifications
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.getNotifications().then((notifications) => {
            notifications.forEach((notification) => {
              notification.close();
            });
          });

          events.forEach((event) => {
            const eventTime = new Date(event.date).getTime();
            const now = new Date().getTime();
            const timeDifference = eventTime - now;
            const daysRemaining = Math.floor(
              timeDifference / (1000 * 60 * 60 * 24)
            );
            const hoursRemaining =
              Math.floor(timeDifference / (1000 * 60 * 60)) % 24;

            if (timeDifference <= 0) return; // Skip if the event has already started

            // Notifications for events more than 1 day away
            if (daysRemaining > 1) {
              for (let i = daysRemaining; i > 0; i--) {
                const delay = timeDifference - i * 1000 * 60 * 60 * 24;
                if (delay > 0) {
                  setTimeout(() => {
                    showNotification(
                      `Event: ${event.name}`,
                      `Event in ${i} day(s)!`
                    );
                  }, delay);
                }
              }
            }

            // Notifications for events within 1 day
            if (daysRemaining === 1) {
              // Notification 12 hours before
              const delay12Hours = timeDifference - 12 * 1000 * 60 * 60;
              if (delay12Hours > 0) {
                setTimeout(() => {
                  showNotification(
                    `Event: ${event.name}`,
                    `Event is in 12 hours!`
                  );
                }, delay12Hours);
              }
              // Notification 1 hour before
              const delay1Hour = timeDifference - 1 * 1000 * 60 * 60;
              if (delay1Hour > 0) {
                setTimeout(() => {
                  showNotification(
                    `Event: ${event.name}`,
                    `Event is happening in 1 hour!`
                  );
                }, delay1Hour);
              }
            }

            // Notifications for events within 12 hours
            if (daysRemaining === 0 && hoursRemaining < 12) {
              // Notification 1 hour before
              const delay1Hour = timeDifference - 1 * 1000 * 60 * 60;
              if (delay1Hour > 0) {
                setTimeout(() => {
                  showNotification(
                    `Event: ${event.name}`,
                    `Event is happening in 1 hour!`
                  );
                }, delay1Hour);
              }
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
    }
  });

  // Load events on page load
  loadEvents();
  scheduleNotifications(); // Schedule notifications on page load
});
