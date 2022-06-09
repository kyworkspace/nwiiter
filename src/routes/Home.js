import { dbService } from 'fBase';
import React, { useEffect, useState } from 'react'

function Home({userObj}) {

  const [nweet, setnweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const getNweets = async () => {
    const dbNweets = await dbService.collection("nweets").get();
    dbNweets.forEach((document) => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };
  useEffect(() => {
    //스냅샷은 realtime 서버가 변화가 있을때 불러옴
    dbService.collection("nweets").onSnapshot(snapShot=>{
      const nweetArray = snapShot.docs.map(doc=>({id : doc.id, ...doc.data()}))
      console.log(nweetArray)
      setNweets(nweetArray)
    })
  }, []);
  

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("nweets").add({
      text : nweet,
      createdAt : Date.now(),
      createrId : userObj.uid
    })
    setnweet("");
  }
  const onChange = (e) => {
    const {target : {value}} = e;
    setnweet(value);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type={'text'}
          placeholder="하고 싶은 말을 하세요"
          maxLength={120}
          value={nweet}
          onChange={onChange}
          name={"nweet"} />
        <input type={'submit'} value="Nweet" />
      </form>
      <div>
        {nweets.map(n=>(
          <div key={n.id}>
            <h4>{n.text}</h4>
            </div>
        ))}
      </div>
    </div>
  )
}

export default Home