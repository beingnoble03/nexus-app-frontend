import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextField, MenuItem, Checkbox } from "@mui/material";
import axios from "axios";
import { Modal, Box } from "@mui/material";
import { toast } from "react-toastify";

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
    gap: `15px`,
  },
  imgMembersContainer: {
    display: `grid`,
    width: `100%`,
    gridTemplateColumns: `1fr 1fr`,
    maxHeight: `200px`,
    overflow: `scroll`,
  },
  card: {
    width: `350px`,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
    padding: `10px`,
    backgroundColor: `#F8F8FF !important`,
    cursor: `pointer`,
  },
});

export default function QuestionItem(props) {
  const {
    mainContainer,
    assigneeImage,
    assigneeBadge,
    badgeContainer,
    inputQuestionTitle,
    saveQuestionBtnContainer,
    imgMembersContainer,
    card,
  } = useStyles();

  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const imgMembers = useSelector((state) => state.imgMember.imgMembers);
  const [question, setQuestion] = useState(null);
  const [selectedImgMembers, setSelectedImgMembers] = useState([]);

  const handleModalClose = () => {
    setOpenQuestionModal(false);
    setSelectedImgMembers([]);
  };

  const handleModalOpen = () => {
    setOpenQuestionModal(true);
    setSelectedImgMembers(question.assignee);
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedImgMembers((prevState) => [
        ...prevState,
        parseInt(event.target.value),
      ]);
    } else {
      setSelectedImgMembers((prevState) =>
        prevState.filter((id_) => id_ !== parseInt(event.target.value))
      );
    }
  };

  const handleSaveQuestion = () => {
    const maximumMarks = document.getElementById(
      "input-question-maximum-marks"
    ).value;
    const title = document.getElementById("input-question-title").value;
    axios({
      method: "patch",
      url: `http://localhost:8000/api/questions/${question.id}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
        title,
        maximum_marks: maximumMarks,
        section: question.section,
        assignee: selectedImgMembers,
      },
    })
      .then((response) => {
        console.log(response.data);
        setQuestion(response.data);
        setOpenQuestionModal(false);
      })
      .catch((response) => {
        toast.error(response.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    axios({
      method: `get`,
      url: `http://localhost:8000/api/questions/${props.id}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setQuestion(response.data);
    });
  }, []);

  const questionModal = (
    <>
      {question && (
        <Modal open={openQuestionModal} onClose={() => setOpenQuestionModal(false)}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editing Question
            </Typography>
            <TextField
              id="input-question-title"
              label="Question Title"
              variant="filled"
              className={inputQuestionTitle}
              defaultValue={question.title}
            />

            <TextField
              id="input-question-maximum-marks"
              label="Question Maximum Marks"
              variant="filled"
              className={inputQuestionTitle}
              defaultValue={question.maximum_marks}
            />
            <Typography variant="subtitle1">
              <b>Assignee</b>
            </Typography>
            <div className={imgMembersContainer}>
              {imgMembers.filter(imgMember => imgMember.name !== null).map((imgMember, index) => (
                <span key={index}>
                  {imgMember.name && (
                    <div key={index}>
                      <Checkbox
                        defaultChecked={
                          question.assignee.indexOf(imgMember.id) !== -1
                        }
                        onChange={handleCheckboxChange}
                        value={imgMember.id}
                      />
                      {imgMember.name}
                    </div>
                  )}
                </span>
              ))}
            </div>
            <div className={saveQuestionBtnContainer}>
              <Button
                variant="contained"
                onClick={() => {
                  handleModalClose()
                  props.handleDeleteQuestion(question.id)
                }}
                color="error"
              >
                Delete
              </Button>
              <Button variant="contained" onClick={handleSaveQuestion}>
                Save
              </Button>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );

  return (
    <Card className={card} onClick={handleModalOpen}>
      {question && (
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <b>Question {props.count}</b>
          </Typography>
          <Typography variant="subtitle1">
            {question.title.length > 35
              ? question.title.substr(0, 35) + "..."
              : question.title}
          </Typography>
          <Typography variant="subtitle2">
            <b>Maximum Marks</b>
          </Typography>
          <Typography>{question.maximum_marks}</Typography>
          <Typography variant="subtitle2">
            <b>Assignees</b>
          </Typography>
          <div className={badgeContainer}>
            {question.assignee_details.length ? (
              question.assignee_details.map((member, index) => (
                <Tooltip title={member.name} key={index}>
                  <img className={assigneeImage} src={member.image} />
                </Tooltip>
              ))
            ) : (
              <>No member assigned</>
            )}
          </div>
        </CardContent>
      )}
      {questionModal}
    </Card>
  );
}
