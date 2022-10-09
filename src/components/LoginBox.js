import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { authenticateUser } from '../app/features/userSlice'

const toRedirectToChanneliForOauth = () => {
  window.location.replace("https://channeli.in/oauth/authorise/?client_id=i8VvoKOswXhwAUA4KrjbpBsj87CrFgreBLhN1IgE&state=noble_mittal'sapp")
}

const get_data = () => {
  if (localStorage.getItem("token")){
    axios({
      method: "get",
      url: "http://localhost:8000/api/current_user",
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    }).then((response) => {
      console.log(response.data)
    })
  } else {
    console.log("Nothing Here!")
  }
}

function LoginBox(props) {
  const urlParams = new URLSearchParams(window.location.search)
  const dispatch = useDispatch()

if (urlParams.get("code") && urlParams.get("state")){
  let data = {
    code: urlParams.get("code"),
    state: urlParams.get("state")
  }
  dispatch(authenticateUser(data))
}


  return (
    <>
    <h3>LoginBox</h3>
    <button
    className='btn btn-sm btn-outline-primary'
    onClick={() => {toRedirectToChanneliForOauth()}}>
      Login with Channeli
      </button>
      <button
    className='btn btn-sm btn-primary'
    onClick={() => {get_data()}}>
      Get Data
      </button>
    </>
  )
}

LoginBox.propTypes = {}

export default LoginBox
