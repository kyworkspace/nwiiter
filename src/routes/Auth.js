import { authService, firebaseInstance } from 'fBase';
import React, { useState } from 'react'

const Auth=()=> {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccout, setNewAccout] = useState(true);
  const [error, setError] = useState("");

  const onChange=(e)=>{
    const {target:{name,value}} = e;
    if(name === "email"){
      setEmail(value);
    }else if(name === "password"){
      setPassword(value);
    }
  }

  const onSubmit=async (e)=>{
    e.preventDefault();
    try {
      let data = null;
      if(newAccout){
        //create account
        data = await authService.createUserWithEmailAndPassword(email,password);
      }else{
        //log in 
        data = await authService.signInWithEmailAndPassword(email,password);
      }  
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
    
  }

  const toggleAccount=()=>setNewAccout(prev=>!prev);

  const onSocialClick= async (e)=>{
    const {target:{name}} = e;
    let provider;
    if(name === "google"){
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }else if(name === "github"){
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    const data = await authService.signInWithPopup(provider);
    console.log(data);
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name='email' type={"email"} placeholder="Email" required value={email} onChange={onChange}/>
        <input name='password' type={"password"} placeholder="password" required value={password} onChange={onChange}/>
        <input type="submit" value={newAccout?"계정 생성" : "로그인"}/>
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccout ? "로그인" :"계정 생성"} </span>
      <div>
        <button onClick={onSocialClick} name='google'>구글로 접속하기</button>
        <button onClick={onSocialClick} name='github'>깃헙으로 접속하기</button>
      </div>
    </div>
  )
}

export default Auth