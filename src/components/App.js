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
        //authService.currentUser object는 덩치가 크기 때문에 원활한 리랜더링을 위해서 렌더링 타겟을 설정해줘야함
        setUserObj({
          displayName : user.displayName,
          uid : user.uid,
          updateProfile : (args)=>{
            user.updateProfile(args)
          }
        });
      }
      setInit(true);
    })
  }, [])

  const refreshUser=()=>{
    
    const user = authService.currentUser
    setUserObj({
      displayName : user.displayName,
      uid : user.uid,
      updateProfile : (args)=>{
        user.updateProfile(args)
      }
    });
  }

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={userObj} userObj={userObj} setUserObj={setUserObj} /> : 'initializing'}
    </>

  );
}

export default App;
