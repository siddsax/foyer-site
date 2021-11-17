const listUpcomingEvents = (maxResults, setEvents) => {
  var newDateObj = new Date(new Date().getTime() - 120 * 60000);
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
        const events = response.result.items;
        setEvents(events);
      })
      .catch((error) => {
        console.log(error, "gapi error, retrying after timeout");
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
export { listUpcomingEvents, getMeetDetails };
