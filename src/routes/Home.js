import React, { useEffect, useState } from "react"
import { dbService } from "fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    const q = query(collection(dbService, "tweets"), orderBy("createdAt", "desc"))
    onSnapshot(q, (snapshot) => {
      const tweetArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div>
        {tweets.map(tweet => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
};

export default Home;