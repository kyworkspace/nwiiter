import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";

function App() {

  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    //auth 상태가 바뀌는 거 체크
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    })
  }, [])



  return (
    <>
      {init ? <AppRouter isLoggedIn={userObj} userObj={userObj} /> : 'initializing'}
    </>

  );
}

export default App;
