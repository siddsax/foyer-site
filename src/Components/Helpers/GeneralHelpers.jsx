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

export { formatMeeting, override };
