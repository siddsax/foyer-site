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
import TimePicker from "@mui/lab/TimePicker";
import InputTags from "../InputTags/InputTags";

import "react-datepicker/dist/react-datepicker.css";

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

    const newActionItem = {
      creator: user.uid,
      assignees: assignees,
      title: title,
      date: date,
      status: false,
      noteId: noteId,
      time: time,
    };

    console.log(user, newActionItem);
    await db.collection("ActionItems").doc(`${uid}`).set(newActionItem);
    setAssignees(null);
    setTitle("");
    setDate(null);
    if (setLoading) {
      await setLoading(true);
      console.log("***");
    }

    if (setActionItems) {
      setActionItems((preVal) => [
        ...preVal,
        { id: null, data: newActionItem },
      ]);
    }

    if (setRerenderActionItems) {
      await setRerenderActionItems((preVal) => !preVal);
      console.log("***---");
    }

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
          onChange={(time) => {
            console.log(time);
            setTime(time);
          }}
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
