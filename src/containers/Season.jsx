import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { titleChanged } from "../app/features/appBarSlice";
import {
  fetchRounds,
  roundsChanged,
  roundsVisibilityChanged,
  selectedSeasonIdChanged,
} from "../app/features/drawerSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import Test from "./Test";
import Interview from "./Interview";
import { Typography } from "@mui/material";
import { selectedRoundChanged } from "../app/features/seasonSlice";

export default function Season(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(roundsVisibilityChanged(true));
    dispatch(selectedSeasonIdChanged(id));
    dispatch(fetchRounds())
    return () => {
      dispatch(selectedRoundChanged(null));
    };
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
  });

  const selectedRound = useSelector((state) => state.season.selectedRound);

  return (
    <>
      {selectedRound ? (
        <>
          {selectedRound.round_type === "T" ? (
            <Test tests={selectedRound.test_titles} />
          ) : (
            <Interview />
          )}
        </>
      ) : (
        <Typography>Select a round to view details</Typography>
      )}
    </>
  );
}
