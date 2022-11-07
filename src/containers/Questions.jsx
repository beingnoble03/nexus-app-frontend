import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button, Checkbox, ListItem, List, ListItemButton, ListItemAvatar, ListItemText, Avatar, InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import QuestionItem from "../components/QuestionItem";
import { fetchedImgMembers } from "../app/features/imgMemberSlice";
import { Modal, Box } from "@mui/material";
import { titleChanged } from "../app/features/appBarSlice";
import {
  fetchRounds,
  roundsVisibilityChanged,
  selectedSeasonIdChanged,
} from "../app/features/drawerSlice";
import BlueBanner from "../components/BlueBanner";
import { toast } from "react-toastify";
import { Search } from "@mui/icons-material";

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
    width: `100%`,
    flexDirection: `column`,
    overflow: `scroll`,
  },
  headingContainer: {
    display: `flex`,
    width: `100%`,
    padding: `15px`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    flexWrap: `wrap`,
    alignItems: `center`,
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
  blueBannerContainer: {
    width: `100%`,
  },
});

export default function Questions(props) {
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
    blueBannerContainer,
  } = useStyles();

  const { id, testId } = useParams();
  const [selectedSection, setSelectedSection] = useState("");
  const [test, setTest] = useState(null);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [openSectionModal, setOpenSectionModal] = useState(false);
  // const imgMembers = useSelector((state) => state.imgMember.imgMembers);
  const [selectedImgMembers, setSelectedImgMembers] = useState([])
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
      setSelectedSection("");
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
          assignee: selectedImgMembers,
        },
      })
        .then((response) => {
          console.log(response.data);
          setSelectedImgMembers([])
          setOpenQuestionModal(false);
          const newQuestionsList = [
            ...selectedSection.questions,
            response.data,
          ];
          selectedSection.questions = newQuestionsList;
          toast.success("Question created.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((response) => {
          if ("maximum_marks" in response.response.data) {
            toast.error(
              "Maximum Marks: " + String(response.response.data.maximum_marks),
              {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              }
            );
          } else {
            toast.error(
              "Question Title: " + String(response.response.data.title),
              {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              }
            );
          }
        });
    }
  };

  const handleChange = (event) => {
    const newSelectedSection = test.sections.find(section => section.id === event.target.value)
    setSelectedSection(newSelectedSection);
    console.log(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedImgMembers(prevState => [...prevState, parseInt(event.target.value)])
    } else {
      setSelectedImgMembers(prevState => prevState.filter(id_ => id_ !== parseInt(event.target.value)))
    }
}

  const handleDeleteQuestion = (questionId) => {
    axios({
      method: "delete",
      url: `http://localhost:8000/api/questions/${questionId}/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      const newQuestionsList = selectedSection.questions.filter(
        (question) => question.id !== questionId
      );
      console.log(newQuestionsList)
      setSelectedSection(selectedSection => ({...selectedSection, questions: newQuestionsList}))
      selectedSection.questions = newQuestionsList;
      toast.success("Question deleted successfully.", {
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

  const handleQuestionModalClose = () => {
    setOpenQuestionModal(false)
    setSelectedImgMembers([])
  }

  const [imgMembers, setImgMembers] = useState([])

  const [search, setSearch] = useState("");

  const handleSearchInputChange = (event) => {
    setSearch(event.target.value);
  };

  const createQuestionModal = (
    <Modal
      open={openQuestionModal}
      onClose={handleQuestionModalClose}
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
        <TextField
          id="standard-search"
          type="search"
          variant="outlined"
          size="small"
          placeholder="Search"
          sx={{
            width: `100%`,
            margin: `10px 0px`,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={search}
          onChange={handleSearchInputChange}
        />
        <List
            dense
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", maxHeight: `150px`, overflow: `scroll` }}
          >
            {imgMembers
              .filter((imgMember) => imgMember.name !== null)
              .map(
                (imgMember, index) =>
                  imgMember.name && (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Checkbox
                          checked={selectedImgMembers.indexOf(imgMember.id) !== -1}
                          onChange={handleCheckboxChange}
                          value={imgMember.id}
                          id={String(index)}
                        />
                      }
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar src={imgMember.image}/>
                        </ListItemAvatar>
                        <ListItemText primary={imgMember.name} />
                      </ListItemButton>
                    </ListItem>
                  )
              )}
          </List>
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
        console.log(response.data);
        dispatch(titleChanged(response.data.title));
      })
      .catch((response) => {
        console.log(response.message);
      });
  }, [refresh]);


  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/members/namesListNot2y/?search=${search}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        setImgMembers(response.data)
      })
      .catch((response) => {
        console.log(response.message);
      });
    dispatch(selectedSeasonIdChanged(id));
    dispatch(fetchRounds());
    dispatch(roundsVisibilityChanged(true));
  }, [search, ]);

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
              disabled={!selectedSection}
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
                value={selectedSection.id}
                onChange={handleChange}
                variant="filled"
                className={inputSelectedSection}
                disabled={!test.sections.length}
              >
                {test.sections.map((section, index) => (
                  <MenuItem key={index} value={section.id}>
                    {section.title}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </div>
        </div>
        <div className={questionItemContainer}>
          {selectedSection ? (
            selectedSection.questions.length === 0 ? (
              <div className={blueBannerContainer}>
                <BlueBanner message="No questions available for this section." />
              </div>
            ) : (
              selectedSection.questions.map((question, index) => (
                <QuestionItem
                  id={question.id}
                  key={question.id}
                  count={index + 1}
                  handleDeleteQuestion={handleDeleteQuestion}
                />
              ))
            )
          ) : (
            <div className={blueBannerContainer}>
              <BlueBanner message="No section selected. Select section to find questions." />
            </div>
          )}
        </div>
      </div>
      {createQuestionModal}
      {createSectionModal}
    </div>
  );
}
