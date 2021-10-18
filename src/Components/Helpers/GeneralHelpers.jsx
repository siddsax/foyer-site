import { css } from "@emotion/react";

const formatMeeting = (props) => {
  const { meetingCalendar } = props;
  const meet = {
    noNoteYet: true,
    createdAt: meetingCalendar.start.dateTime
      ? Date.parse(meetingCalendar.start.dateTime)
      : Date.parse(meetingCalendar.start.date),
    hangoutLink: meetingCalendar.hangoutLink,
    id: meetingCalendar.id,
    title: meetingCalendar.summary,
    attendees: meetingCalendar.attendees
      ? meetingCalendar.attendees
      : [meetingCalendar.creator],

    end: meetingCalendar.end.dateTime
      ? Date.parse(meetingCalendar.end.dateTime)
      : Date.parse(meetingCalendar.end.date),
    noTime: meetingCalendar.start.dateTime ? false : true,
  };

  return meet;
};

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

var offsetNoteArea = 80;
var offsetMonthArea = 30;

const setFirstMonthNote = async (props) => {
  const { notes, setNotes, loadingTop } = props;
  // 50, 60
  var indx = -1;
  var offset = 0;
  var match = 0;

  for (let j = 0; j < notes.length; j++) {
    var m1, m2, d1, d2;
    m1 = new Date(notes[j].createdAt).getMonth();
    d1 = new Date(notes[j].createdAt).getDate();
    if (j > 0) {
      m2 = new Date(notes[j - 1].createdAt).getMonth();
      d2 = new Date(notes[j - 1].createdAt).getDate();
    } else {
      m2 = m1 - 1;
      d2 = d1 - 1;
    }

    if (m1 !== m2) {
      await setNotes((prevValue) => {
        prevValue[j].firstOfMonth = true;
        prevValue[j].firstOfDay = true;
        return prevValue;
      });
      if (indx === -1) {
        offset += offsetMonthArea;
      }
    } else {
      if (d1 !== d2) {
        await setNotes((prevValue) => {
          prevValue[j].firstOfMonth = false;
          prevValue[j].firstOfDay = true;
          return prevValue;
        });
      } else {
        await setNotes((prevValue) => {
          prevValue[j].firstOfMonth = false;
          prevValue[j].firstOfDay = false;
          return prevValue;
        });
      }
    }

    // For the purpose of reaching the correct scroll point
    var mt = new Date().getMonth();
    var dt = new Date().getDate();
    if (!loadingTop) {
      if (mt === m1 && dt === d1 && indx === -1) {
        indx = j;
        match = 1;
        await setNotes((prevValue) => {
          prevValue[j].todayStart = true;
          return prevValue;
        });
      }

      if ((mt < m1 || (mt === m1 && dt < d1)) && indx === -1) {
        indx = j; // The chosen point is ahead
        await setNotes((prevValue) => {
          prevValue[j].todayStart = 2;
          return prevValue;
        });
      }
    }

    if (indx === -1) {
      offset += offsetNoteArea;
    }
  }

  return offset;
};

export { formatMeeting, override, setFirstMonthNote };
