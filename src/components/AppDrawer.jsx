import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";
import { toggled } from "../app/features/drawerSlice";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { selectedRoundChanged } from "../app/features/seasonSlice";
import { Button } from '@mui/material'
import { Modal } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "absolute",
  },
  addRoundBtnContainer: {
    position: `absolute`,
    bottom: `10px`,
    width: `100%`,
    display: `flex`,
    justifyContent: `center`,
  },
}));

const drawerWidth = 200;

function AppDrawer(props) {
  const { window } = props;
  const dispatch = useDispatch();
  const isDrawerVisible = useSelector((state) => state.drawer.drawerVisible);
  const [open, setOpen] = React.useState(false)

  const classes = useStyles();
  const { appBar, addRoundBtnContainer } = classes;

  const isRoundsListVisible = useSelector(
    (state) => state.drawer.roundsVisible
  );

  const rounds = useSelector((state) => state.drawer.rounds);

  const roundsList = (
    <List>
      {rounds.length ? (
        <>
          {rounds.map((round) => (
            <ListItem key={round.id} disablePadding>
              <ListItemButton onClick={() => dispatch(selectedRoundChanged(round))}>
                <ListItemText primary={round.round_name} />
              </ListItemButton>
            </ListItem>)
          )}
        </>
      ) : (
        <Typography align="center">Nothing here.</Typography>
      )}
    </List>
  );

  const addRoundBtn = (
    <div className={addRoundBtnContainer}>
      <Button variant="contained" onClick={() => setOpen(true)}>+ Add Round</Button>
    </div>
  )

  const drawer = (
    <div>
      <Box
        sx={{
          p: 2,
          height: `65px`,
          width: `100%`,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">NEXUS</Typography>
      </Box>
      <Divider />
      { isRoundsListVisible ? roundsList : <></>}
      { isRoundsListVisible ? addRoundBtn : <></>}
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <CssBaseline />
      <Drawer
        container={container}
        variant="temporary"
        open={isDrawerVisible}
        onClose={() => dispatch(toggled())}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          whiteSpace: "nowrap",
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            position: "relative",
            height: `100vh`,
          },
        }}
        anchor="left"
      >
        {drawer}
      </Drawer>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default AppDrawer;
