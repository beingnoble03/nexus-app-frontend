import { AppBar, Menu, MenuItem } from "@mui/material";
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
import Search from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { Logout } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  appBarContainer: {},
}));

export default function AppHeader() {
  const navigate = useNavigate();
  let isAuthenticated = localStorage.getItem("token") !== null;
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, []);

  const classes = useStyles();
  const { typography } = classes;
  const dispatch = useDispatch();
  const title = useSelector((state) => state.appBar.title);
  const search = useSelector((state) => state.search.searchParams);

  const handleSearchInputChange = (event) => {
    dispatch(searchParamsChanged(event.target.value));
    console.log(event.target.value);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="relative"
      color="transparent"
      sx={{
        width: { sm: `100%` },
      }}
    >
      <Toolbar
        style={{
          justifyContent: `space-between`,
          alignItems: `center`,
        }}
      >
        <div
          style={{
            display: `flex`,
            gap: `0px`,
            flexDirection: `row`,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: `5px`, display: { sm: "none" } }}
            onClick={() => dispatch(toggled())}
          >
            <MenuIcon />
          </IconButton>
          {isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleClick}
            >
              <Logout />
            </IconButton>
          )}
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleLogout}>Confirm Logout</MenuItem>
        </Menu>
        <Typography
          className={typography}
          variant="h6"
          noWrap
          component="div"
          color="primary"
          sx={{
            marginLeft: `10px`,
            marginRight: `10px`,
            background: `linear-gradient(to right, rgba(218,111,158,1) 0%, rgba(25,118,210,1) 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: `transparent`,
          }}
        >
          <b>{title}</b>
        </Typography>
        {isAuthenticated ? (
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
        ) : (
          <div></div>
        )}
      </Toolbar>
    </AppBar>
  );
}
