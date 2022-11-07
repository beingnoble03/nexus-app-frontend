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

export default function DeleteConfirmationModal(props) {
  const open = !!props.openConfirmationModal;
  const handleAbortButton = () => {
    props.setOpenConfirmationModal(false);
  };
  const handleConfirmButton = () => {
    if (props.roundType === "I") {
      props.applicantIds.map((value, index) => {
        axios({
          method: "delete",
          url: `http://localhost:8000/api/interviews/${value}/`,
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }).then((response) => {
          props.setReFetchInterviews(
            (reFetchInterviews) => reFetchInterviews + 1
          );
          props.setOpenConfirmationModal(false);
          toast.success("Deleted selected applicants.", {
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
    } else {
      props.applicantIds.map((value, index) => {
        axios({
          method: "patch",
          url: `http://localhost:8000/api/applicants/${value}/`,
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
          data: {
            action: "delete",
            round: [props.roundId],
          },
        }).then((response) => {
          console.log(response.data);
        });
      });
      props.setSelectedRows([]);
      props.fetchApplicants();
      props.setOpenConfirmationModal(false);
      toast.success("Deleted selected applicants.", {
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
          Delete the selected applicants?
        </Typography>
        <Box sx={buttonContainerStyle}>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleAbortButton}
          >
            Abort
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmButton}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
