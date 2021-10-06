const listUpcomingEvents = (maxResults, setEvents) => {
  if (window.$gapi) {
    console.log("1", window.$gapi);
    console.log("2", window.$gapi.client);
    console.log("3", window.$gapi.client.calendar);

    window.$gapi.client.load("calendar", "v3", () => {
      var newDateObj = new Date(new Date().getTime() - 120 * 60000);
      return window.$gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: newDateObj.toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: maxResults,
          orderBy: "startTime",
        })
        .then((response) => {
          const events = response.result.items;
          setEvents(events);
        });
    });
  } else {
    console.log("Error: gapi not loaded");
    setEvents(null);
  }
};

const getMeetDetails = (eventID, setEvent) => {
  if (window.$gapi) {
    console.log(eventID);
    window.$gapi.client.load("calendar", "v3", () => {
      return window.$gapi.client.calendar.events
        .get({
          calendarId: "primary",
          eventID: eventID,
        })
        .then((response) => {
          const event = response.result;
          setEvent(event);
        });
    });
  } else {
    console.log("Error: gapi not loaded");
    setEvent(null);
  }
};
export { listUpcomingEvents, getMeetDetails };
