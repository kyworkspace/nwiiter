import Nweet from 'components/Nweet';
import NweetFactory from 'components/NweetFactory';
import { dbService, storageService } from 'fBase';
import React, { useEffect, useRef, useState } from 'react'

function Home({ userObj }) {


  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    //스냅샷은 realtime 서버가 변화가 있을때 불러옴
    dbService.collection("nweets").onSnapshot(snapShot => {
      const nweetArray = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setNweets(nweetArray)
    })
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
      <div className="container">
        <NweetFactory userObj={userObj} />
        <div style={{ marginTop: 30 }}>
          {nweets.reverse().map(n => (
            <Nweet key={n.id} nweetObj={n} isOwner={n.createrId === userObj.uid} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home