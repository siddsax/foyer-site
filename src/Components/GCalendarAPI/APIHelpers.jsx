const listUpcomingEvents = (maxResults, setEvents) => {
  if (window.$gapi) {
    console.log("1", window.$gapi);
    console.log("2", window.$gapi.client);
    console.log("3", window.$gapi.client.calendar);

    window.$gapi.client.load("calendar", "v3", () => {
      return window.$gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: "2021-09-27T20:03:52.739Z", //new Date().toISOString(),
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

export { listUpcomingEvents };
