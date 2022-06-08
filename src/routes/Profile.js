import { authService } from 'fBase'
import React from 'react'
import { useHistory } from 'react-router-dom';

function Profile() {
  const history = useHistory();
  const onLogoutClick = ()=>{
    authService.signOut();
    history.push("/");
  }
  return (
    <>
    <button onClick={onLogoutClick}>로그아웃</button>
    </>
    
  )
}

export default Profile