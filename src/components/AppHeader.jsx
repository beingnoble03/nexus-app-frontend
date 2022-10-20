import { AppBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { toggled } from "../app/features/drawerSlice";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchParamsChanged } from "../app/features/searchSlice";
import Search from "@mui/icons-material/Search"
import { InputAdornment } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  appBarContainer: {
  }
}));


export default function AppHeader() {
  const classes = useStyles();
  const { typography } = classes;
  const dispatch = useDispatch()
  const title = useSelector(state => state.appBar.title)
  let isAuthenticated = (localStorage.getItem("token") !== null)
  const search = useSelector(state => state.search.searchParams)

  const handleSearchInputChange = (event) => {
    dispatch(searchParamsChanged(event.target.value))
    console.log(event.target.value)
  }

  return (
    <AppBar
      position="relative"
      color="transparent"
      sx={{
        width: { sm: `100%` },
      }}
    >
      <Toolbar style={{
        justifyContent: `space-between`,
      }}>
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
            marginLeft: { xs: `calc(50% - 40px)` },
            transform: `translateX(-50%)`,
          }}
        >
          <b>{ title }</b>
        </Typography>
        <TextField
          id="standard-search"
          type="search"
          variant="outlined"
          size="small"
          placeholder="Search"
          sx={{
            right: `0px`,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={search}
          onChange={handleSearchInputChange}
        />
      </Toolbar>
    </AppBar>
  );
}
