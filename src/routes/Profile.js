import { authService, dbService } from 'fBase'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

function Profile({ userObj, refreshUser, setUserObj }) {
  const history = useHistory();
  const [newDisplayName, setnewDisplayName] = useState(userObj.displayName)
  const onLogoutClick = () => {
    authService.signOut();
    history.push("/");
    setUserObj(null);
  }

  const getMyNweets = async () => {
    //쿼리 필터링
    const nweets = await dbService
      .collection("nweets")
      .where("createrId", "==", `${userObj.uid}`)
      .orderBy("createdAt") //설정하게 되면 firebase는 nosql 기준이기 때문에 색인을 설정하라는 오류가 뜨게됨, 오탈자 안나도록 조심
      .get()

    console.log(nweets.docs.map(doc => doc.data()));
  }

  useEffect(() => {
    getMyNweets();
  }, [])


  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName
      })
      refreshUser();
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input
            autoFocus
            type={'text'}
            className="formInput"
            placeholder="Display name"
            value={newDisplayName}
            onChange={e => setnewDisplayName(e.currentTarget.value)} />
          <input type={'submit'} value={"update Profile"} className="formBtn" style={{
            marginTop: 10,
          }} />
        </form>
        <button
          className="formBtn cancelBtn logOut"
          onClick={onLogoutClick}>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default Profile