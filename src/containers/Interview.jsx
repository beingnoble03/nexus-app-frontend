import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { makeStyles, styled } from "@mui/styles";
import { Button, MenuItem } from "@mui/material";
import InterviewTable from "../components/InterviewTable";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  roundsVisibilityChanged,
  fetchRounds,
  selectedSeasonIdChanged,
} from "../app/features/drawerSlice";
import { titleChanged } from "../app/features/appBarSlice";
import axios from "axios";
import Paginator from "../components/Paginator";
import { Fab } from "@mui/material";
import { Filter, Close, Add } from "@mui/icons-material";
import { Modal, Typography, Switch, Badge, TextField } from "@mui/material";
import {
  filterCompletedToggled,
  filterMaxMarksChanged,
  filterMaxTimeAssignedChanged,
  filterMaxTimeEnteredChanged,
  filterMinMarksChanged,
  filterMinTimeAssignedChanged,
  filterMinTimeEnteredChanged,
  filterPendingToggled,
  filterTopInterviewsChanged,
} from "../app/features/interviewSlice";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify";


const style = {
  position: "absolute",
  bottom: "140px",
  right: { sm: `20px` },
  width: { xs: `95%`, sm: 580 },
  marginLeft: { xs: `50%`, sm: `0px` },
  transform: { xs: `translateX(-50%)`, sm: `translateX(0%)` },
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: `20px`,
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

const footerStyle = {
  display: `flex`,
  flexDirection: `row`,
  height: `auto`,
  alignItems: `center`,
  flexWrap: `wrap`,
  gap: `20px`,
  justifyContent: { xs: `center`, sm: `` },
  paddingBottom: `20px`,
  paddingLeft: `20px`,
};

const useStyles = makeStyles({
  mainContainer: {
    display: `flex`,
    width: `100%`,
    flexDirection: `column`,
  },
  interviewTableContainer: {
    width: `100%`,
    flexGrow: 1,
    padding: `15px`,
  },
  footer: {
    display: `flex`,
    padding: `10px`,
    paddingBottom: `20px`,
    flexDirection: `row`,
    height: `auto`,
    paddingLeft: `30px`,
  },
  paginatorConatiner: {
    display: `flex`,
    justifyContent: `flex-end`,
    alignContent: `flex-end`,
    flexGrow: 1,
    paddingRight: `20px`,
  },
  floatingBtnContainer: {
    display: `flex`,
    width: `100%`,
    justifyContent: `flex-end`,
    padding: `20px`,
  },
  headingContainer: {
    display: `flex`,
    width: `100%`,
    justifyContent: `space-between`,
    alignItems: `center`,
    flexDirection: `row`,
  },
  filterMainContainer: {
    display: `flex`,
    padding: `10px`,
    flexDirection: `column`,
  },
  completeSwicthContainer: {
    display: `flex`,
    flexDirection: `row`,
    flexWrap: `wrap`,
    gap: `15px`,
    paddingLeft: `10px`,
    paddingTop: `10px`,
  },
  dateTimeFilterContainer: {
    display: `flex`,
    flexDirection: `row`,
    flexWrap: `wrap`,
    gap: `10px`,
  },
  switchAndLabelContainer: {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
  },
  inputTestModal: {
    width: `45%`,
    marginTop: `10px !important`,
  },
  moveSelectedRowsContainer: {
    display: `flex`,
    minWidth: `300px`,
    justifyContent: `space-between`,
    flexDirection: `row`,
    alignItems: `center`,
  },
  marksFilterContainer: {
    display: `flex`,
    flexDirection: `column`,
    flexWrap: `wrap`,
    gap: `10px`,
  },
  inputMarksContainer: {
    display: `flex`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    gap: `20px`,
  },
  saveQuestionBtnContainer: {
    display: `flex`,
    justifyContent: `flex-end`,
    marginTop: `15px`,
  },
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 10,
    top: 5,
    padding: "0 4px",
    zIndex: 1300,
  },
}));

