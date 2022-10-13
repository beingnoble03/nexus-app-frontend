import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import { Modal, Box } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';

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
    width: `350px`,
    border: `1px solid black`,
    borderRadius: `10px`,
    height: `fit-content`,
    padding: `10px`,
  },
  assigneeImage: {
    width: `25px`,
    height: `25px`,
  },
  assigneeBadge: {
    display: `flex`,
    flexDirection: `row`,
    borderRadius: `10px`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  badgeContainer: {
    display: `flex`,
    flexDirection: `row`,
    gap: `5px`,
    flexWrap: `wrap`,
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

export default function PanelItem(props) {
  const {
    mainContainer,
    assigneeImage,
    assigneeBadge,
    badgeContainer,
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

  const [openPanelModal, setOpenPanelModal] = useState(false);
  const [status, setStatus] = useState(props.panel.status);
  const [available, setAvailable] = useState(props.panel.available ? "Available" : "Unavailable");
  const imgMembers = useSelector((state) => state.imgMember.imgMembers);
  const [panel, setPanel] = useState(null);
  const [selectedImgMembers, setSelectedImgMembers] = useState([])

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
    setSelectedImgMembers(panel.members)
  }

  const handleCheckboxChange = (event) => {
      if (event.target.checked) {
        setSelectedImgMembers(prevState => [...prevState, parseInt(event.target.value)])
      } else {
        setSelectedImgMembers(prevState => prevState.filter(id_ => id_ !== parseInt(event.target.value)))
      }
  }

  const handleSavePanel = () => {
    const place = document.getElementById("input-panel-place").value
    const panelAvailable = available === "Available"

    axios({
      method: "patch",
      url: `http://localhost:8000/api/panels/${panel.id}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
          place,
          status,
          available: panelAvailable,
          members: selectedImgMembers,
      },
    })
      .then((response) => {
          console.log(response.data)
          setPanel(response.data)
          setOpenPanelModal(false)
  })
}

  const panelModal = (
    <>
      {panel && (
        <Modal
          open={openPanelModal}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editing Panel
            </Typography>
            <TextField
              id="input-panel-place"
              label="Panel Place"
              variant="filled"
              className={inputQuestionTitle}
              defaultValue={panel.place}
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
                          defaultChecked={panel.members.indexOf(imgMember.id) !== -1}
                          onChange={handleCheckboxChange}
                          value={imgMember.id}
                          />
                          {imgMember.name}</div>
                    )}
                  </>
                ))}
            </div>
            <div className={saveQuestionBtnContainer}>
              <Button variant="contained" onClick={handleSavePanel}>
                Save
              </Button>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );




  useEffect(() => {
    axios({
      method: `get`,
      url: `http://localhost:8000/api/panels/${props.panel.id}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setPanel(response.data);
    });
  }, []);

  return (
    <div className={mainContainer}>
      {panel && (
        <>
          <Typography variant="h6">
            <b>Panel {props.count}</b>
          </Typography>
          <Typography variant="h6">{panel.place}</Typography>
          <Typography variant="subtitle1">
            <b>Panel Status</b>
          </Typography>
          <Typography>{panel.status}</Typography>
          <Typography variant="subtitle1">
            <b>Panel Availability</b>
          </Typography>
          <Typography>{panel.available ? "Available" : "Unavailable"}</Typography>
          <Typography variant="subtitle1">
            <b>IMG Members</b>
          </Typography>
          <div className={badgeContainer}>
            {panel.members_details.length ? (
              panel.members_details.map((member, index) => (
                <div className={assigneeBadge} key={String(index)}>
                  <img className={assigneeImage} src={member.image} />
                  <Typography sx={{ p: 1 }}>
                    <b>{member.name}</b>
                  </Typography>
                </div>
              ))
            ) : (
              <>No member present</>
            )}
          </div>
          <Button variant="contained" onClick={handleModalOpen}>
            Edit
          </Button>
        </>
      )}
      {panelModal}
    </div>
  );
}
