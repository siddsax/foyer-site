import moment from "moment";
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

export default function InputForm(props) {
  const {
    attendees,
    onClose,
    setTitle,
    setAssignees,
    setDate,
    date,
    title,
    assignees,
    user,
    noteId,
    time,
    setTime,
    setRerenderActionItems,
    setLoading,
    setActionItems,
  } = props;

  const db = firebase.firestore();

  const submitActionItem = async () => {
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
    console.log(dateCombined, dateReminder, "**");

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
    };

    var name = null;
    if (assignees.length == 1) {
      name = assignees[0];
    }

    const dummyActionItem = { data: newActionItem };
    console.log(moment(dummyActionItem.data.date).calendar());
    newActionItem.reminderMailCode = ReactDOMServer.renderToString(
      <EmailTemplate
        actionItem={dummyActionItem}
        // name={name}
        firstMessageText="You have a reminder due soon"
      />
    );
    newActionItem.assignMailCode = ReactDOMServer.renderToString(
      <EmailTemplate
        actionItem={dummyActionItem}
        // name={name}
        firstMessageText={
          "You have been assigned this Action Item" // by " + `${user.email}`
        }
      />
    );
    newActionItem.finalMailCode = ReactDOMServer.renderToString(
      <EmailTemplate
        actionItem={dummyActionItem}
        // name={name}
        firstMessageText={"Kindly update the status of this action item"}
      />
    );

    console.log(newActionItem);

    await db.collection("ActionItems").doc(`${uid}`).set(newActionItem);
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack sx={{ width: "100%" }}>
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
            onChange={(event) => setAssignees(event.target.value.split(","))}
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
          onClick={submitActionItem}
        >
          Create
        </Button>
      </div>
    </LocalizationProvider>
  );
}
