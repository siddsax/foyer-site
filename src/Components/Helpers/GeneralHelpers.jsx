import moment from "moment";
import { css } from "@emotion/react";
import "./helpers.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Checkbox from "@mui/material/Checkbox";

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
  if (day < 10) day = `0${day}`;
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

var offsetNoteArea = 60;
var offsetMonthArea = 50;

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
  const {
    item,
    to,
    className,
    onClick,
    deleteIcon,
    onClickDelete,
    assignees,
    CustomTag,
    status,
    changeStatus,
  } = props;

  return (
    <div className={className}>
      <CustomTag
        to={to}
        className="ListItemBarComponent"
        // className={className}
        onClick={onClick}
        style={{ textDecoration: "none" }}
      >
        <>
          {changeStatus ? (
            <Checkbox
              checked={status}
              onChange={changeStatus}
              inputProps={{ "aria-label": "controlled" }}
              sx={{
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--fourth-object-color"),
                "&.Mui-checked": {
                  color: getComputedStyle(
                    document.documentElement
                  ).getPropertyValue("--fourth-object-color"),
                },
              }}
            />
          ) : null}

          <div className="NoteTitleArea">
            <div className="NoteTitleText">{item.title}</div>
          </div>
          <div className="DateTimeArea">
            <>
              {item.end ? (
                <div className="DateTime">
                  {formatAMPM(new Date(item.createdAt))} {" - "}
                  {formatAMPM(new Date(item.end))}
                </div>
              ) : null}
            </>
            <>
              {item.date ? (
                <div className="DateTime">
                  {item.date.seconds
                    ? moment(new Date(item.date.seconds * 1000)).calendar(
                        null,
                        {
                          lastDay: "[Yest. at] LT",
                          sameDay: "[Today at] LT",
                          nextDay: "[Tom. at] LT",
                          lastWeek: "[Last] ddd LT",
                          nextWeek: "ddd LT",
                          sameElse: "L",
                        }
                      )
                    : moment(new Date(item.date)).calendar()}
                </div>
              ) : null}
            </>
          </div>
          <div className="FullDateArea">
            {moment(new Date(item.createdAt)).calendar()}
          </div>
        </>
      </CustomTag>
      {assignees ? (
        <div className="actionListAssignees">
          {assignees.map((assignee, i) => (
            <>
              <Tooltip
                placement="top"
                title={assignee}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <div className="memberCircle">{assignee.substring(0, 2)}</div>
              </Tooltip>
            </>
          ))}
        </div>
      ) : null}

      <button className="delete" onClick={onClickDelete}>
        {" "}
        <img src={deleteIcon} />
      </button>
    </div>
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
