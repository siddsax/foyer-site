import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./PopupActionItem.css";
import uuid from "react-uuid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useCallback, useRef } from "react";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "react-datepicker";
import Button from "@mui/material/Button";
import firebase from "../../firebase";
import EmailTemplate from "../EmailTemplate/EmailTemplate";
import "react-datepicker/dist/react-datepicker.css";
import ReactDOMServer from "react-dom/server";
import { setReminderMeeting } from "../GCalendarAPI/APIHelpers";
const PopupActionItem = (props) => {
  const {
    noteId,
    attendees,
    user,
    setRerenderActionItems,
    trigger,
    setLoading,
    setActionItems,
  } = props;

  const [date, setDate] = useState(null);
  const [assignees, setAssignees] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(new Date("01-01-1970 17:00:00"));
  const [shareMethod, setShareMethod] = useState(["Email"]);
  const db = firebase.firestore();
  const allShareMethods = ["Email", "Calendar"];
  var docRef = db.collection("Users").doc(`${user.uid}`);

  const submitActionItem = async (props) => {
    if (!assignees) {
      return null;
    }
    const { onClose } = props;
    const uid = uuid();

    for (let i = 0; i < assignees.length; i++) {
      assignees[i] = assignees[i].replace(/\s/g, "");
    }

    var dateCombined = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );

    // 6 hrs before sending reminder
    var dateReminder = new Date(dateCombined.getTime() - 6 * 60 * 60 * 1000);

    const newActionItem = {
      creatorEmail: user.email,
      creator: user.uid,
      assignees: assignees,
      title: title,
      noteId: noteId,
      date: dateCombined,
      dateReminder: dateReminder,
      status: false,
      reminderMail: false,
      finalMail: false,
      sendMail: shareMethod.indexOf("Email") > -1 ? true : false,
    };

    const dummyActionItem = { data: newActionItem };
    newActionItem.reminderMailCode = ReactDOMServer.renderToString(
      <EmailTemplate
        actionItem={dummyActionItem}
        firstMessageText="You have a reminder due soon"
      />
    );
    newActionItem.assignMailCode = ReactDOMServer.renderToString(
      <EmailTemplate
        actionItem={dummyActionItem}
        firstMessageText={
          "You have been assigned this Action Item" // by " + `${user.email}`
        }
      />
    );
    newActionItem.finalMailCode = ReactDOMServer.renderToString(
      <EmailTemplate
        actionItem={dummyActionItem}
        firstMessageText={"Kindly update the status of this action item"}
      />
    );

    await db.collection("ActionItems").doc(`${uid}`).set(newActionItem);
    if (
      user.actionItemShareMethod != shareMethod ||
      user.actionItemTime != time
    ) {
      await db.collection("Users").doc(user.uid).update({
        actionItemShareMethod: shareMethod,
        actionItemTime: time,
      });
    }

    console.log(
      shareMethod,
      "===============",
      shareMethod.indexOf("Calendar")
    );
    if (shareMethod.indexOf("Calendar") > -1) {
      setReminderMeeting({ actionItem: newActionItem });
    }

    setAssignees(null);
    setTitle("");
    setDate(null);
    if (setLoading) await setLoading(true);

    if (setActionItems) {
      setActionItems((preVal) => [
        ...preVal,
        { id: null, data: newActionItem },
      ]);
    }

    if (setRerenderActionItems)
      await setRerenderActionItems((preVal) => !preVal);

    onClose();
  };

  useEffect(() => {
    docRef.get().then((doc) => {
      if (doc.data().actionItemTime)
        setTime(new Date(doc.data().actionItemTime.seconds * 1000));
      setShareMethod(doc.data().actionItemShareMethod);
    });
  }, []);

  return (
    <Popup modal nested trigger={trigger}>
      {(close) => (
        <div className="modalCustom">
          <div className="headerArea">
            {" "}
            <div className="headerTextFollowUp">
              Add Reminder/Follow-ups
            </div>{" "}
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack sx={{ width: "100%" }}>
                <Autocomplete
                  onChange={(event, value) => setShareMethod(value)} // prints the selected value
                  multiple
                  searchText={shareMethod}
                  id="tags-outlined"
                  options={allShareMethods}
                  filterSelectedOptions
                  defaultValue={shareMethod}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Share Method"
                      id="margin-normal"
                      margin="normal"
                      defaultValue={shareMethod}
                    />
                  )}
                />
                {attendees.length ? (
                  <Autocomplete
                    onChange={(event, value) => setAssignees(value)} // prints the selected value
                    multiple
                    id="tags-outlined"
                    options={attendees}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Assignees"
                        id="margin-normal"
                        margin="normal"
                      />
                    )}
                  />
                ) : (
                  <TextField
                    label={"Assignees Email"}
                    id="margin-normal"
                    margin="normal"
                    value={assignees}
                    onChange={(event) =>
                      setAssignees(event.target.value.split(","))
                    }
                  />
                )}

                <TextField
                  label={"Title"}
                  id="margin-normal"
                  margin="normal"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <DatePicker
                  placeholderText="Finish Date"
                  selected={date}
                  dateFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                />

                <DatePicker
                  selected={time}
                  onChange={(time) => setTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="hh:mm aa"
                />
              </Stack>
              <div className="createActionItemButtonArea">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#EEBC1D",
                    color: "Black",
                    width: "50%",
                    "margin-top": "30px",
                  }}
                  onClick={() => submitActionItem({ onClose: close })}
                >
                  Create
                </Button>
              </div>
            </LocalizationProvider>
          </div>
          <div className="actions"></div>
        </div>
      )}
    </Popup>
  );
};

export default PopupActionItem;
