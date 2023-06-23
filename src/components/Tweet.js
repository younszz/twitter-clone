import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("트윗을 삭제할까요?");
    if (ok) {

      // 해당하는 트윗 firestore에서 삭제
      await deleteDoc(doc(dbService, "tweets", `${tweetObj.id}`));

      // 삭제하려는 트윗에 이미지 파일이 있는 경우 storage에서 삭제
      if (tweetObj.attachmentUrl) {
        await deleteObject(ref(storageService, tweetObj.attachmentUrl));
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(tweetObj, newTweet)
    await updateDoc(doc(dbService, "tweets", `${tweetObj.id}`), {
      text: newTweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const { target: { value } } = event;
    setNewTweet(value);
  }
  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit yout tweet"
              value={newTweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Tweet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} alt="" />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;