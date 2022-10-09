import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { titleChanged } from "../app/features/appBarSlice";
import {
  roundsChanged,
  roundsVisibilityChanged,
  selectedSeasonIdChanged,
} from "../app/features/drawerSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import Test from './Test'
import Interview from './Interview'
import { Typography } from "@mui/material";
import { selectedRoundChanged } from "../app/features/seasonSlice";

export default function Season(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8000/api/roundDetails/",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    }).then((response) => {
      const filtered_data = response.data.filter((round) => round.season == id);
      dispatch(selectedSeasonIdChanged(id));
      dispatch(roundsChanged(filtered_data));
      dispatch(roundsVisibilityChanged(true));
    });
return () => {
    dispatch(selectedRoundChanged(null))
}  
}, []);

useEffect(() => {
  axios({
    method: "get",
    url: `http://localhost:8000/api/seasons/${id}`,
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
  }).then((response) => {
    dispatch(titleChanged(response.data.name));
  });
})
  
  const selectedRound = useSelector(state => state.season.selectedRound)

  return (
      <>
      { selectedRound ? (
          <>
          { selectedRound.round_type === "T" ? (
              <Test 
              tests={selectedRound.test_titles}
              />
          ) : (
              <Interview />
          )
        }
          </>
      ) : (
          <Typography>
              Select a round to view details
          </Typography>
      )}
      </>
  );
}
