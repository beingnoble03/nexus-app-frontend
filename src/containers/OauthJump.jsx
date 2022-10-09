import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authenticated } from '../app/features/userSlice'


export default function OauthJump() {
    let isAuthenticated = (localStorage.getItem("token") !== null)
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/seasons/")
        }
    }, [isAuthenticated])
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    console.log(token)
    localStorage.setItem("token", token)
    isAuthenticated = true

  return (
      <>
      Loading...
      </>
  )
}
