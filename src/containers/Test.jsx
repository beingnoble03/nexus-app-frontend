import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { makeStyles } from "@mui/styles";
import TestTable from "../components/TestTable";
import axios from "axios";
import { useDispatch } from "react-redux";
import { titleChanged } from "../app/features/appBarSlice";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";

const useStyles = makeStyles({
  testContainer: {
    paddingLeft: `10px`,
    paddingRight: `10px`,
    paddingTop: `10px`,
    width: `100%`,
  },
});

export default function Test(props) {
  const [value, setValue] = useState("1");
  const [testTitles, setTestTitles] = useState([])
  const { testContainer } = useStyles();
  const { id, roundId } = useParams();
  const dispatch = useDispatch()

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/roundDetails/${roundId}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      dispatch(titleChanged(response.data.round_name));
      setTestTitles(response.data.test_titles)
    });
  }, [roundId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const testTabs = [
    testTitles.map((test, index) => (
      <Tab label={test.title} value={String(index + 1)} key={test.id} />
    )),
  ];

  const testPanels = [
    testTitles.map((test, index) => (
      <TabPanel value={String(index + 1)} key={test.id}>
        <TestTable testId = {test.id} key={test.id} seasonId={id} />
      </TabPanel>
    )),
  ];

  return (
      <div className={testContainer}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {testTabs}
            </TabList>
          </Box>
          {testPanels}
        </TabContext>
      </div>
  );
}
