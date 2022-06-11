import { dbService, storageService } from 'fBase'
import React, { useState } from 'react'

function Nweet({ nweetObj, isOwner }) {

    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("정말 삭제하시겠습니까?")
        if (ok) {
            //삭제지점
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            //파일 삭제는 URL을 추적해서 삭제하도록 함
            await storageService.refFromURL(nweetObj.attachmentURL).delete();
        }
    }

    const toggleEditing = () => {
        setEditing(prev => !prev);
    }
    const onSubmit = async (e) => {
        e.preventDefault();

        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet
        })
        toggleEditing();
    }


    return (
        <div key={nweetObj.id}>
            {
                editing ?
                    <>
                        {isOwner &&
                            <><form onSubmit={onSubmit}>
                                <input value={newNweet} required onChange={e => setNewNweet(e.target.value)} placeholder={"edit nweet"} />
                                <input type={'submit'} value={'Update Nweet'} />
                            </form>
                                <button onClick={toggleEditing}>cancel</button></>}

                    </>
                    : <>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentURL && <img src={nweetObj.attachmentURL} width={"50px"} height={"50px"}/>}
                        {isOwner &&
                            <>
                                <button onClick={toggleEditing}>update</button>
                                <button onClick={onDeleteClick}>delete</button>
                            </>}
                    </>
            }


        </div>
    )
}

export default Nweet