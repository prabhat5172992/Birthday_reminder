import React, { useState, useEffect, useCallback } from "react";
import CryptoJS from "crypto-js";
import AddPerson from "./components/addPerson";
import BirthdayReminder from "./components/birthdayReminder";
import If from "./components/conditional";
import Admin from "./components/loginSignup";
import Key from "./config/key.json";
import "./App.css";

const App = () => {
  const [displayAdmin, checkAdmin] = useState(!JSON.parse(localStorage.getItem("birthday_reminder")));
  const [displayBirthday, enableBdPage] = useState(false);
  const [displayAddBd, addPerson] = useState(false);
  const [allUsers, getUsers] = useState([]);

  const getAllUsers = async () => {
    const currentDate = new Date().toLocaleDateString("en-GB").replaceAll('/', '-');
    const response = await fetch(`http://localhost:3000/get-allUsers/${currentDate}`);
    const user = await response.json();
    getUsers(user);
    return user;
  };

  const decryptData = (data) => {
    if (data) {
      const bytes = CryptoJS.AES.decrypt(data, Key.secret);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText;
    }
    return null;
  };

  const getLoginData = useCallback(async () => {
    const loginData = JSON.parse(localStorage.getItem("birthday_reminder"));
    const email = loginData && decryptData(loginData.email);
    const response = await fetch(
      `http://localhost:3000/get-logindata/${email}`
    );
    const userLogin = await response.json();
    if (
      loginData &&
      decryptData(userLogin.email) === email &&
      decryptData(userLogin.password) === decryptData(loginData.password)
    ) {
      checkAdmin(false);
      enableBdPage(true);
      getAllUsers();
    } else {
      checkAdmin(true);
      enableBdPage(false);
    }
  }, []);

  useEffect(() => {
    document.cookie =
      "Set-Cookie: cookie-domain:.google.com cookie-name:SID cookie-path:/  SameSite=None; Secure";
  }, []);

  useEffect(() => {
    if(JSON.parse(localStorage.getItem("birthday_reminder"))) {
      getLoginData();
    }
  }, [getLoginData]);

  const setFlag = () => {
    addPerson(!displayAddBd);
    enableBdPage(displayAddBd);
  };

  return (
    <div className="App">
      <If condition={displayAdmin}>
        <Admin getLoginData={getLoginData} />
      </If>
      <If condition={displayAddBd}>
        <AddPerson setDisplay={setFlag} getAllUsers={getAllUsers} />
      </If>
      <If condition={displayBirthday}>
        <BirthdayReminder allUsers={allUsers} />
        <button
          className="add_birthday add_birthday-ex"
          onClick={() => setFlag()}
        >
          Add Birthday
        </button>
      </If>
    </div>
  );
};

export default App;
