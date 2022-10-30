import { Box, Typography } from "@mui/material";

const style = {
  width: `100%`,
  marginTop: `100px`,
  background: `radial-gradient(circle, rgba(218,111,158,1) 0%, rgba(25,118,210,0.7) 100%)`,
  // bgcolor: `#1976d2`,
  padding: `40px`,
  color: `white`,
  textAlign: `center`,
  fontSize: `28px`,
  opacity: `0.9`,
};

export default function BlueBanner(props) {
  const marginTop = props.margin ? props.margin : `100px`;
  return (
    <Box sx={{ ...style, marginTop }}>
      <Typography variant="button">
        <b>{props.message}</b>
      </Typography>
    </Box>
  );
}
