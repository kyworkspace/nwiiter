import Nweet from 'components/Nweet';
import { dbService, storageService } from 'fBase';
import React, { useEffect, useRef, useState } from 'react'
import {v4 as uuid} from 'uuid';
function Home({ userObj }) {

  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  const fileInputRef = useRef();
  // const getNweets = async () => {
  //   const dbNweets = await dbService.collection("nweets").get();
  //   dbNweets.forEach((document) => {
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setNweets((prev) => [nweetObject, ...prev]);
  //   });
  // };
  useEffect(() => {
    //스냅샷은 realtime 서버가 변화가 있을때 불러옴
    dbService.collection("nweets").onSnapshot(snapShot => {
      const nweetArray = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setNweets(nweetArray)
    })
  }, []);


  const onSubmit = async (e) => {
    e.preventDefault();

    //첨부사진이 없을때도 기본값은 String 형태의 empty 값이어야 한다. not null
    let attachmentURL = "";
    // 1. 사진이 있으면 먼저업로드 하고
    if (attachment !== "") {
      // (1) 사용자 이름으로 폴더 / 파일명(난수)
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuid()}`)
      // URL은 String 이기 떄문에 putString  사용 (파일 String, 데이타타입)
      const response = await fileRef.putString(attachment, "data_url")
      //업로드한 이미지 주소 반환
      attachmentURL = await response.ref.getDownloadURL();
    }

    // 2. 트윗 업로드
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      createrId: userObj.uid,
      attachmentURL 
    };
    await dbService.collection("nweets").add(nweetObj);
    onClearPhotoClick();
    setNweet("");
  }
  const onChange = (e) => {
    const { target: { value } } = e;
    setNweet(value);
  }

  const onFileChange = (e) => {
    const { target: { files } } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    //업로드 확인후 나오는 모습
    reader.onloadend = (finishedEvent) => {
      setAttachment(finishedEvent.target.result);
    }
  }
  //파일인풋 초기화
  const onClearPhotoClick = () => {
    setAttachment("");
    if(fileInputRef.current){
      fileInputRef.current.value=null;
    }
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
        <input type={"file"} accept={"image/*"} onChange={onFileChange} />
        <input type={'submit'} value="Nweet" />
        {attachment &&
          <div>
            <img src={attachment} ref={fileInputRef} width="50px" height={"50px"} />
            <button onClick={onClearPhotoClick}>사진 삭제</button>
          </div>}
      </form>
      <div>
        {nweets.map(n => (
          <Nweet key={n.id} nweetObj={n} isOwner={n.createrId === userObj.uid} />
        ))}
      </div>
    </div>
  )
}

export default Home