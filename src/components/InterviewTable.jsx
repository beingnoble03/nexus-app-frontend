import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { Modal, Box, Typography, TextField } from "@mui/material";
import { fetchPanels } from "../app/features/panelSlice";
import InterviewRow from "./InterviewRow";
import { useParams } from "react-router-dom";
import { currentPageChanged, numOfPagesChanged } from "../app/features/paginatorSlice";


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
  footer: {
    bottom: `0px`,
    display: `flex`,
    padding: `10px`,
    position: `fixed`,
    marginBottom: `10px`,
    width: `100%`,
  },
});

export default function InterviewTable(props) {
  const [interviews, setInterviews] = useState(null);
  const { id, roundId } = useParams();
  const panel = useSelector((state) => state.panel);
  const dispatch = useDispatch();
  const currentPage = useSelector(state => state.paginator.currentPage)
  const numOfApplicantsPerPage = 2;

  const {
    createRoundBtnContainer,
    inputTestModal,
    sectionContentContainer,
    applicantDetialsContainer,
    assigneeImage,
    assigneeTypography,
    footer,
  } = useStyles();

  const panelNames = panel.panels
    ? panel.panels.map((panel_) => {
        return {
          value: panel_.id,
          label:
            panel_.place > 20
              ? panel_.place.substr(0, 20) + "..."
              : panel_.place,
        };
      })
    : [];

  panelNames.push({
    value: "None",
    label: "None",
  });

  const interviewStatusChoices = [
      {
          value: "Completed",
          label: "Completed",
      },
      {
          value: "Pending",
          label: "Pending",
      }
  ]

  const getEndOfList = () => {
    if (currentPage*numOfApplicantsPerPage >= interviews.length) {
      return interviews.length
    }
    return currentPage*numOfApplicantsPerPage
  }


  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/roundInterviews/${roundId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setInterviews(response.data.interviews);
      dispatch(currentPageChanged(1))
      dispatch(numOfPagesChanged(Math.ceil(response.data.interviews.length / numOfApplicantsPerPage)));
    });
    dispatch(fetchPanels());
  }, []);




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
              <TableCell align="center">Panel Assigned</TableCell>
              <TableCell align="center">Time Assigned</TableCell>
              <TableCell align="center">Time Entered</TableCell>
              <TableCell align="center">Edit</TableCell>
              <TableCell align="center">Marks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interviews ? (
              interviews.slice((currentPage-1)*numOfApplicantsPerPage, getEndOfList()).map((interview) => (
                  <InterviewRow interview={interview} panelNames={panelNames} interviewStatusChoices={interviewStatusChoices} key={interview.id}/>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
