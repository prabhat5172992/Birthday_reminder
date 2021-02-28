import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import If from './conditional';
import { validateFields } from "../helper";
import Key from "../config/key.json";

const AddPerson = ({ getLoginData }) => {
  const [error, setError] = useState({});
  const [usrData, getData] = useState({});
  const [admin, toggleAdmin] = useState('signup');

  const sendSignupData = async (data, callback) => {
    const response = await fetch("http://localhost:3000/user-signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonResponse = await response.json();
    if(typeof jsonResponse === 'object') callback();
  };

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("birthday_reminder"));
    if(loginData) {
      toggleAdmin('login');
    }
  }, []);

  const captureData = (e) => {
    getData((prevData) => {
      let data = {};
      const usr = { [e.target.name]: e.target.value };
      data = { ...prevData, ...usr };
      return data;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = e.target;
    const data = {};
    data["uniqueID"] = t.email.value.split('@')[0];
    data["name"] = CryptoJS.AES.encrypt(t.name.value, Key.secret).toString();
    data[t.email.name] = CryptoJS.AES.encrypt(t.email.value, Key.secret).toString();
    data[t.password.name] = CryptoJS.AES.encrypt(t.password.value, Key.secret).toString();
    const error = validateFields(t.name.value, t.email.value, t.password.value, admin);
    localStorage.setItem("birthday_reminder", JSON.stringify({email: data.email, password: data.password}));
    if(Object.keys(error).length) {
      setError(error);
    } else {
      sendSignupData(data, () => {
        toggleAdmin('login');
      });
    }
  };

  return (
    <>
    <h1>Register & Login</h1>
      <article className="all_browser">
        <form className="form" onSubmit={handleSubmit}>
          <If condition={admin === 'signup'}>
            <div className="form-control">
              <label htmlFor="name"> Name: </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={captureData}
                required
              />
            </div>
            {error && Object.keys(error).length ? (
              <span style={{ display: "block", color: "red" }}>
                {error.name}
              </span>
            ) : null}
          </If>
          <div className="form-control">
            <label htmlFor="email"> Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={captureData}
              required
            />
          </div>
          {error && Object.keys(error).length ? (
            <span style={{ display: "block", color: "red" }}>
              {error.email}
            </span>
          ) : null}
          <div className="form-control">
            <label htmlFor="password"> Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={captureData}
              required
            />
          </div>
          {error && Object.keys(error).length ? (
            <span style={{ display: "block", color: "red" }}>
              {error.password}
            </span>
          ) : null}
          <If condition={admin === 'login'}>
            <button
              type="button"
              className="add_birthday"
              onClick={()=> getLoginData()}
            >
              Login
            </button>
          </If>
          <If condition={admin==='signup'}>
            <button
              type="submit"
              className="add_birthday marginLeft"
            >
              Signup
            </button>
          </If>
        </form>
      </article>
    </>
  );
};

export default AddPerson;
