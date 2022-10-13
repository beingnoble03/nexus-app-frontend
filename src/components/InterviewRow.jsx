import { useState, useEffect } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { Button, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { Modal, Box, Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: `10px`,
  };

  const useStyles = makeStyles({
    createRoundBtnContainer: {
      display: `flex`,
      justifyContent: `flex-end`,
      marginTop: `15px`,
    },
    inputTestModal: {
      width: `100%`,
      marginTop: `10px !important`,
    },
    sectionContentContainer: {
      marginTop: `10px`,
      padding: `5px`,
    },
    applicantDetialsContainer: {
      marginTop: `10px`,
      padding: `5px 10px`,
      border: `1px solid #e9f5f1`,
      borderRadius: `5px`,
      backgroundColor: `#e9f5f8`,
    },
  });

export default function InterviewRow(props) {


  const {
    createRoundBtnContainer,
    inputTestModal,
    applicantDetialsContainer,
  } = useStyles();

  const { id, roundId } = useParams();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [interview, setInterview] = useState(props.interview);
  const [timeAssigned, setTimeAssigned] = useState(dayjs(""));
  const [timeEntered, setTimeEntered] = useState(dayjs(""));
  const [selectedPanel, setSelectedPanel] = useState("None");
  const [selectedStatus, setSelectedStatus] = useState("");
  const interviewStatusChoices = props.interviewStatusChoices
  const panelNames = props.panelNames

  const handleEditInterview = () => {
      setOpenEditModal(true)
  }

  const handlePanelChange = (event) => {
    setSelectedPanel(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };



  const handleSaveInterview = () =>{
    axios({
      method: "patch",
      url: `http://localhost:8000/api/interviews/${interview.id}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
          applicant: interview.applicant,
          completed: selectedStatus === "Completed",
          round: roundId,
          panel: selectedPanel === "None" ? null : selectedPanel,
          time_assigned: timeAssigned,
          time_entered: timeEntered,
      },
    })
      .then((response) => {
          console.log(response.data)
          setInterview(response.data)
          setOpenEditModal(false)
  })
  }
  useEffect(() => {
    if (interview && interview.time_assigned) {
      setTimeAssigned(dayjs(interview.time_assigned));
    }
    if (interview && interview.time_entered) {
      setTimeEntered(dayjs(interview.time_entered));
    }
    if (interview) {
        setSelectedPanel(interview.panel ? interview.panel : "");
        setSelectedStatus(interview.completed ? "Completed" : "Pending")
    }
  }, [openEditModal]);

  const editInterviewModal = (
    <Modal
      open={openEditModal}
      onClose={() => setOpenEditModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        maxHeight: `100%`,
      }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          <b>Editing Interview</b>
        </Typography>
        <div className={applicantDetialsContainer}>
          <Typography variant="h6">Applicant Details</Typography>
          <Typography variant="subtitle1">
            <b>Name </b>
            {interview && interview.applicant_details.name}
          </Typography>
          <Typography variant="subtitle2">
            <b>Enrolment Number </b>
            {interview &&
              interview.applicant_details.enrolment_number}
          </Typography>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            className={inputTestModal}
            renderInput={(props) => <TextField {...props} />}
            label="Time Assigned"
            value={timeAssigned}
            onChange={(newValue) => {
              setTimeAssigned(newValue);
            }}
          />
          <DateTimePicker
            className={inputTestModal}
            renderInput={(props) => <TextField {...props} />}
            label="Time Entered"
            value={timeEntered}
            onChange={(newValue) => {
              setTimeEntered(newValue);
            }}
          />
        </LocalizationProvider>
        <TextField
          id="input-panel"
          select
          label="Select Panel"
          value={selectedPanel}
          onChange={handlePanelChange}
          variant="filled"
          className={inputTestModal}
        >
          {panelNames &&
            panelNames.map((name) => (
              <MenuItem key={name.value} value={name.value}>
                {name.label}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          id="input-interview-status"
          select
          label="Interview Status"
          value={selectedStatus}
          onChange={handleStatusChange}
          variant="filled"
          className={inputTestModal}
        >
          {interviewStatusChoices &&
            interviewStatusChoices.map((statusChoice) => (
              <MenuItem key={statusChoice.value} value={statusChoice.value}>
                {statusChoice.label}
              </MenuItem>
            ))}
        </TextField>
        <div className={createRoundBtnContainer}>
          <Button variant="contained" onClick={handleSaveInterview}>Save</Button>
        </div>
      </Box>
    </Modal>
  );


  return (
    <TableRow
      key={interview.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      role="checkbox"
      tabIndex={-1}
      aria-checked={true}
      selected={true}
      // onClick={() => handleTableRowClick(interview.id)}
    >
      <TableCell component="th" scope="row" align="center">
        {interview.id}
      </TableCell>
      <TableCell align="center">{interview.applicant_details.name}</TableCell>
      <TableCell align="center">
        {interview.applicant_details.enrolment_number}
      </TableCell>
      <TableCell align="center">{interview.applicant_details.mobile}</TableCell>
      <TableCell align="center">
        {interview.completed ? "Completed" : "Pending"}
      </TableCell>
      <TableCell align="center">
        {interview.panel
          ? interview.panel_place.length > 20
            ? interview.panel_place.substr(0, 20) + "..."
            : interview.panel_place
          : "NA"}
      </TableCell>
      <TableCell align="center">
        {interview.time_assigned ? interview.time_assigned : "NA"}
      </TableCell>
      <TableCell align="center">
        {interview.time_entered ? interview.time_entered : "NA"}
      </TableCell>
      <TableCell align="center">
        <Button onClick={handleEditInterview}>Edit</Button>
      </TableCell>
      {editInterviewModal}
    </TableRow>
  );
}
