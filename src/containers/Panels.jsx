import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { titleChanged } from "../app/features/appBarSlice";
import { fetchPanels, panelsChanged } from "../app/features/panelSlice";
import { makeStyles } from "@mui/styles";
import { fetchedImgMembers } from "../app/features/imgMemberSlice";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import PanelItem from "../components/PanelItem";

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
  mainContainer: {
    display: `flex`,
    flexDirection: `column`,
    width: `100%`,
  },
  questionsContainer: {
    display: `flex`,
    flexGrow: 1,
    width: `100%`,
    flexDirection: `column`,
    overflow: `scroll`,
  },
  headingContainer: {
    display: `flex`,
    width: `100%`,
    padding: `25px`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    flexWrap: `wrap`,
  },
  headingButtonsContainer: {
    display: `flex`,
    flexDirection: `row`,
    flexWrap: `wrap`,
    gap: `10px`,
  },
  questionItemContainer: {
    display: `flex`,
    flexGrow: 1,
    width: `100%`,
    padding: `15px`,
    flexWrap: `wrap`,
    gap: `30px`,
    overflow: `scroll`,
  },
  inputSelectedSection: {
    width: `200px`,
  },
  inputQuestionTitle: {
    width: `100%`,
    marginTop: `10px !important`,
    marginBottom: `10px !important`,
  },
  saveQuestionBtnContainer: {
    display: `flex`,
    justifyContent: `flex-end`,
    marginTop: `15px`,
  },
  imgMembersContainer: {
    display: `grid`,
    width: `100%`,
    gridTemplateColumns: `1fr 1fr`,
    maxHeight: `200px`,
    overflow: `scroll`,
  },
  inputRoundType: {
    width: `100%`,
    marginTop: `10px !important`,
  },
});

export default function Panels() {
  const GETParams = new URLSearchParams(window.location.search)
  const highlightedPanelId = GETParams.get("pid")

  const {
    mainContainer,
    questionsContainer,
    headingContainer,
    questionItemContainer,
    headingButtonsContainer,
    inputSelectedSection,
    inputQuestionTitle,
    saveQuestionBtnContainer,
    imgMembersContainer,
    inputRoundType,
  } = useStyles();

  const panelStatus = [
    {
      value: "Busy",
      label: "Busy",
    },
    {
      value: "Vacant",
      label: "Vacant",
    },
  ];

  const panelAvailability = [
    {
      value: "Available",
      label: "Available",
    },
    {
      value: "Unavailable",
      label: "Unavailable",
    },
  ];

  const dispatch = useDispatch();
  const panel = useSelector((state) => state.panel);
  const [openPanelModal, setOpenPanelModal] = useState(false);
  const [status, setStatus] = useState("Busy");
  const [available, setAvailable] = useState("Available");
  const [refresh, setRefresh] = useState(0)
  const imgMembers = useSelector((state) => state.imgMember.imgMembers);
  const [selectedImgMembers, setSelectedImgMembers] = useState([])
  const searchParams = useSelector(state => state.search.searchParams)


  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleAvailableChange = (event) => {
    setAvailable(event.target.value);
  };
  const handleModalClose = () => {
    setOpenPanelModal(false)
    setSelectedImgMembers([])
  }

  const handleModalOpen = () => {
    setOpenPanelModal(true)
  }

  const handleCheckboxChange = (event) => {
      if (event.target.checked) {
        setSelectedImgMembers(prevState => [...prevState, parseInt(event.target.value)])
      } else {
        setSelectedImgMembers(prevState => prevState.filter(id_ => id_ !== parseInt(event.target.value)))
      }
  }

  const handleCreatePanel = () => {
    const place = document.getElementById("input-panel-place").value
    const available = document.getElementById("input-panel-availability").value === "Available"

    axios({
      method: "post",
      url: `http://localhost:8000/api/panels/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
          place,
          status: status,
          available,
          members: selectedImgMembers,
      },
    })
      .then((response) => {
          console.log(response.data)
          setRefresh(refresh+1)
          setOpenPanelModal(false)
  })
}

  const reFetchPanels = () => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/panels/?search=${searchParams}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        dispatch(panelsChanged(response.data))
    })
  }

  const createPanelModal = (
    <Modal
      open={openPanelModal}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Creating Panel
        </Typography>
        <TextField
          id="input-panel-place"
          label="Panel Place"
          variant="filled"
          className={inputQuestionTitle}
        />
        <TextField
          id="input-panel-status"
          select
          label="Panel Status"
          value={status}
          onChange={handleStatusChange}
          variant="filled"
          className={inputRoundType}
        >
          {panelStatus.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="input-panel-availability"
          select
          label="Panel Availability"
          value={available}
          onChange={handleAvailableChange}
          variant="filled"
          className={inputRoundType}
        >
          {panelAvailability.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </TextField>
        <Typography variant="subtitle1">
          <b>IMG Members</b>
        </Typography>
        <div className={imgMembersContainer}>
          {imgMembers &&
            imgMembers.map((imgMember, index) => (
              <>
                {imgMember.name && (
                  <div key={imgMember.id}>
                  <Checkbox 
                  onChange={handleCheckboxChange}
                  value={imgMember.id}
                  />{imgMember.name}</div>
                )}
              </>
            ))}
        </div>
        <div className={saveQuestionBtnContainer}>
          <Button variant="contained" onClick={handleCreatePanel}>
            Create
          </Button>
        </div>
      </Box>
    </Modal>
  );


  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/members/namesListNot2y`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        dispatch(fetchedImgMembers(response.data));
      })
      .catch((response) => {
        console.log(response.message);
      });
    dispatch(fetchPanels());
    dispatch(titleChanged("Panels"));
  }, [refresh, ]);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/panels/?search=${searchParams}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        dispatch(panelsChanged(response.data))
    })
  }, [searchParams])

  return (
    <div className={mainContainer}>
    <div className={questionsContainer}>
      <div className={headingContainer}>
        <Typography variant="h6">
          <b>Panels</b>
        </Typography>
        <div className={headingButtonsContainer}>
          <Button
            variant="outlined"
            onClick={handleModalOpen}
          >
            Add Panel
          </Button>
        </div>
      </div>
      <div className={questionItemContainer}>
        {panel.panels
          ? panel.panels.map((panel, index) => (
              <PanelItem
                panel = {panel}
                key={panel.id}
                count={index + 1}
                highlightPanel = {highlightedPanelId && highlightedPanelId === String(panel.id)}
                reFetchPanels = {reFetchPanels}
              />
            ))
          : "No Panel Available"}
      </div>
    </div>
    {createPanelModal}
  </div>
  );
}
