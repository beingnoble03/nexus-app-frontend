import React from "react";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@mui/material";

const useStyles = makeStyles({
  seasonContainer: {
    width: `200px`,
    height: `300px`,
    border: `1px solid black`,
    padding: `10px`,
    margin: `15px 10px`,
  },
  card: {
    width: `350px`,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
    padding: `10px`,
  },
});

export default function SeasonItem(props) {
  const classes = useStyles();
  const { seasonContainer, card } = classes;
  const seasonLink = `/season/${props.id}/`;

  return (
    <Link to={seasonLink} style={{ textDecoration: `none`, height: `fit-content` }}>
      <Card className={card}>
        <CardContent>
          <h5>{props.name}</h5>
          <p>{props.description}</p>
          <h6>
            Role: {props.role} for {props.year} #{props.id}
          </h6>
        </CardContent>
      </Card>
    </Link>
  );
}
