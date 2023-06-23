import React, { useState } from "react";
import { auth } from "fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const { target: { name, value } } = event;
    if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          auth, email, password
        )
      } else {
        data = await signInWithEmailAndPassword(auth, email, password)
      }
      console.log(data)
    } catch (error) {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-email') {
        setError("유효한 이메일 주소를 입력하세요.");
      } else if (errorCode === "auth/email-already-in-use") {
        setError("이미 가입된 이메일 주소입니다.");
      } else if (errorCode === 'auth/weak-password') {
        setError("패스워드는 최소 6글자 이상 입력하세요.");
      } else if (errorCode === "auth/wrong-password" || "auth/user-not-found") {
        setError("가입된 회원이 아니거나 비밀번호가 틀립니다.");
      }
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
          className="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  )
};
export default AuthForm;