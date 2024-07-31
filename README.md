# event-countdown-timer

I have designed html form page using bootstrap.
Also the form is creating an objet on submission and store the data in local storage .
Then on submission all the new data will be visible on user interface as event listing of upcoming events and previous data fetched from local storage on page refresh.
Countdown is also displayed with every events calculating remaining time .

# Features Added

Event Notifications:

More than 1 day remaining: Sends daily notifications showing the number of days remaining until the event.
1 day remaining: Sends notifications 12 hours before and 1 hour before the event.
Less than 12 hours remaining: Sends a notification 1 hour before the event starts.
Service Worker Integration:

Manages notification interactions and ensures notifications are delivered even if the user is not on the page.
Service Worker
