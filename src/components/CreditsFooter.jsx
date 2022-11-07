import { Box, Typography } from "@mui/material"


const style = {
    width: `100%`,
    background: `radial-gradient(circle, rgba(218,111,158,1) 0%, rgba(25,118,210,1) 80%)`,
    padding: `5px`,
    color: `white`,
    textAlign: `center`,
    fontSize: `20px`,
    position: `sticky`,
    bottom: `0px`,
    height: `auto`,
}

export default function CreditsFooter() {
  return (
    <Box sx={style}>
        <Typography variant="subtitle1">
            {"Made with 🤍 by "} <a href="https://github.com/beingnoble03" style={{
                textDecoration: `none`,
                color: `white`,
            }}><b>Noble Mittal</b></a>
        </Typography>
    </Box>
  )
}
