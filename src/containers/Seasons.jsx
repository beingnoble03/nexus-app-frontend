import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { titleChanged } from "../app/features/appBarSlice";
import { roundsVisibilityChanged } from "../app/features/drawerSlice";
import axios from "axios";
import SeasonItem from "../components/SeasonItem";
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import BlueBanner from "../components/BlueBanner";
import searchParamsChanged from "../app/features/searchSlice";
import { Box } from "@mui/system";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: `10px`,
  
};

const useStyles = makeStyles({
  contentContainer: {
    width: `100%`,
    display: `flex`,
    flexWrap: `wrap`,
    gap: `20px`,
    padding: `20px`,
    height: `fit-content`,
    maxHeight: `100%`,
    overflow: `scroll`,
  },
  card: {
    width: `350px`,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
    padding: `10px`,
    "&::before": {
      content: "",
      background: "linear-gradient(90deg, purple, green, hotpink)",
      position: "absolute",
      height: `50%`,
      width: `50%`,
      zIndex: `-1`,
      filter: `blur(20px)`,
    },
    cursor: `pointer`,
  },
  inputRoundName: {
    width: `100%`,
    marginTop: `10px !important`,
  },
  inputRoundType: {
    width: `100%`,
    marginTop: `10px !important`,
  },
  createRoundBtnContainer: {
    display: `flex`,
    justifyContent: `flex-end`,
    marginTop: `15px`,
  },
});

export default function Seasons() {
  const [seasons, setSeasons] = useState("Loading");
  const searchParams = useSelector((state) => state.search.searchParams);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(titleChanged("Seasons"));
    dispatch(roundsVisibilityChanged(false));
    axios({
      method: "get",
      url: `http://localhost:8000/api/seasons?search=${searchParams}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      setSeasons(response.data);
    });
  }, [searchParams]);

  const classes = useStyles();
  const {
    contentContainer,
    card,
    inputRoundName,
    inputRoundType,
    createRoundBtnContainer,
  } = classes;
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState("dev");

  const roleTypes = [
    {
      label: "Developer",
      value: "dev",
    },
    {
      label: "Designer",
      value: "des",
    },
  ];

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  const handleCreateSeason = () => {
    const seasonName = document.getElementById("input-season-name").value;
    const seasonDesc = document.getElementById("input-season-desc").value;
    const seasonYear = document.getElementById("input-season-year").value;
    axios({
      method: "post",
      url: `http://localhost:8000/api/seasons/`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
      data: {
        name: seasonName,
        description: seasonDesc,
        year: seasonYear,
        role: option,
      }
    }).then((response) => {
      setSeasons(prevState => [...prevState, response.data]);
      setOpen(false);
      toast.success("New Season Created", {
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
  }

  const addSeasonModal = (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Adding Season
        </Typography>
        <TextField
          id="input-season-name"
          label="Season Name"
          variant="filled"
          className={inputRoundName}
        />
        <TextField
          id="input-season-year"
          label="Season Year"
          variant="filled"
          className={inputRoundName}
          type="number"
        />
        <TextField
          id="input-season-desc"
          label="Season Description"
          variant="filled"
          className={inputRoundName}
        />
        <TextField
          id="input-role"
          select
          label="Select Season Role"
          value={option}
          onChange={handleChange}
          helperText="Please select the season role."
          variant="filled"
          className={inputRoundType}
        >
          {roleTypes.map((roleType) => (
            <MenuItem key={roleType.value} value={roleType.value}>
              {roleType.label}
            </MenuItem>
          ))}
        </TextField>
        <div className={createRoundBtnContainer}>
          <Button variant="contained" onClick={handleCreateSeason}>
            Create
          </Button>
        </div>
      </Box>
    </Modal>
  );

  return (
    <div className={contentContainer}>
      <Card className={card} onClick={() => setOpen(true)}>
        <CardContent>
          <h5>Add Season</h5>
          <p>Create seasons and add test and interview rounds.</p>
        </CardContent>
      </Card>
      {addSeasonModal}
      {seasons !== "Loading" ? (
        seasons.map((season) => (
          <SeasonItem
            key={season.id}
            id={season.id}
            name={season.name}
            role={season.role}
            year={season.year}
            description={season.description}
          />
        ))
      ) : (
        <div
          style={{
            width: `100%`,
          }}
        >
          <BlueBanner message="No seasons available." />
        </div>
      )}
    </div>
  );
}
