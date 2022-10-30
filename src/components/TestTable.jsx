import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import axios from "axios";
import { makeStyles, styled } from "@mui/styles";
import {
  Button,
  Box,
  Modal,
  TextField,
  Typography,
  Tooltip,
  Checkbox,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  InputAdornment,
  CardContent,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import { Popover } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Paginator from "./Paginator";
import { useDispatch, useSelector } from "react-redux";
import {
  currentPageChanged,
  numOfPagesChanged,
} from "../app/features/paginatorSlice";
import { Badge, Fab, Switch } from "@mui/material";
import { Close, Filter } from "@mui/icons-material";
import {
  filterEvaluatedToggled,
  filterMaxMarksChanged,
  filterMinMarksChanged,
  filterNotEvaluatedToggled,
  filterTopTestsChanged,
} from "../app/features/testSlice";
import ConfirmationModal from "./ConfirmationModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Score } from "@mui/icons-material";
import BlueBanner from "./BlueBanner";
import {Add} from "@mui/icons-material"

const styleFiltersBox = {
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

const tableContainer = {
  flexGrow: 1,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: `80%` },
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: `10px`,
  maxHeight: `90%`,
  overflow: `scroll`,
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
};

const paginatorContainerStyle = {
  display: `flex`,
  justifyContent: `flex-end`,
  alignContent: `flex-end`,
  flexGrow: { sm: `1` },
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 10,
    top: 5,
    padding: "0 4px",
    zIndex: 1300,
  },
}));

