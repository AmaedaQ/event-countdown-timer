
# Event Countdown Timer

## Overview

The **Event Countdown Timer** is a simple yet powerful web application that allows users to create and manage event countdowns. Using **HTML**, **CSS**, **JavaScript**, and **Service Workers**, this app enables users to input event details, store them locally, and see real-time countdowns for upcoming events. It also features event notifications to alert users 1 day and 1 hour before an event.

## Features

- **Event Creation**: Users can add event details through a form, and the event is stored in local storage.
- **Countdown Timer**: Each event displays a countdown showing the remaining time until the event.
- **Event Notifications**: Notifications are sent 1 day and 1 hour before an event occurs.
- **Service Worker Integration**: Ensures notifications are delivered even when the user is not on the page.
- **Local Storage**: Stores events persistently, so the data remains visible after page refresh.

## Tech Stack

- **Frontend**: 
  - **HTML/CSS** – For structuring and styling the event interface.
  - **JavaScript** – For handling event logic and countdown timers.
  - **Bootstrap** – Used for responsive and attractive form design.
  
- **Service Workers**: To handle notifications even if the user is not actively on the page.

## Setup Instructions

### Prerequisites

- **Browser** that supports Service Workers (e.g., Chrome, Firefox).
- Local server setup (optional) for testing Service Worker features.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AmaedaQ/event-countdown-timer.git
   cd event-countdown-timer
   ```

2. Open the `index.html` file in a web browser to run the app locally.

3. You can edit event details through the form, and the countdown for each event will automatically display.

## How to Use

1. **Add Event**: Fill in the event details (name, date, and time) and submit the form.
2. **View Countdown**: The countdown for each event will appear showing the time remaining.
3. **Event Notifications**: Receive notifications 1 day and 1 hour before the event.
4. **Refresh**: Even after a page refresh, your events will remain stored in local storage.
- **Event Editing**: Allow users to edit the event details after submission.
- **Event Deletion**: Implemented functionality to delete events from the list.


## Future Enhancements

- **Event Reminders**: Add more customizable reminder times (e.g., 2 days before, 30 minutes before).



## Acknowledgements

- **Bootstrap** – For responsive UI design.
- **Service Worker API** – For managing notifications in the background.
`
