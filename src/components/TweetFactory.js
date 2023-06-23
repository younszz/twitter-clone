import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";

const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    if (tweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
      console.log(attachmentUrl)
    }
    const tweetObj = {
      text: tweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    }
    await addDoc(collection(dbService, "tweets"), tweetObj);
    setTweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const { target: { value } } = event;
    setTweet(value);
  };
  const onFileChange = (event) => {
    const { target: { files } } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const { currentTarget: { result } } = finishedEvent;
      setAttachment(result);
    }
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="무슨 일이 일어나고 있나요?"
          maxLength={140}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        <label for="attach-file" className="factoryInput__label">
          <FontAwesomeIcon icon={faImage} />
        </label>
      </div>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0 }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img src={attachment} alt="" style={{ backgroundImage: attachment }} />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  )
}
export default TweetFactory;