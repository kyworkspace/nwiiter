import { dbService, storageService } from 'fBase';
import React, { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
function NweetFactory({ userObj }) {

    const [nweet, setNweet] = useState("");
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

    const onSubmit = async (e) => {
        if (nweet === "") {
            return;
        }
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
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    }
    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearPhotoClick}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    )
}

export default NweetFactory;