import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import { Button, Box, Modal, TextField, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { Popover } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Paginator from "./Paginator";
import { useDispatch, useSelector } from "react-redux";
import { currentPageChanged, numOfPagesChanged } from "../app/features/paginatorSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: 550 },
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: `10px`,
  maxHeight: `90%`,
  overflow: `scroll`,
};

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
    marginTop: `10px`,
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
  footer:{
    bottom: `0px`,
    display: `flex`,
    padding: `10px`,
    position: `fixed`,
    marginBottom: `10px`,
    width: `-webkit-fill-available`,
    flexWrap: `wrap`,
  },
  paginatorConatiner: {
    display: `flex`,
    justifyContent: `flex-end`,
    alignContent: `flex-end`,
    flexGrow: 1,
    paddingRight: `40px`,
  }
});

export default function TestTable(props) {
  const [applicants, setApplicants] = useState(null);
  const [testScore, setTestScore] = useState(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const currentPage = useSelector(state => state.paginator.currentPage)
  const numOfApplicantsPerPage = 2;
  const dispatch = useDispatch();

  const {
    createRoundBtnContainer,
    inputTestModal,
    sectionContentContainer,
    applicantDetialsContainer,
    assigneeImage,
    assigneeTypography,
    footer,
    paginatorConatiner,
  } = useStyles();

  const getEndOfList = () => {
    if (currentPage*numOfApplicantsPerPage >= applicants.length) {
      return applicants.length
    }
    return currentPage*numOfApplicantsPerPage
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);

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

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/testApplicants/${props.testId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setApplicants(response.data.applicants);
      dispatch(currentPageChanged(1))
      dispatch(numOfPagesChanged(Math.ceil(response.data.applicants.length / numOfApplicantsPerPage)));
    });
  }, []);

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
          <b>Questions</b> {testScore && testScore.test_details.title}
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
        {testScore &&
          testScore.sections.map((section, index) => (
            <div className={sectionContentContainer} key={index}>
              <Typography variant="h6" key={"typography-1-" + String(index)}>
                <b>Section </b>
                {section.title}
              </Typography>
              {section.questions.map((question, questionIndex) => (
                <>
                  <Typography
                    key={"typography-2-" + String(questionIndex)}
                    variant="subtitle1"
                  >
                    <b>Question </b>
                    {question.title}{" "}
                  </Typography>
                  <Typography
                    varient="subtitle2"
                    key={"typography-3-" + String(questionIndex)}
                  >
                    <b>Maximum Marks </b>
                    {question.maximum_marks}{" "}
                  </Typography>
                  <TextField
                    id={"input-marks-" + String(question.id)}
                    label={
                      question.obtained_marks || question.obtained_marks === 0
                        ? "Obtained Marks [EVALUATED BEFORE]"
                        : "Obtained Marks"
                    }
                    color={question.obtained_marks || question.obtained_marks === 0 ? "error" : "primary"}
                    variant="filled"
                    key={questionIndex}
                    className={inputTestModal}
                    defaultValue={
                      question.obtained_marks
                        ? String(question.obtained_marks)
                        : question.obtained_marks === 0 ? "0" : ""
                    }
                    type="number"
                  />
                  <TextField
                    id={"input-remarks-" + String(question.id)}
                    label={"Remarks"}
                    color={question.obtained_marks ? "error" : "primary"}
                    variant="filled"
                    key={"text-field-2-" + String(questionIndex)}
                    className={inputTestModal}
                    defaultValue={question.remarks ? question.remarks : ""}
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
                      <>
                        <img
                          className={assigneeImage}
                          src={member.image}
                          key={"assignee-image-" + String(index)}
                          onMouseEnter={handlePopoverOpen}
                          onMouseLeave={handlePopoverClose}
                        />
                        <Popover
                          id="mouse-over-popover"
                          sx={{
                            pointerEvents: "none",
                          }}
                          open={openPopover}
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          key={"popover-1-" + String(questionIndex)}
                          onClose={handlePopoverClose}
                          disableRestoreFocus
                        >
                          <Typography
                            sx={{ p: 1 }}
                            key={"typography-8-" + String(questionIndex)}
                          >
                            {member.name}
                          </Typography>
                        </Popover>
                      </>
                    ))
                  ) : (
                    <>No member assigned</>
                  )}
                  <hr />
                </>
              ))}
            </div>
          ))}
        <div className={createRoundBtnContainer}>
          <Button variant="contained" onClick={() => handleSaveBtnClick()}>
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Enrolment Number</TableCell>
              <TableCell align="center">Mobile</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants ? (
              applicants.slice((currentPage-1)*numOfApplicantsPerPage, getEndOfList()).map((applicant) => (
                <TableRow
                  key={applicant.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  role="checkbox"
                  tabIndex={-1}
                  aria-checked={true}
                  selected={true}
                  onClick={() => handleTableRowClick(applicant.id)}
                >
                  <TableCell component="th" scope="row" align="center">
                    {applicant.id}
                  </TableCell>
                  <TableCell align="center">{applicant.name}</TableCell>
                  <TableCell align="center">
                    {applicant.enrolment_number}
                  </TableCell>
                  <TableCell align="center">{applicant.mobile}</TableCell>
                  <TableCell align="center">{applicant.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {testScoreModal}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className={footer}>
        <Link to={`/season/${props.seasonId}/test/${props.testId}/questions/`}>
        <Button variant="contained">View Questions and Assignees</Button>
        </Link>
        <div className={paginatorConatiner}>
        <Paginator />
        </div>
      </div>
    </>
  );
}
