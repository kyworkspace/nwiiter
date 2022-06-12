import { dbService, storageService } from 'fBase'
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="nweet">
            {
                editing ?
                    <>
                        {isOwner &&
                            <>
                                <form onSubmit={onSubmit} className="container nweetEdit">
                                    <input value={newNweet} required onChange={e => setNewNweet(e.target.value)} placeholder={"edit nweet"} />
                                    <input type={'submit'} value={'Update Nweet'} />
                                </form>
                                <button onClick={toggleEditing} className="formBtn cancelBtn">cancel</button>
                            </>
                        }

                    </>
                    : <>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentURL && <img src={nweetObj.attachmentURL} />}
                        {isOwner &&
                            <div className="nweet__actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
                        }
                    </>
            }


        </div>
    )
}

export default Nweet