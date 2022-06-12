import AuthForm from 'components/AuthForm';
import { authService, firebaseInstance } from 'fBase';
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth=()=> {
  const onSocialClick= async (e)=>{
    const {target:{name}} = e;
    let provider;
    if(name === "google"){
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }else if(name === "github"){
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    await authService.signInWithPopup(provider);
  }

  return (
    <div className="authContainer">
    <FontAwesomeIcon
      icon={faTwitter}
      color={"#04AAFF"}
      size="3x"
      style={{ marginBottom: 30 }}
    />
      <AuthForm/>
      <div className="authBtns">
        <button onClick={onSocialClick} name='google'  className="authBtn" >구글로 접속하기  <FontAwesomeIcon icon={faGoogle} /></button>
        <button onClick={onSocialClick} name='github'  className="authBtn" >깃헙으로 접속하기 <FontAwesomeIcon icon={faGithub} /></button>
      </div>
    </div>
  )
}

export default Auth