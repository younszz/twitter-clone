import { auth, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Profile = ({ refreshUser, userObj }) => { // 로그인한 유저 정보 prop으로 받기
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
  const onLogOutClick = () => {
    signOut(auth);
    navigate("/");
  };
  /*   const getMyNweets = async () => {
  
      // dbService의 collection 중 "nweets" Docs에서 userObj.uid와 동일한 creatorId를 가진 모든 문서를 내림차순으로 가져오는 쿼리요청
      const q = query(collection(dbService, "nweets"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc"))
  
      // getDocs()로 쿼리 결과 값 가져오기
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // console.log(querySnapshot.map((doc => doc.data)))
        console.log(doc.id, "=>", doc.data())
      })
    }
    useEffect(() => {
      getMyNweets();
    }, []); */
  const onChange = (event) => {
    const { target: { value }, } = event;
    setNewDisplayName(value);
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;