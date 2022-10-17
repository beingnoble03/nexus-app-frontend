import { useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import InterviewTable from "../components/InterviewTable";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  roundsVisibilityChanged,
  fetchRounds,
  selectedSeasonIdChanged,
} from "../app/features/drawerSlice";
import { titleChanged } from "../app/features/appBarSlice";
import axios from "axios";
import Paginator from "../components/Paginator";

const useStyles = makeStyles({
  mainContainer: {
    display: `flex`,
    width: `100%`,
    flexDirection: `column`,
  },
  interviewTableContainer: {
    width: `100%`,
    flexGrow: 1,
    padding: `15px`,
  },
  footer: {
    display: `flex`,
    padding: `10px`,
    paddingBottom: `20px`,
    flexDirection: `row`,
    height: `auto`,
    paddingLeft: `20px`,
  },
  paginatorConatiner: {
    display: `flex`,
    justifyContent: `flex-end`,
    alignContent: `flex-end`,
    flexGrow: 1,
    paddingRight: `40px`,
  },
});

export default function Interview() {
  const { mainContainer, footer, interviewTableContainer, paginatorConatiner } =
    useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, roundId } = useParams();

  useEffect(() => {
    dispatch(roundsVisibilityChanged(true));
    dispatch(selectedSeasonIdChanged(id));
    dispatch(fetchRounds());
    console.log("hello");
  }, [id]);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/roundDetails/${roundId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      dispatch(titleChanged(response.data.round_name));
    });
  }, []);
  return (
    <div className={mainContainer}>
      <div className={interviewTableContainer}>
        <InterviewTable />
      </div>
      <div className={footer}>
        <Button variant="contained" onClick={() => navigate("/panels/")}>
          View Panels
        </Button>
        <div className={paginatorConatiner}>
          <Paginator />
        </div>
      </div>
    </div>
  );
}
