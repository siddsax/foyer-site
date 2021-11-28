import { signOut } from "./GCalendarAPI";
import moment from "moment-timezone";

const listUpcomingEvents = (maxResults, setEvents, newDateObj) => {
  var timeoutTime = 100;
  const callAPI = () => {
    console.log("calling google api !!!", {
      calendarId: "primary",
      timeMin: newDateObj.toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: maxResults,
      orderBy: "startTime",
    });
    window.$gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: newDateObj.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: maxResults,
        orderBy: "startTime",
      })
      .then((response) => {
        console.log(response.status === 200, "^^^^^^^^^^^^^^^^^^");
        const events = response.result.items;
        var eventsFiltered = [];
        for (let i = 0; i < events.length; i++) {
          if (events[i].description) {
            var newStr = events[i].description.replace(/(^\s+|\s+$)/g, "");

            if (newStr != "Foyer Reminder") {
              eventsFiltered.push(events[i]);
            }
            console.log(newStr);
          } else eventsFiltered.push(events[i]);
        }
        setEvents(eventsFiltered);
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 403) {
          console.log("Unauthorized Error, Signing Out");
          signOut();
        }
        console.log(
          error,
          "gapi error, retrying after timeout",
          error.status,
          "^^^^^^^^----^^^^^^^^^^"
        );
        timeoutTime = timeoutTime * 2;
        setTimeout(callAPI, timeoutTime);
      });
  };

  if (window.$gapi) {
    window.$gapi.client.load("calendar", "v3", () => {
      callAPI();
    });
  } else {
    console.log("Error: gapi not loaded");
    setEvents(null);
  }
};

const getMeetDetails = (props) => {
  const { eventId, setEvent } = props;
  if (window.$gapi) {
    window.$gapi.client.load("calendar", "v3", () => {
      return window.$gapi.client.calendar.events
        .get({
          calendarId: "primary",
          eventId: eventId,
        })
        .then((response) => {
          const event = response.result;
          setEvent(event);
        })
        .catch((er) => {
          console.log(er);
          setTimeout(
            () => getMeetDetails({ eventId: eventId, setEvent: setEvent }),
            200
          );
        });
    });
  } else {
    console.log("Error: gapi not loaded");
    setEvent(null);
  }
};

const setReminderMeeting = (props) => {
  const { actionItem } = props;
  var attendees = [{ email: actionItem.creatorEmail }];
  for (let i = 0; i < actionItem.assignees.length; i++) {
    attendees.push({ email: actionItem.assignees[i] });
  }
  var event = {
    summary: "Action Item Reminder :" + actionItem.title,
    description: "Foyer Reminder",
    start: {
      dateTime: actionItem.date,
    },
    end: {
      dateTime: new Date(actionItem.date.getTime() + 5 * 60 * 1000),
    },
    attendees: attendees,
    reminders: {
      useDefault: true,
      // overrides: [
      //   { method: "email", minutes: 24 * 60 },
      //   { method: "popup", minutes: 10 },
      // ],
    },
  };

  console.log(event);
  if (window.$gapi) {
    window.$gapi.client.load("calendar", "v3", () => {
      var request = window.$gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      request.execute(function (event) {
        console.log("Event Created: " + event.htmlLink);
      });
    });
  } else {
    console.log("Error: gapi not loaded");
  }
};
export { listUpcomingEvents, getMeetDetails, setReminderMeeting };
