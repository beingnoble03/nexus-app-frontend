import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { makeStyles, styled } from "@mui/styles";
import { Button } from "@mui/material";
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
import { Filter, Close } from "@mui/icons-material";
import { Modal, Typography, Switch, Badge, TextField } from "@mui/material";
import {
  filterCompletedToggled,
  filterMaxTimeAssignedChanged,
  filterMaxTimeEnteredChanged,
  filterMinTimeAssignedChanged,
  filterMinTimeEnteredChanged,
  filterPendingToggled,
} from "../app/features/interviewSlice";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const style = {
  position: "absolute",
  bottom: "140px",
  right: { sm: `20px` },
  width: { xs: `95%`, sm: 580 },
  marginLeft: {xs: `50%`, sm: `0px`},
  transform: {xs: `translateX(-50%)`, sm: `translateX(0%)`},
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: `20px`,
  borderRadius: `10px`,
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
    footer,
    interviewTableContainer,
    paginatorConatiner,
    floatingBtnContainer,
    headingContainer,
    filterMainContainer,
    completeSwicthContainer,
    switchAndLabelContainer,
    inputTestModal,
    dateTimeFilterContainer,
  } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, roundId } = useParams();
  const initialSelectedSeasonId = useSelector(
    (state) => state.drawer.selectedSeasonId
  );
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
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

  return (
    <div className={mainContainer}>
      <div className={interviewTableContainer}>
        <InterviewTable />
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
      <div className={footer}>
        <Button variant="contained" onClick={() => navigate("/panels/")}>
          View Panels
        </Button>
        <div className={paginatorConatiner}>
          <Paginator />
        </div>
      </div>
      {filtersModal}
    </div>
  );
}
