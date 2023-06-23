import React from "react"
import { auth } from "../fbase";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    }
    const data = await signInWithPopup(auth, provider);
    console.log(data)
  }
  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          <FontAwesomeIcon icon={faGoogle} />
          &nbsp; Google 계정으로 가입
        </button>
      </div>
    </div>
  );
};

export default Auth;