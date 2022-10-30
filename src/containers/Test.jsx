import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { makeStyles, styled } from "@mui/styles";
import TestTable from "../components/TestTable";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { titleChanged } from "../app/features/appBarSlice";
import { Button, Modal, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  fetchRounds,
  roundsVisibilityChanged,
  selectedSeasonIdChanged,
} from "../app/features/drawerSlice";
import BlueBanner from "../components/BlueBanner";

const styleTabPanel = {
  display: `flex`,
  flexDirection: `column`,
  flexGrow: 1,
};

const useStyles = makeStyles({
  mainContainer: {
    display: `flex`,
    width: `100%`,
    flexDirection: `column`,
    height: `100%`,
  },
  testContainer: {
    paddingLeft: `10px`,
    paddingRight: `10px`,
    paddingTop: `10px`,
    width: `100%`,
    flexGrow: 1,
    display: `flex`,
    flexDirection: `column`,
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: 400 },
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: `10px`,
  maxHeight: `90%`,
  overflow: `scroll`,
};

const buttonContainerStyle = {
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `flex-end`,
  gap: `20px`,
  marginTop: `30px`,
};

export default function Test(props) {
  const [value, setValue] = useState("1");
  const [testTitles, setTestTitles] = useState([]);
  const { testContainer, mainContainer } = useStyles();
  const { id, roundId } = useParams();
  const dispatch = useDispatch();
  const initialSelectedSeasonId = useSelector(
    (state) => state.drawer.selectedSeasonId
  );

  useEffect(() => {
    if (initialSelectedSeasonId !== id) {
      dispatch(selectedSeasonIdChanged(id));
      dispatch(fetchRounds());
    }
    dispatch(roundsVisibilityChanged(true));
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
      setTestTitles(response.data.test_titles);
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
      <TabPanel value={String(index + 1)} key={test.id} sx={styleTabPanel}>
        <TestTable
          roundId={roundId}
          testId={test.id}
          key={test.id}
          seasonId={id}
        />
      </TabPanel>
    )),
  ];

  const [open, setOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const handleOpenCreateTestModal = () => {
    setOpen(true);
  };
  const handleAbortButton = () => {
    setOpen(false);
  };

  const handleCreateButton = () => {
    axios({
      method: "post",
      url: `http://localhost:8000/api/testApplicants/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
        title: testName,
        round: roundId,
      },
    }).then((response) => {
      testTitles.push(response.data);
      setTestName("");
      setOpen(false);
    });
  };

  const handleTestNameChange = (event) => {
    setTestName(event.target.value);
  };

  const createTestModal = (
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
          Creating a Test
        </Typography>
        <Box sx={{ marginTop: `20px` }}>
          <TextField
            variant="outlined"
            value={testName}
            onChange={handleTestNameChange}
            label="Test Name"
            sx={{
              width: `100%`,
            }}
            size="small"
          />
        </Box>
        <Box sx={buttonContainerStyle}>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleCreateButton}
          >
            Create
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleAbortButton}
          >
            Abort
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <div className={mainContainer}>
      <div className={testContainer}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: `flex`,
              flexDirection: `row`,
            }}
          >
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {testTabs}
            </TabList>
            <Button
              variant="text"
              size="small"
              onClick={handleOpenCreateTestModal}
            >
              Add Test
            </Button>
          </Box>
          {testPanels}
        </TabContext>
        { !testTitles.length && 
        <BlueBanner message="No Tests available for the selected round. Press Add Test button to add." />
        }
        {createTestModal}
      </div>
    </div>
  );
}
