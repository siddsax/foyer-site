import moment from "moment";
import { css } from "@emotion/react";
import "./helpers.css";
var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const getDateFormatted = (props) => {
  const { dateObj } = props;
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var newdate = `${year}${month}${day}`;
  return newdate;
};

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
  const { notes, setNotes, loadingTop, todayLine, actionItem } = props;
  // 50, 60
  var indx = -1;
  var offset = 0;
  var match = 0;

  for (let j = 0; j < notes.length; j++) {
    var m1, m2, d1, d2, mdy1;
    if (actionItem) {
      m1 = new Date(notes[j]["data"].date.seconds * 1000).getMonth();
      d1 = new Date(notes[j]["data"].date.seconds * 1000).getDate();
      mdy1 = new Date(notes[j]["data"].date.seconds * 1000);
    } else {
      m1 = new Date(notes[j].createdAt).getMonth();
      d1 = new Date(notes[j].createdAt).getDate();
      mdy1 = new Date(notes[j].createdAt);
    }

    mdy1 = getDateFormatted({ dateObj: mdy1 });

    if (j > 0) {
      if (actionItem) {
        m2 = new Date(notes[j - 1]["data"].date.seconds * 1000).getMonth();
        d2 = new Date(notes[j - 1]["data"].date.seconds * 1000).getDate();
      } else {
        m2 = new Date(notes[j - 1].createdAt).getMonth();
        d2 = new Date(notes[j - 1].createdAt).getDate();
      }
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
    // var mt = new Date().getMonth();
    // var dt = new Date().getDate();
    var now = new Date();
    now = getDateFormatted({ dateObj: now });
    if (!loadingTop) {
      if (mdy1 === now && indx === -1) {
        indx = j;
        match = 1;
        if (todayLine) {
          await setNotes((prevValue) => {
            prevValue[j].todayStart = true;
            return prevValue;
          });
        }
      } else if (mdy1 > now && indx === -1) {
        indx = j; // The chosen point is ahead
        if (todayLine) {
          await setNotes((prevValue) => {
            prevValue[j].todayStart = 2;
            return prevValue;
          });
        }
      } else if (mdy1 < now && indx === -1) {
        await setNotes((prevValue) => {
          prevValue[j].todayStart = -1;
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

const ListItemBarComponent = (props) => {
  const { item } = props;
  return (
    <>
      <div className="NoteTitleArea">
        <text className="NoteTitleText">{item.title}</text>
      </div>
      <div className="DateTimeArea">
        <>
          {item.end ? (
            <text className="DateTime">
              {formatAMPM(new Date(item.createdAt))} {" - "}
              {formatAMPM(new Date(item.end))}
            </text>
          ) : null}
        </>
        <>
          {item.date ? (
            <text className="DateTime">
              {item.date.seconds
                ? moment(new Date(item.date.seconds * 1000)).calendar()
                : moment(new Date(item.date)).calendar()}
            </text>
          ) : null}
        </>
      </div>
    </>
  );
};

const SearchListItemDisplayComponent = (props) => {
  const { item } = props;
  return (
    <div className="searchListItem">
      <div className="type">{item.meetId ? "Meeting Note" : "Note"}</div>
      <div className="title">| {item.title}</div>
      <div className="dateArea">
        {formatAMPM(new Date(item.createdAt))},{"  "}
        {weekdays[new Date(item.createdAt).getDay()]},{"  "}
        {new Date(item.createdAt).getDate()}/
        {new Date(item.createdAt).getMonth()}
      </div>
    </div>
  );
};

const handleScroll = (props) => {
  const { actionTop, actionBottom, container, scrollHeightOld } = props;
  let triggerHeight = container.scrollTop + container.offsetHeight;
  if (triggerHeight >= container.scrollHeight) {
    actionBottom();
  }
  if (container.scrollTop == 0) {
    if (scrollHeightOld) scrollHeightOld.current = container.scrollHeight;
    actionTop();
  }
};

export {
  formatMeeting,
  override,
  setFirstMonthNote,
  weekdays,
  monthArray,
  formatAMPM,
  ListItemBarComponent,
  SearchListItemDisplayComponent,
  handleScroll,
};
