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
  } = props;

  const db = firebase.firestore();

  const submitActionItem = async () => {
    const uid = uuid();
    console.log("Test");
    const newActionItem = {
      creator: user.uid,
      assignees: assignees,
      title: title,
      date: date,
      status: false,
      noteId: noteId,
    };

    console.log(user, newActionItem);
    await db.collection("ActionItems").doc(`${uid}`).set(newActionItem);
    setAssignees(null);
    setTitle("");
    setDate(null);

    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack sx={{ width: "100%" }}>
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
