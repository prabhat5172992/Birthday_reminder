import React, { useState, useEffect } from "react";
import AddPerson from "./components/addPerson";
import BirthdayReminder from "./components/birthdayReminder";
import "./App.css";

const App = () => {
  const [flag, addPerson] = useState(false);
  const [allUsers, getUsers] = useState([]);

  const getAllUsers = async () => {
    const response = await fetch("http://localhost:3000/get-allUsers");
    const user = await response.json();
    getUsers(user);
    console.log("I am called!!");
    return user;
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    document.cookie =
      "Set-Cookie: cookie-domain:.google.com cookie-name:SID cookie-path:/  SameSite=None; Secure";
  });

  const setFlag = () => {
    addPerson(!flag);
  };

  return (
    <div className="App">
      {flag ? (
        <AddPerson setDisplay={setFlag} getAllUsers={getAllUsers} />
      ) : (
        <>
          <BirthdayReminder allUsers={allUsers} />
          <button className="add_birthday" onClick={() => setFlag()}>
            Add Birthday
          </button>
        </>
      )}
    </div>
  );
};

export default App;
