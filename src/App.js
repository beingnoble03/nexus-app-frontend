import Login from "./containers/Login";
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import AppHeader from "./components/AppHeader";
import AppDrawer from "./components/AppDrawer";
import Home from "./containers/Home";
import OauthJump from "./containers/OauthJump";
import Seasons from "./containers/Seasons";
import Season from "./containers/Season";

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  mainContainer: {
    flexGrow: 1,
    height: `100vh`,
    overflow: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    display: `flex`,
    height: `100%`,
  },
});

function App() {
  const classes = useStyles();
  const { root, mainContainer, content } = classes;

  return (
    <>
      <div className={root}>
        <AppDrawer />
        <div className={mainContainer}>
          <AppHeader />
          <div className={content}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home/" element={<Home />} />
                <Route path="/oauthJump/" element={<OauthJump />} />
                <Route path="/seasons/" element={<Seasons />} />
                <Route exact path="/season/:id" element={<Season />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