const useStyles = makeStyles({
  createRoundBtnContainer: {
    display: `flex`,
    justifyContent: `flex-end`,
    marginTop: `15px`,
  },
  inputTestModal: {
    width: `100%`,
    marginTop: `10px !important`,
  },
  sectionContentContainer: {
    marginTop: `10px`,
    padding: `5px`,
  },
  applicantDetialsContainer: {
    margin: `20px 0px`,
    padding: `5px 10px`,
    border: `1px solid #e9f5f1`,
    borderRadius: `5px`,
    backgroundColor: `#e9f5f8`,
  },
  assigneeImage: {
    width: `30px`,
    height: `auto`,
    padding: 2,
  },
  assigneeTypography: {
    marginTop: `10px !important`,
  },
  footer: {
    display: `flex`,
    flexDirection: `row`,
    height: `auto`,
    alignItems: `center`,
    flexWrap: `wrap`,
    gap: `20px`,
  },
  paginatorConatiner: {
    display: `flex`,
    justifyContent: `flex-end`,
    alignContent: `flex-end`,
    flexGrow: 1,
  },
  floatingBtnContainer: {
    display: `flex`,
    width: `100%`,
    justifyContent: `flex-end`,
    paddingBottom: `25px`,
    paddingTop: `20px`,
  },
  switchAndLabelContainer: {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    margin: `10px 0px`,
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
  headingContainer: {
    display: `flex`,
    width: `100%`,
    justifyContent: `space-between`,
    alignItems: `center`,
    flexDirection: `row`,
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
  moveSelectedRowsContainer: {
    display: `flex`,
    minWidth: `300px`,
    justifyContent: `space-between`,
    flexDirection: `row`,
    alignItems: `center`,
  },
  questionsContainer: {
    display: `flex`,
    flexGrow: 1,
    width: `100%`,
    padding: `15px`,
    flexWrap: `wrap`,
    gap: `30px`,
    overflow: `scroll`,
  },
  card: {
    width: `320px`,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
    padding: `10px`,
    cursor: `pointer`,
    backgroundColor: `#F8F8FF !important`,
  },
  saveQuestionBtnContainer: {
    display: `flex`,
    justifyContent: `flex-end`,
    marginTop: `15px`,
  },
});

export default function TestTable(props) {
  const [applicants, setApplicants] = useState(null);
  const [testScore, setTestScore] = useState(null);
  const [openAddApplicantModal, setOpenAddApplicantModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const currentPage = useSelector((state) => state.paginator.currentPage);
  const numOfApplicantsPerPage = 2;
  const searchParams = useSelector((state) => state.search.searchParams);
  const numOfFiltersApplied = useSelector(
    (state) => state.test.numOfFiltersApplied
  );
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const filterEvaluated = useSelector((state) => state.test.filterEvaluated);
  const filterNotEvaluated = useSelector(
    (state) => state.test.filterNotEvaluated
  );
  const [isMaster, setIsMaster] = useState(false);
  const filterMinMarks = useSelector((state) => state.test.filterMinMarks);
  const filterMaxMarks = useSelector((state) => state.test.filterMaxMarks);
  const rounds = useSelector((state) => state.drawer.rounds);
  const [currentUserId, setCurrentUserId] = useState(null);
  const dispatch = useDispatch();

  const {
    createRoundBtnContainer,
    inputTestModal,
    applicantDetialsContainer,
    assigneeImage,
    assigneeTypography,
    floatingBtnContainer,
    switchAndLabelContainer,
    filterMainContainer,
    completeSwicthContainer,
    headingContainer,
    marksFilterContainer,
    inputMarksContainer,
    moveSelectedRowsContainer,
    questionsContainer,
    card,
    saveQuestionBtnContainer,
  } = useStyles();

  const getEndOfList = () => {
    if (currentPage * numOfApplicantsPerPage >= applicants.length) {
      return applicants.length;
    }
    return currentPage * numOfApplicantsPerPage;
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleFilterEvaluated = (event) => {
    dispatch(filterEvaluatedToggled(event.target.checked));
  };

  const handleFilterNotEvaluated = (event) => {
    dispatch(filterNotEvaluatedToggled(event.target.checked));
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

  const handleFilterTopTests = (event) => {
    dispatch(
      filterTopTestsChanged(
        event.target.value === "" ? null : Number(event.target.value)
      )
    );
  };

  const filterTopTests = useSelector((state) => state.test.filterTopTests);

  const [selectedRound, setSelectedRound] = useState("");

  const handleChangeRound = (event) => {
    setSelectedRound(event.target.value);
    if (selectedRows.length) {
      setOpenConfirmationModal(true);
    }
  };

  const handleTableRowClick = (applicantId) => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/testScore?applicant_id=${applicantId}&test_id=${props.testId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response.data);
        setTestScore(response.data);
        setOpen(true);
      })
      .catch((response) => {
        let errorTitle = "No questions available for this test.";
        if (response.response.status === 403) {
          errorTitle = "You are not permitted to view marks.";
        }
        toast.error(errorTitle, {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleSaveBtnClick = () => {
    const scores = [];
    testScore.sections.map((section, index) => {
      section.questions.map((question, index) => {
        scores.push({
          obtained_marks: document.getElementById(
            "input-marks-" + String(question.id)
          ).value,
          question: question.id,
          applicant: testScore.applicant_details.id,
          remarks: document.getElementById(
            "input-remarks-" + String(question.id)
          ).value,
        });
      });
    });
    axios({
      method: "post",
      url: `http://localhost:8000/api/testScore/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
        scores,
      },
    })
      .then((response) => {
        toast.success("Score Saved", {
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
        setOpen(false);
      })
      .catch((response) => {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const filtersModal = (
    <Modal
      open={openFiltersModal}
      onClose={() => setOpenFiltersModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      hideBackdrop={true}
    >
      <Box sx={styleFiltersBox}>
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
                  label="Show top x% Applicants"
                  placeholder="Enter x"
                  value={filterTopTests === null ? "" : filterTopTests}
                  onChange={handleFilterTopTests}
                  sx={{
                    width: `100%`,
                  }}
                />
              </div>
            </div>
          )}
          <Typography
            sx={{
              marginTop: `15px`,
            }}
          >
            <b>Based on Evaluation</b>
          </Typography>
          <div className={completeSwicthContainer}>
            <div className={switchAndLabelContainer}>
              <Typography variant="subtitle1">Show only Evaluated</Typography>
              <Switch
                onChange={handleFilterEvaluated}
                checked={filterEvaluated}
                color="primary"
                disabled={filterNotEvaluated}
              />
            </div>
            <div className={switchAndLabelContainer}>
              <Typography variant="subtitle1">
                Show only Not Evaluated
              </Typography>
              <Switch
                onChange={handleFilterNotEvaluated}
                checked={filterNotEvaluated}
                color="primary"
                disabled={filterEvaluated}
              />
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );

  const handleAddApplicants = () => {
    var formData = new FormData();
    let csvFile = document.getElementById("csv-file-upload").files[0];
    formData.append("csvFile", csvFile);
    formData.append("round_id", props.roundId);

    axios({
      method: "post",
      url: `http://localhost:8000/api/applicants/csvFile/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    }).then((response) => {
      toast.success("Applicants added successfully.", {
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
      axios({
        method: "get",
        url: `http://localhost:8000/api/testApplicants/${
          props.testId
        }?search=${searchParams}&evaluated=${
          filterEvaluated ? "true" : filterNotEvaluated ? "false" : ""
        }&min_marks=${filterMinMarks === null ? "" : filterMinMarks}&max_marks=${
          filterMaxMarks === null ? "" : filterMaxMarks
        }&top_percentage=${filterTopTests !== null ? "true" : "false"}`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }).then((response) => {
        setApplicants(
          filterTopTests === null
            ? response.data.applicants
            : response.data.applicants.slice(
                0,
                Math.floor(
                  (filterTopTests * response.data.applicants.length) / 100
                )
              )
        );
        dispatch(currentPageChanged(1));
        dispatch(
          numOfPagesChanged(
            filterTopTests === null
              ? Math.ceil(
                  response.data.applicants.length / numOfApplicantsPerPage
                )
              : Math.ceil(
                  Math.floor(
                    (filterTopTests * response.data.applicants.length) / 100
                  ) / numOfApplicantsPerPage
                )
          )
        );
      });
      
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

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/testApplicants/${
        props.testId
      }?search=${searchParams}&evaluated=${
        filterEvaluated ? "true" : filterNotEvaluated ? "false" : ""
      }&min_marks=${filterMinMarks === null ? "" : filterMinMarks}&max_marks=${
        filterMaxMarks === null ? "" : filterMaxMarks
      }&top_percentage=${filterTopTests !== null ? "true" : "false"}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setApplicants(
        filterTopTests === null
          ? response.data.applicants
          : response.data.applicants.slice(
              0,
              Math.floor(
                (filterTopTests * response.data.applicants.length) / 100
              )
            )
      );
      dispatch(currentPageChanged(1));
      dispatch(
        numOfPagesChanged(
          filterTopTests === null
            ? Math.ceil(
                response.data.applicants.length / numOfApplicantsPerPage
              )
            : Math.ceil(
                Math.floor(
                  (filterTopTests * response.data.applicants.length) / 100
                ) / numOfApplicantsPerPage
              )
        )
      );
    });
  }, [
    searchParams,
    filterEvaluated,
    filterNotEvaluated,
    filterMinMarks,
    filterMaxMarks,
    filterTopTests,
  ]);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/current_user/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setCurrentUserId(response.data[0].id);
      setIsMaster(response.data[0].is_master);
    });
  }, []);

  const [showOnlyAssignedToMe, setShowOnlyAssignedToMe] = useState(false);
  const handleShowOnlyAssignedToMe = (event) => {
    setShowOnlyAssignedToMe(event.target.checked);
    axios({
      method: "get",
      url: `http://localhost:8000/api/testScore?applicant_id=${event.target.value}&test_id=${props.testId}&show_for_current_user=${event.target.checked}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      console.log(response.data);
      setTestScore(response.data);
      setOpen(true);
    });
  };

  const testScoreModal = (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        maxHeight: `100%`,
      }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          <b>Editing Marks</b> {testScore && testScore.test_details.title}
        </Typography>
        <div className={applicantDetialsContainer}>
          <Typography variant="h6">Applicant Details</Typography>
          <Typography variant="subtitle1">
            <b>Name </b>
            {testScore && testScore.applicant_details.name}
          </Typography>
          <Typography variant="subtitle2">
            <b>Enrolment Number </b>
            {testScore && testScore.applicant_details.enrolment_number}
          </Typography>
        </div>
        <div className={switchAndLabelContainer}>
          <Switch
            onChange={handleShowOnlyAssignedToMe}
            checked={showOnlyAssignedToMe}
            color="primary"
            value={testScore ? testScore.applicant_details.id : ""}
          />
          <Typography variant="subtitle2">
            Show questions assigned to me
          </Typography>
        </div>
        {testScore &&
          testScore.sections.map((section, index) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6" key={"typography-1-" + String(index)}>
                  <b>Section </b>
                  {section.title}
                </Typography>
                <Chip
                  label={String(section.questions.length) + " Questions"}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{
                    marginTop: `5px`,
                    marginLeft: `5px`,
                  }}
                />
              </AccordionSummary>
              <AccordionDetails>
                <div className={questionsContainer}>
                  {!section.questions.length && (
                    <BlueBanner message="No questions to show" margin="0px" />
                  )}
                  {section.questions.map((question, questionIndex) => (
                    <Card
                      className={card}
                      key={String(index) + " " + String(questionIndex)}
                    >
                      <CardContent>
                        <Typography
                          key={"typography-2-" + String(questionIndex)}
                          variant="h6"
                        >
                          <b>Question {questionIndex + 1}</b>
                        </Typography>
                        <Tooltip title={question.title}>
                          <Typography variant="subtitle1">
                            {question.title.length > 35
                              ? question.title.substr(0, 35) + "..."
                              : question.title}
                          </Typography>
                        </Tooltip>
                        <Typography
                          varient="subtitle2"
                          key={"typography-3-" + String(questionIndex)}
                        >
                          <b>Maximum Marks </b>
                          {question.maximum_marks}{" "}
                        </Typography>
                        <TextField
                          id={"input-marks-" + String(question.id)}
                          type="number"
                          variant="outlined"
                          size="small"
                          sx={{
                            right: `0px`,
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography>Obtained Marks</Typography>
                              </InputAdornment>
                            ),
                          }}
                          defaultValue={
                            question.obtained_marks
                              ? String(question.obtained_marks)
                              : question.obtained_marks === 0
                              ? "0"
                              : ""
                          }
                          color={
                            question.obtained_marks ||
                            question.obtained_marks === 0
                              ? "error"
                              : "primary"
                          }
                          className={inputTestModal}
                        />
                        <TextField
                          id={"input-remarks-" + String(question.id)}
                          variant="outlined"
                          size="small"
                          sx={{
                            right: `0px`,
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Typography>Remarks</Typography>
                              </InputAdornment>
                            ),
                          }}
                          defaultValue={
                            question.remarks ? question.remarks : ""
                          }
                          color={
                            question.obtained_marks ||
                            question.obtained_marks === 0
                              ? "error"
                              : "primary"
                          }
                          className={inputTestModal}
                        />
                        <Typography
                          varient="subtitle2"
                          key={"typography-6-" + String(questionIndex)}
                          className={assigneeTypography}
                        >
                          <b>Assignees</b>
                        </Typography>
                        {question.assignee.length ? (
                          question.assignee.map((member, index) => (
                            <Tooltip title={member.name}>
                              <img
                                className={assigneeImage}
                                src={member.image}
                                key={"assignee-image-" + String(index)}
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={handlePopoverClose}
                              />
                            </Tooltip>
                          ))
                        ) : (
                          <>No member assigned</>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        <div className={createRoundBtnContainer}>
          <Button variant="contained" onClick={() => handleSaveBtnClick()}>
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );

  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleSelectAllRows = (event) => {
    if (event.target.checked) {
      setSelectedRows(applicants.map((applicant) => String(applicant.id)));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event) => {
    if (event.target.checked) {
      setSelectedRows((prevState) => [...prevState, event.target.value]);
    } else {
      setSelectedRows((prevState) =>
        prevState.filter((applicantId) => applicantId !== event.target.value)
      );
    }
    console.log(selectedRows);
  };

  return (
    <>
      <TableContainer sx={tableContainer}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Checkbox
                  color="primary"
                  indeterminate={
                    applicants &&
                    selectedRows.length > 0 &&
                    selectedRows.length < applicants.length
                  }
                  checked={
                    applicants && applicants.length === selectedRows.length
                  }
                  onChange={handleSelectAllRows}
                />
              </TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Enrolment Number</TableCell>
              <TableCell align="center">Mobile</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Edit Marks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants ? (
              applicants
                .slice(
                  (currentPage - 1) * numOfApplicantsPerPage,
                  getEndOfList()
                )
                .map((applicant) => (
                  <TableRow
                    key={applicant.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    role="checkbox"
                    tabIndex={-1}
                    aria-checked={true}
                    selected={true}
                  >
                    <TableCell component="th" scope="row" align="center">
                      <Checkbox
                        color="primary"
                        checked={
                          selectedRows.indexOf(String(applicant.id)) !== -1
                        }
                        onClick={handleSelectRow}
                        value={applicant.id}
                      />
                    </TableCell>
                    <TableCell align="center">{applicant.name}</TableCell>
                    <TableCell align="center">
                      {applicant.enrolment_number}
                    </TableCell>
                    <TableCell align="center">{applicant.mobile}</TableCell>
                    <TableCell align="center">{applicant.status}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleTableRowClick(applicant.id)}>
                        Edit Marks
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
      {addApplicantModal}
      {testScoreModal}
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
      {filtersModal}
      <Box sx={footerStyle}>
        <Link
          to={`/season/${props.seasonId}/test/${props.testId}/questions/`}
          style={{
            textDecoration: `none`,
          }}
        >
          <Button variant="contained">View Questions and Assignees</Button>
        </Link>
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
              .filter((round) => String(round.id) !== props.roundId)
              .map((round, index) => (
                <MenuItem key={index} value={round.id}>
                  {round.round_name.length > 25
                    ? round.round_name.substr(0, 25) + "..."
                    : round.round_name}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <Box sx={paginatorContainerStyle}>
          <Paginator />
        </Box>
      </Box>
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
    </>
  );
}
