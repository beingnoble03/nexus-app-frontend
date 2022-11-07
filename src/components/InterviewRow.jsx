import { useState, useEffect } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { Modal, Box, Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: `80%` },
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: `10px`,
};

const addApplicantStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: `400px` },
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: `10px`,
  maxHeight: `90%`,
  overflow: `scroll`,
};

const useStyles = makeStyles({
  createRoundBtnContainer: {
    display: `flex`,
    justifyContent: `flex-end`,
    marginTop: `15px`,
    gap: `15px`,
  },
  inputTestModal: {
    width: `100%`,
    marginTop: `15px !important`,
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
  assigneeImage: {
    width: `30px`,
    height: `auto`,
    padding: 2,
  },
  assigneeTypography: {
    marginTop: `10px !important`,
  },
  card: {
    width: `320px`,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
    padding: `10px`,
    cursor: `pointer`,
    backgroundColor: `#F8F8FF !important`,
  },
  sectionsContainer: {
    display: `flex`,
    flexGrow: 1,
    width: `100%`,
    padding: `15px`,
    flexWrap: `wrap`,
    gap: `30px`,
    overflow: `scroll`,
  },
  saveQuestionBtnContainer: {
    display: `flex`,
    justifyContent: `flex-end`,
    marginTop: `15px`,
  },
});

export default function InterviewRow(props) {
  const {
    createRoundBtnContainer,
    inputTestModal,
    applicantDetialsContainer,
    sectionContentContainer,
    assigneeImage,
    assigneeTypography,
    card,
    sectionsContainer,
    saveQuestionBtnContainer,
  } = useStyles();

  const { id, roundId } = useParams();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openScoreModal, setOpenScoreModal] = useState(false);
  const [interview, setInterview] = useState(props.interview);
  const [timeAssigned, setTimeAssigned] = useState(dayjs(""));
  const [timeEntered, setTimeEntered] = useState(dayjs(""));
  const isMaster = useSelector((state) => state.user.isMaster);
  const [selectedPanel, setSelectedPanel] = useState("None");
  const [selectedStatus, setSelectedStatus] = useState("Completed");
  const [interviewScore, setInterviewScore] = useState(null);
  const interviewStatusChoices = props.interviewStatusChoices;
  const panelNames = props.panelNames;
  const navigate = useNavigate();

  const handleEditInterview = () => {
    setOpenEditModal(true);
  };

  const handlePanelChange = (event) => {
    setSelectedPanel(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSaveInterview = () => {
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
    }).then((response) => {
      console.log(response.data);
      setInterview(response.data);
      setOpenEditModal(false);
    });
  };

  const handleSaveInterviewMarks = () => {
    const scores = [];
    console.log(interviewScore.interview_remarks);
    interviewScore.round_details.sections.map((section, index) => {
      scores.push({
        section: section.id,
        interview: interview.id,
        obtained_marks: document.getElementById(
          "input-marks-" + String(section.id)
        ).value,
      });
    });
    axios({
      method: "post",
      url: `http://localhost:8000/api/interviewMarks/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
        scores,
      },
    }).catch((response) => {
      toast.error(response.message, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
    axios({
      method: "patch",
      url: `http://localhost:8000/api/interviews/${interview.id}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
        remarks: document.getElementById("interview-remarks").value,
      },
    }).then((response) => {
      toast.success("Interview Remarks & Marks Saved.", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "success1",
      });
      setOpenScoreModal(false);
    });
  };

  useEffect(() => {
    if (interview && interview.time_assigned) {
      setTimeAssigned(dayjs(interview.time_assigned));
    }
    if (interview && interview.time_entered) {
      setTimeEntered(dayjs(interview.time_entered));
    }
    if (interview) {
      setSelectedPanel(interview.panel ? interview.panel : "");
      setSelectedStatus(interview.completed ? "Completed" : "Pending");
    }
    console.log(interview);
  }, [openEditModal]);

  const scoreModal = (
    <Modal
      open={openScoreModal}
      onClose={() => setOpenScoreModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        maxHeight: `100%`,
      }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          <b>Sections</b>{" "}
          {interviewScore && interviewScore.round_details.round_name}
        </Typography>
        <div className={applicantDetialsContainer}>
          <Typography variant="h6">Applicant Details</Typography>
          <Typography variant="subtitle1">
            <b>Name </b>
            {interviewScore && interviewScore.applicant_details.name}
          </Typography>
          <Typography variant="subtitle2">
            <b>Enrolment Number </b>
            {interviewScore &&
              interviewScore.applicant_details.enrolment_number}
          </Typography>
          <TextField
            id="interview-remarks"
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              width: `300px`,
              margin: `10px 0px`,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>Remarks</Typography>
                </InputAdornment>
              ),
            }}
            defaultValue={
              interviewScore && interviewScore.interview_remarks
                ? interviewScore.interview_remarks
                : ""
            }
          />
        </div>

        <div className={sectionsContainer}>
          {interviewScore &&
            interviewScore.round_details.sections.map((section, index) => (
              <Card className={card} key={index}>
                <CardContent>
                  <Typography
                    variant="h6"
                    key={"typography-1-" + String(index)}
                  >
                    <b>{section.title}</b>
                  </Typography>

                  <Typography
                    varient="subtitle2"
                    key={"typography-3-" + String(index)}
                  >
                    <b>Maximum Marks </b>
                    {section.maximum_marks}{" "}
                  </Typography>

                  <TextField
                    id={"input-marks-" + String(section.id)}
                    type="number"
                    variant="outlined"
                    size="small"
                    sx={{
                      right: `0px`,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography>Obtained Marks</Typography>
                        </InputAdornment>
                      ),
                    }}
                    defaultValue={
                      section.obtained_marks
                        ? String(section.obtained_marks)
                        : section.obtained_marks === 0
                        ? "0"
                        : ""
                    }
                    color={
                      section.obtained_marks || section.obtained_marks === 0
                        ? "error"
                        : "primary"
                    }
                    className={inputTestModal}
                  />
                </CardContent>
              </Card>
            ))}
        </div>
        <div className={createRoundBtnContainer}>
          <Button
            variant="contained"
            onClick={() => handleSaveInterviewMarks()}
          >
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );

  const handleViewMarks = () => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/interviewMarks?applicant_id=${interview.applicant_details.id}&round_id=${roundId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response.data);
        setInterviewScore(response.data);
        setOpenScoreModal(true);
      })
      .catch((response) => {
        let errorTitle = "No sections available for this interview.";
        if (response.response.status === 403) {
          errorTitle = "You are not permitted to view interview marks.";
        }
        toast.error(errorTitle, {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

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
            {interview && interview.applicant_details.enrolment_number}
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
          <Button
            variant="contained"
            onClick={() => props.handleDeleteRow(interview.id)}
            color="error"
          >
            Delete
          </Button>
          <Button variant="contained" onClick={handleSaveInterview}>
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );

  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleOpenApplicantDetailsModal = () => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/applicants/${interview.applicant_details.id}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log(response.data);
      setOpenApplicantDetialsModal(true);
      setSelectedApplicant(response.data);
    });
  };

  const handleApplicantSave = () => {
    const applicantId = selectedApplicant.id;
    axios({
      method: "patch",
      url: `http://localhost:8000/api/applicants/${applicantId}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
        name: document.getElementById("details-applicant-name").value,
        enrolment_number: document.getElementById("details-applicant-enrolment")
          .value,
        mobile: document.getElementById("details-applicant-mobile").value,
        email: document.getElementById("details-applicant-email").value,
      },
    }).then((response) => {
      console.log(response.data);
      toast.success("Applicant Details Saved", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "success1",
      });
      setOpenApplicantDetialsModal(false);
    });
  };

  const [openApplicantDetailsModal, setOpenApplicantDetialsModal] =
    useState(false);

  const applicantDetailsModal = (
    <Modal
      open={openApplicantDetailsModal}
      onClose={() => setOpenApplicantDetialsModal(false)}
    >
      <Box sx={addApplicantStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          {selectedApplicant && selectedApplicant.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <b>Enrolment Number</b>{" "}
          {selectedApplicant && selectedApplicant.enrolment_number}
        </Typography>
        <TextField
          variant="outlined"
          className={inputTestModal}
          color="primary"
          defaultValue={selectedApplicant && selectedApplicant.mobile}
          id="details-applicant-mobile"
          label="Mobile"
        />
        <TextField
          variant="outlined"
          className={inputTestModal}
          color="primary"
          defaultValue={selectedApplicant && selectedApplicant.email}
          id="details-applicant-email"
          label="Email Address"
        />
        <div className={saveQuestionBtnContainer}>
          <Button variant="contained" onClick={handleApplicantSave}>
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );

  const handleSelectRow = (event) => {
    console.log(props.selectedApplicantIds);
    if (event.target.checked) {
      props.setSelectedRows((prevState) => [...prevState, event.target.value]);
      props.setSelectedApplicantIds((prevState) => [
        ...prevState,
        interview.applicant,
      ]);
    } else {
      props.setSelectedRows((prevState) =>
        prevState.filter((applicantId) => applicantId !== event.target.value)
      );
      props.setSelectedApplicantIds((prevState) =>
        prevState.filter((applicantId) => applicantId !== interview.applicant)
      );
    }
  };

  return (
    <>
      <TableRow
        key={interview.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        role="checkbox"
        tabIndex={-1}
        aria-checked={true}
        selected={true}
      >
        <TableCell component="th" scope="row" align="center">
          <Checkbox
            color="primary"
            checked={props.selectedRows.indexOf(String(interview.id)) !== -1}
            onClick={handleSelectRow}
            value={interview.id}
          />
        </TableCell>
        <TableCell align="center">
          <a
            onClick={handleOpenApplicantDetailsModal}
            style={{
              cursor: `pointer`,
              color: `#1976d2`,
            }}
          >
            {interview.applicant_details.name}
          </a>
        </TableCell>
        <TableCell align="center">
          {interview.applicant_details.enrolment_number}
        </TableCell>
        <TableCell align="center">
          {interview.applicant_details.mobile}
        </TableCell>
        <TableCell align="center">
          {interview.completed ? "Completed" : "Pending"}
        </TableCell>
        <TableCell align="center">
          <Link
            to={interview.panel ? `/panels/?pid=${interview.panel}` : `#`}
            style={{
              textDecoration: `none`,
            }}
          >
            {interview.panel
              ? interview.panel_place.length > 20
                ? interview.panel_place.substr(0, 20) + "..."
                : interview.panel_place
              : "NA"}
          </Link>
        </TableCell>
        <TableCell align="center">
          {interview.time_assigned
            ? moment(interview.time_assigned).format("MMMM Do YYYY, h:mm:ss a")
            : "NA"}
        </TableCell>
        <TableCell align="center">
          {interview.time_entered
            ? moment(interview.time_entered).format("MMMM Do YYYY, h:mm:ss a")
            : "NA"}
        </TableCell>
        <TableCell align="center">
          <Button onClick={handleEditInterview}>Edit</Button>
        </TableCell>
        <TableCell align="center">
          <Button onClick={handleViewMarks}>Marks</Button>
        </TableCell>
      </TableRow>
      {editInterviewModal}
      {scoreModal}
      {applicantDetailsModal}
    </>
  );
}
