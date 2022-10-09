import React from "react";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  seasonContainer: {
    width: `200px`,
    height: `300px`,
    border: `1px solid black`,
    padding: `10px`,
    margin: `15px 10px`,
  },
  contentContainer: {
    width: `100%`,
    height: `100%`,
    display: `flex`,
    flexWrap: `wrap`,
  },
});

export default function SeasonItem(props) {
  const classes = useStyles();
  const { seasonContainer, contentContainer } = classes;
  const seasonLink = `/season/${props.id}/`;

  return (
    <div>
      <Link to={seasonLink} style={{textDecoration: `none`}}>
        <div className={seasonContainer}>
          <h5>{props.name}</h5>
          <p>{props.description}</p>
          <h6>
            Role: {props.role} for {props.year} #{props.id}
          </h6>
        </div>
      </Link>
    </div>
  );
}
