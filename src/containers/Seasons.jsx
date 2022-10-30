import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { titleChanged } from '../app/features/appBarSlice'
import { roundsVisibilityChanged } from '../app/features/drawerSlice'
import axios from 'axios'
import SeasonItem from '../components/SeasonItem'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import BlueBanner from '../components/BlueBanner'
import searchParamsChanged from '../app/features/searchSlice'

const useStyles = makeStyles({
  contentContainer: {
    width: `100%`,
    display: `flex`,
    flexWrap: `wrap`,
    gap: `20px`,
    padding: `20px`,
    height: `fit-content`,
  },
})
export default function Seasons() {
  const [seasons, setSeasons] = useState("Loading")
  const searchParams = useSelector((state) => state.search.searchParams)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(titleChanged("Seasons"))
    dispatch(roundsVisibilityChanged(false))
    axios({
      method: "get",
      url: `http://localhost:8000/api/seasons?search=${searchParams}`,
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    }).then((response) => {
      setSeasons(response.data)
    })
  }, [searchParams, ])

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
        <div style={{
          width: `100%`,
        }}>
        <BlueBanner message="No seasons available." />
        </div>
      )
    }
    </div>
  )
}
