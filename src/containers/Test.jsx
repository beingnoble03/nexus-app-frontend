import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { makeStyles } from "@mui/styles";
import TestTable from "../components/TestTable";

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
  const { testContainer } = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const testTabs = [
    props.tests.map((test, index) => (
      <Tab label={test.title} value={String(index + 1)} key={index} />
    )),
  ];

  const testPanels = [
    props.tests.map((test, index) => (
      <TabPanel value={String(index + 1)} key={index}>
        <TestTable testId = {test.id} key={index} />
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
