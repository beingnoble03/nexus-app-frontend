import { Button, Modal, Box, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: 500 },
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: `10px`,
  maxHeight: `90%`,
  overflow: `scroll`,
};

const buttonContainerStyle = {
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `flex-end`,
  gap: `20px`,
  marginTop: `40px`,
};

export default function ConfirmationModal(props) {
  const open = props.openConfirmationModal;
  const handleAbortButton = () => {
    props.setOpenConfirmationModal(false);
    props.setSelectedRound("");
  };
  const handleConfirmButton = () => {
    if (props.roundType === "I") {
      axios({
        method: "post",
        url: `http://localhost:8000/api/interviews/`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        data: {
          applicant_ids: props.applicantIds,
          round_id: props.roundId,
          completed: false,
        },
      }).then((response) => {
        props.setSelectedRound("");
        props.setOpenConfirmationModal(false);
        toast.success("Added selected applicants.", {
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
      });
    } else {
      props.applicantIds.map((value, index) => {
        axios({
          method: "patch",
          url: `http://localhost:8000/api/applicants/${value}/`,
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
          data: {
            action: "add",
            round: [props.roundId],
          },
        }).then((response) => {
          props.setSelectedRound("");
          props.setOpenConfirmationModal(false);
          toast.success("Added selected applicants.", {
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
        });
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => props.setOpenConfirmationModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        maxHeight: `100%`,
      }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Moving the selected applicants to {String(props.roundName)}
        </Typography>
        <Box sx={buttonContainerStyle}>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleConfirmButton}
          >
            Confirm
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleAbortButton}
          >
            Abort
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
