import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextField, MenuItem, Checkbox } from "@mui/material";
import axios from "axios";
import { Modal, Box } from "@mui/material";


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
  } = useStyles();

  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const imgMembers = useSelector((state) => state.imgMember.imgMembers);
  const [question, setQuestion] = useState(null)
  const [selectedImgMembers, setSelectedImgMembers] = useState([])


  const handleModalClose = () => {
    setOpenQuestionModal(false)
    setSelectedImgMembers([])
  }

  const handleModalOpen = () => {
    setOpenQuestionModal(true)
    setSelectedImgMembers(question.assignee)
  }

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedImgMembers(prevState => [...prevState, parseInt(event.target.value)])
    } else {
      setSelectedImgMembers(prevState => prevState.filter(id_ => id_ !== parseInt(event.target.value)))
    }
}

  const handleSaveQuestion = () => {
      const maximumMarks = document.getElementById("input-question-maximum-marks").value
      const title = document.getElementById("input-question-title").value
      axios({
        method: "patch",
        url: `http://localhost:8000/api/questions/${question.id}/`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        data: {
            title,
            "maximum_marks": maximumMarks,
            section: question.section,
            assignee: selectedImgMembers,
        },
      })
        .then((response) => {
            console.log(response.data)
            setQuestion(response.data)
            setOpenQuestionModal(false)
    })
  }

  useEffect(() => {
      axios({
          method: `get`,
          url: `http://localhost:8000/api/questions/${props.id}/`,
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
      }). then((response) => {
          setQuestion(response.data)
      })
  }, [])

  const questionModal = (
      <>
      { question && 
      <Modal
        open={openQuestionModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
            {imgMembers.map((imgMember, index) => (
              <>{imgMember.name && 
                <div key={index}>
                  <Checkbox 
                defaultChecked={question.assignee.indexOf(imgMember.id) !== -1}
                onChange={handleCheckboxChange}
                value={imgMember.id}
                />{imgMember.name}</div>}</>
            ))}
          </div>
          <div className={saveQuestionBtnContainer}>
            <Button variant="contained" onClick={handleSaveQuestion}>Save</Button>
          </div>
        </Box>
      </Modal>
            }
        </>
  );

  return (
    <div className={mainContainer}>
        { question && 
        <>
      <Typography variant="h6">
        <b>Question {props.count}</b>
      </Typography>
      <Typography variant="h6">{question.title}</Typography>
      <Typography variant="subtitle1">
        <b>Maximum Marks</b>
      </Typography>
      <Typography>
          {question.maximum_marks}
      </Typography>
      <Typography variant="subtitle1">
        <b>Assignee</b>
      </Typography>
      <div className={badgeContainer}>
        {question.assignee_details.length ? (
          question.assignee_details.map((member, index) => (
            <div
              className={assigneeBadge}
              key={String(index)}
            >
              <img className={assigneeImage} src={member.image} />
              <Typography sx={{ p: 1 }}>
                <b>{member.name}</b>
              </Typography>
            </div>
          ))
        ) : (
          <>No member assigned</>
        )}
      </div>
      <Button variant="contained" onClick={handleModalOpen}>
        Edit
      </Button>
      </>
}
      {questionModal}
    </div>
  );
}
