import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";

function App() {

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    //auth 상태가 바뀌는 거 체크
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])



  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'initializing'}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>

  );
}

export default App;
