import { AppBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { toggled } from "../app/features/drawerSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  typography: {
    // color: "lightcoral",
  },
}));


export default function AppHeader() {
  const classes = useStyles();
  const { typography } = classes;
  const dispatch = useDispatch()
  const title = useSelector(state => state.appBar.title)
  let isAuthenticated = (localStorage.getItem("token") !== null)

  return (
    <AppBar
      position="relative"
      color="transparent"
      sx={{
        width: { sm: `100%` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { sm: "none" } }}
          onClick={() => dispatch(toggled())}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          className={typography}
          variant="h6"
          noWrap
          component="div"
          color="primary"
          sx={{
            marginLeft: { sm: `50%`, xs: `calc(50% - 40px)` },
            transform: `translateX(-50%)`,
          }}
        >
          <b>{ title }</b>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
