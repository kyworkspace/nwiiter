import { authService } from 'fBase';
import React, { useState } from 'react'

function AuthForm() {
    
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

 
    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input className="authInput" name='email' type={"email"} placeholder="Email" required value={email} onChange={onChange} />
                <input className="authInput" name='password' type={"password"} placeholder="password" required value={password} onChange={onChange} />
                <input className="authInput authSubmit" type="submit" value={newAccout ? "계정 생성" : "로그인"} />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">{newAccout ? "로그인" : "계정 생성"} </span>
        </>
    )
}

export default AuthForm