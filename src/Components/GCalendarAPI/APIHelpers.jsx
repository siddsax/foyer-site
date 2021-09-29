const listUpcomingEvents = (maxResults, gapi) => {
  //   console.log(new Date().toISOString());
  if (gapi) {
    const events = gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: "2021-09-27T20:03:52.739Z", //new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: maxResults,
      orderBy: "startTime",
    });
    return events;
  } else {
    console.log("Error: gapi not loaded");
    return false;
  }
};

export { listUpcomingEvents };