export default function Interview() {
  const {
    mainContainer,
    interviewTableContainer,
    paginatorConatiner,
    floatingBtnContainer,
    headingContainer,
    filterMainContainer,
    completeSwicthContainer,
    switchAndLabelContainer,
    inputTestModal,
    dateTimeFilterContainer,
    moveSelectedRowsContainer,
    marksFilterContainer,
    inputMarksContainer,
    saveQuestionBtnContainer,
  } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, roundId } = useParams();
  const initialSelectedSeasonId = useSelector(
    (state) => state.drawer.selectedSeasonId
  );
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const rounds = useSelector((state) => state.drawer.rounds);
  const filterCompleted = useSelector(
    (state) => state.interview.filterCompleted
  );
  const filterPending = useSelector((state) => state.interview.filterPending);
  const numOfFiltersApplied = useSelector(
    (state) => state.interview.numOfFiltersApplied
  );
  const filterMinTimeAssigned = useSelector(
    (state) => state.interview.filterMinTimeAssigned
  );
  const filterMaxTimeAssigned = useSelector(
    (state) => state.interview.filterMaxTimeAssigned
  );
  const filterMinTimeEntered = useSelector(
    (state) => state.interview.filterMinTimeEntered
  );
  const filterMaxTimeEntered = useSelector(
    (state) => state.interview.filterMaxTimeEntered
  );
  const filterMinMarks = useSelector((state) => state.interview.filterMinMarks);
  const filterMaxMarks = useSelector((state) => state.interview.filterMaxMarks);
  const filterTopInterviews = useSelector((state) => state.interview.filterTopInterviews);
  const [isMaster, setIsMaster] = useState(false);
  const [reFetchInterviews, setReFetchInterviews] = useState(0);

  const handleCompletedSwitch = (event) => {
    dispatch(filterCompletedToggled(event.target.checked));
  };

  const handlePendingSwitch = (event) => {
    dispatch(filterPendingToggled(event.target.checked));
  };

  const handleClearTimeAssignedFilter = () => {
    dispatch(filterMaxTimeAssignedChanged(""));
    dispatch(filterMinTimeAssignedChanged(""));
  };

  const handleClearTimeEnteredFilter = () => {
    dispatch(filterMaxTimeEnteredChanged(""));
    dispatch(filterMinTimeEnteredChanged(""));
  };

  const handleFilterMinMarks = (event) => {
    dispatch(
      filterMinMarksChanged(
        event.target.value === "" ? null : Number(event.target.value)
      )
    );
  };

  const handleFilterMaxMarks = (event) => {
    dispatch(
      filterMaxMarksChanged(
        event.target.value === "" ? null : Number(event.target.value)
      )
    );
  };

  const handleFilterTopInterviews = (event) => {
    dispatch(
      filterTopInterviewsChanged(
        event.target.value === "" ? null : Number(event.target.value)
      )
    )
  }

  const filtersModal = (
    <Modal
      open={openFiltersModal}
      onClose={() => setOpenFiltersModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      hideBackdrop={true}
    >
      <Box sx={style}>
        <div className={headingContainer}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Filters
          </Typography>
          <div
            onClick={() => setOpenFiltersModal(false)}
            style={{
              cursor: `pointer`,
            }}
          >
            <Close />
          </div>
        </div>
        <div className={filterMainContainer}>
          {isMaster && (
            <div className={marksFilterContainer}>
              <Typography>
                <b>Based on Marks</b>
              </Typography>
              <div className={inputMarksContainer}>
                <TextField
                  variant="filled"
                  label="Minimum Marks"
                  value={filterMinMarks === null ? "" : filterMinMarks}
                  onChange={handleFilterMinMarks}
                  sx={{
                    width: `100%`,
                  }}
                />
                <TextField
                  variant="filled"
                  label="Maximum Marks"
                  value={filterMaxMarks === null ? "" : filterMaxMarks}
                  onChange={handleFilterMaxMarks}
                  sx={{
                    width: `100%`,
                  }}
                />
                <TextField
                  variant="filled"
                  label="Show x% top applicants"
                  value={filterTopInterviews === null ? "" : filterTopInterviews}
                  placeholder="Enter x"
                  onChange={handleFilterTopInterviews}
                  sx={{
                    width: `100%`,
                  }}
                />
              </div>
            </div>
          )}
          <Typography
            variant="subtitle1"
            style={{
              marginTop: `10px`,
            }}
          >
            <b>Time Assigned</b>
          </Typography>
          <div className={dateTimeFilterContainer}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className={inputTestModal}
                renderInput={(props) => (
                  <TextField {...props} variant="filled" />
                )}
                label="Minimum Limit"
                value={filterMinTimeAssigned}
                onChange={(newValue) => {
                  dispatch(
                    filterMinTimeAssignedChanged(
                      newValue ? String(newValue) : null
                    )
                  );
                }}
              />
              <DateTimePicker
                className={inputTestModal}
                renderInput={(props) => (
                  <TextField {...props} variant="filled" />
                )}
                label="Maximum Limit"
                value={filterMaxTimeAssigned}
                onChange={(newValue) => {
                  dispatch(
                    filterMaxTimeAssignedChanged(
                      newValue ? String(newValue) : null
                    )
                  );
                }}
              />
            </LocalizationProvider>
            <Button onClick={handleClearTimeAssignedFilter}>Clear</Button>
          </div>
          <Typography
            variant="subtitle1"
            style={{
              marginTop: `20px`,
            }}
          >
            <b>Time Entered</b>
          </Typography>
          <div className={dateTimeFilterContainer}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className={inputTestModal}
                renderInput={(props) => (
                  <TextField {...props} variant="filled" color="primary" />
                )}
                label="Minimum Limit"
                value={filterMinTimeEntered}
                onChange={(newValue) => {
                  dispatch(
                    filterMinTimeEnteredChanged(
                      newValue ? String(newValue) : null
                    )
                  );
                }}
              />
              <DateTimePicker
                className={inputTestModal}
                renderInput={(props) => (
                  <TextField {...props} variant="filled" />
                )}
                label="Maximum Limit"
                value={filterMaxTimeEntered}
                onChange={(newValue) => {
                  dispatch(
                    filterMaxTimeEnteredChanged(
                      newValue ? String(newValue) : null
                    )
                  );
                }}
              />
            </LocalizationProvider>
            <Button onClick={handleClearTimeEnteredFilter}>Clear</Button>
          </div>
          <div className={completeSwicthContainer}>
            <div className={switchAndLabelContainer}>
              <Typography variant="subtitle1">Show only Completed</Typography>
              <Switch
                onChange={handleCompletedSwitch}
                checked={filterCompleted}
                color="primary"
                disabled={filterPending}
              />
            </div>
            <div className={switchAndLabelContainer}>
              <Typography variant="subtitle1">Show only Pending</Typography>
              <Switch
                onChange={handlePendingSwitch}
                checked={filterPending}
                color="primary"
                disabled={filterCompleted}
              />
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );

  useEffect(() => {
    if (initialSelectedSeasonId !== id) {
      dispatch(selectedSeasonIdChanged(id));
      dispatch(fetchRounds());
    }
    dispatch(roundsVisibilityChanged(true));
  }, [id]);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/roundDetails/${roundId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      dispatch(titleChanged(response.data.round_name));
    });
  }, [roundId]);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/current_user/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setIsMaster(response.data[0].is_master);
    });
  }, []);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRound, setSelectedRound] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const [openAddApplicantModal, setOpenAddApplicantModal] = useState(false)


  const handleAddApplicants = () => {
    var formData = new FormData();
    let csvFile = document.getElementById("csv-file-upload").files[0];
    formData.append("csvFile", csvFile);
    formData.append("round_id", roundId);

    axios({
      method: "post",
      url: `http://localhost:8000/api/interviews/csvFile/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    }).then((response) => {
      toast.success("Interviews added successfully.", {
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
      setOpenAddApplicantModal(false);
      setReFetchInterviews(reFetchInterviews + 1);
    }).catch((response) => {
      toast.error("Some error occured. Try adding other file.", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "error1",
      });
    });
  };

  const addApplicantModal = (
    <Modal
      open={openAddApplicantModal}
      onClose={() => setOpenAddApplicantModal(false)}
    >
      <Box sx={addApplicantStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Adding Applicants
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            marginTop: `20px`,
            marginBottom: `5px`,
          }}
        >
          Upload CSV
        </Typography>
        <form encType="multipart/form-data">
          <input type="file" id="csv-file-upload" accept=".csv"/>
        </form>
        <div className={saveQuestionBtnContainer}>
          <Button variant="contained" onClick={handleAddApplicants}>
            Add
          </Button>
        </div>
      </Box>
    </Modal>
  );

  const handleChangeRound = (event) => {
    setSelectedRound(event.target.value);
    if (selectedRows.length) {
      setOpenConfirmationModal(true);
    }
  };

  return (
    <div className={mainContainer}>
      <div className={interviewTableContainer}>
        <InterviewTable
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          reFetchInterviews={reFetchInterviews}
        />
        <Button
        sx={{
          width: `100%`,
          bgcolor: `#F8F8FF`,
        }}
        onClick={() => setOpenAddApplicantModal(true)}
      >
        <Add sx={{
          height: `15px`,
          width: `auto`,
          marginTop: `-1px`,
          marginRight: `3px`,
        }}/> Add Applicants
      </Button>
      </div>
      <div className={floatingBtnContainer}>
        <StyledBadge badgeContent={numOfFiltersApplied} color="secondary">
          <Fab
            variant="extended"
            color="primary"
            style={{
              width: `fit-content`,
            }}
            onClick={() => setOpenFiltersModal(true)}
          >
            <Filter sx={{ mr: 1 }} />
            Filters
          </Fab>
        </StyledBadge>
      </div>
      <Box sx={footerStyle}>
        <Button variant="contained" onClick={() => navigate("/panels/")}>
          View Panels
        </Button>
        <div className={moveSelectedRowsContainer}>
          <Typography
            variant="subtitle1"
            color={selectedRows.length ? "black" : "GrayText"}
          >
            <b>{selectedRows.length}</b> Selected
          </Typography>
          <TextField
            id="input-selected-section"
            select
            label="Move to"
            value={selectedRound}
            onChange={handleChangeRound}
            variant="outlined"
            sx={{
              width: `200px`,
            }}
            size="small"
          >
            {rounds
              .filter((round) => String(round.id) !== roundId)
              .map((round, index) => (
                <MenuItem key={index} value={round.id}>
                  {round.round_name.length > 25
                    ? round.round_name.substr(0, 25) + "..."
                    : round.round_name}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <div className={paginatorConatiner}>
          <Paginator />
        </div>
      </Box>
      {filtersModal}
      {addApplicantModal}
      <ConfirmationModal
        roundName={
          selectedRound &&
          rounds.filter((round) => round.id === selectedRound)[0].round_name
        }
        roundType={
          selectedRound &&
          rounds.filter((round) => round.id === selectedRound)[0].round_type
        }
        openConfirmationModal={openConfirmationModal}
        setOpenConfirmationModal={setOpenConfirmationModal}
        applicantIds={selectedRows}
        roundId={selectedRound}
      />
    </div>
  );
}
