import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import QuestionItem from "../components/QuestionItem";
import { fetchedImgMembers } from "../app/features/imgMemberSlice";
import { Modal, Box } from "@mui/material";
import { titleChanged } from "../app/features/appBarSlice";
import { fetchRounds, roundsVisibilityChanged, selectedSeasonIdChanged } from "../app/features/drawerSlice";

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
  },
  saveBtnContainer: {
    display: `flex`,
    padding: `20px`,
    width: `100%`,
    justifyContent: `flex-end`,
    flexDirection: `row`,
  },
  headingContainer: {
    display: `flex`,
    width: `100%`,
    padding: `15px`,
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
});

export default function Questions(props) {
  const {
    mainContainer,
    questionsContainer,
    saveBtnContainer,
    headingContainer,
    questionItemContainer,
    headingButtonsContainer,
    inputSelectedSection,
    inputQuestionTitle,
    saveQuestionBtnContainer,
    imgMembersContainer,
  } = useStyles();

  const { id, testId } = useParams();
  const [selectedSection, setSelectedSection] = useState("");
  const [test, setTest] = useState(null);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const imgMembers = useSelector((state) => state.imgMember.imgMembers);
  const [refresh, setRefresh] = useState(0);
  const dispatch = useDispatch();

  const handleCreateSection = () => {
    const sectionTitle = document.getElementById("input-section-title").value;
    axios({
      method: "post",
      url: `http://localhost:8000/api/sections/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
        title: sectionTitle,
        test: testId,
      },
    }).then((response) => {
      console.log(response.data);
      setSelectedSection(null);
      setOpenSectionModal(false);
      setRefresh(refresh + 1);
    });
  };

  const handleCreateQuestion = () => {
    if (selectedSection) {
      const questionTitle = document.getElementById(
        "input-question-title"
      ).value;
      const questionMaximumMarks = document.getElementById(
        "input-question-maximum-marks"
      ).value;
      axios({
        method: "post",
        url: `http://localhost:8000/api/questions/`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        data: {
          title: questionTitle,
          maximum_marks: questionMaximumMarks,
          section: selectedSection.id,
        },
      }).then((response) => {
        console.log(response.data);
        setOpenQuestionModal(false);
        setRefresh(refresh + 1);
        setSelectedSection(selectedSection);
      });
    }
  };

  const handleChange = (event) => {
    setSelectedSection(event.target.value);
    console.log(event.target.value);
  };

  const createQuestionModal = (
    <Modal
      open={openQuestionModal}
      onClose={() => setOpenQuestionModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Creating Question
        </Typography>
        <TextField
          id="input-question-title"
          label="Question Title"
          variant="filled"
          className={inputQuestionTitle}
        />
        <TextField
          id="input-question-maximum-marks"
          label="Question Maximum Marks"
          variant="filled"
          className={inputQuestionTitle}
        />
        <Typography variant="subtitle1">
          <b>Assignee</b>
        </Typography>
        <div className={imgMembersContainer}>
          {imgMembers &&
            imgMembers.map((imgMember, index) => (
              <>{imgMember.name && <div key={index}>{imgMember.name}</div>}</>
            ))}
        </div>
        <div className={saveQuestionBtnContainer}>
          <Button variant="contained" onClick={handleCreateQuestion}>
            Create
          </Button>
        </div>
      </Box>
    </Modal>
  );

  const createSectionModal = (
    <Modal
      open={openSectionModal}
      onClose={() => setOpenSectionModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Creating Section
        </Typography>
        <TextField
          id="input-section-title"
          label="Section Title"
          variant="filled"
          className={inputQuestionTitle}
        />
        <div className={saveQuestionBtnContainer}>
          <Button variant="contained" onClick={handleCreateSection}>
            Create
          </Button>
        </div>
      </Box>
    </Modal>
  );

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/testSections/${testId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        setTest(response.data);
        dispatch(titleChanged(response.data.title));
      })
      .catch((response) => {
        console.log(response.message);
      });
  }, [refresh]);

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
      dispatch(selectedSeasonIdChanged(id))
      dispatch(fetchRounds())
      dispatch(roundsVisibilityChanged(true))
  }, []);

  return (
    <div className={mainContainer}>
      <div className={questionsContainer}>
        <div className={headingContainer}>
          <Typography variant="h6">
            <b>Questions and Assignees</b>
          </Typography>
          <div className={headingButtonsContainer}>
            <Button
              variant="outlined"
              onClick={() => setOpenQuestionModal(true)}
            >
              Add Question
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenSectionModal(true)}
            >
              Add Section
            </Button>
            {test && (
              <TextField
                id="input-selected-section"
                select
                label="Select Section"
                value={selectedSection}
                onChange={handleChange}
                variant="filled"
                className={inputSelectedSection}
              >
                {test.sections.map((section, index) => (
                  <MenuItem key={index} value={section}>
                    {section.title}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </div>
        </div>
        <div className={questionItemContainer}>
          {selectedSection
            ? selectedSection.questions.map((question, index) => (
                <QuestionItem
                  id={question.id}
                  key={question.id}
                  count={index + 1}
                />
              ))
            : "Select a section to find questions"}
        </div>
      </div>
      <div className={saveBtnContainer}>
        <Button variant="contained">Save Changes</Button>
      </div>
      {createQuestionModal}
      {createSectionModal}
    </div>
  );
}
