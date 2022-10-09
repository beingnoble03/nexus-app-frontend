import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { titleChanged } from '../app/features/appBarSlice'
import { roundsVisibilityChanged } from '../app/features/drawerSlice'
import axios from 'axios'
import SeasonItem from '../components/SeasonItem'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  contentContainer: {
    width: `100%`,
    height: `100%`,
    display: `flex`,
    flexWrap: `wrap`,
  },
})
export default function Seasons() {
  const [seasons, setSeasons] = useState("Loading")
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(titleChanged("Seasons"))
    dispatch(roundsVisibilityChanged(false))
    axios({
      method: "get",
      url: "http://localhost:8000/api/seasons",
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    }).then((response) => {
      setSeasons(response.data)
    })
  }, [])
  useEffect(() => {
    console.log(seasons)
  }, [seasons])

  const classes = useStyles()
  const { contentContainer } = classes

  return (
    <div className={contentContainer}>
    { seasons !== "Loading" ?
      seasons.map(season => (
        <SeasonItem
        key={season.id}
        id={season.id}
        name={season.name}
        role={season.role}
        year={season.year}
        description={season.description}
        />
      )) : (
        <Typography>Wait</Typography>
      )
    }
    </div>
  )
}
