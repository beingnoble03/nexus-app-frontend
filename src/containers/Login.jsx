import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { titleChanged } from "../app/features/appBarSlice";
import { roundsVisibilityChanged } from "../app/features/drawerSlice";

const useStyles = makeStyles({
  buttonContainer: {
    width: `50%`,
    height: `50%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    boxShadow: `0 2px 8px 0 rgb(0 0 0 / 10%), 0 2px 8px 0 rgb(0 0 0 / 10%), 0 2px 8px 0 rgb(0 0 0 / 10%)`,
    borderRadius: `10px`,
    minWidth: `250px`,
  },
  loginContainer: {
    height: `100%`,
    width: `100%`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
  },
});

const toRedirectToChanneliForOauth = () => {
  window.location.replace(
    "https://channeli.in/oauth/authorise/?client_id=i8VvoKOswXhwAUA4KrjbpBsj87CrFgreBLhN1IgE&state=noble_mittal'sapp?redirect_uri=http://localhost:8000/api/members/onLogin"
  );
};

export default function Login() {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(titleChanged("Login"));
    dispatch(roundsVisibilityChanged(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/seasons/");
    }
  }, [isAuthenticated]);
  if (isAuthenticated) {
    console.log(isAuthenticated);
  }
  const classes = useStyles();
  const { buttonContainer, button, loginContainer } = classes;

  return (
    <>
      <div className={loginContainer}>
        <div className={buttonContainer}>
          <Button
            className={button}
            variant="outlined"
            color="primary"
            onClick={() => {
              toRedirectToChanneliForOauth();
            }}
          >
            Login using Omniport
          </Button>
        </div>
      </div>
    </>
  );
}
