import React, { useState } from "react";
import { getBase64 } from "../helper";

const AddPerson = ({ setDisplay, getAllUsers }) => {
  const [fileBlob, getFile] = useState("");
  const [error, setError] = useState({});
  const [usrData, getData] = useState({});

  const sendData = async (data, callback) => {
    const response = await fetch("http://localhost:3000/add-user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonResponse = await response.json();
    // getUsers(jsonResponse);
    // console.log("All users", jsonResponse);
    if(typeof jsonResponse === 'object') callback();
  };

  const captureData = (e) => {
    getData((prevData) => {
      let data = {};
      const usr = { [e.target.name]: e.target.value };
      data = { ...prevData, ...usr };
      return data;
    });
  };

  const validateFile = (file, ext) => {
    if (file.size >= 2097152) {
      setError(() => {
        const fileErr = { fileErr: "File size cannot exceed 2mb." };
        return fileErr;
      });
      return false;
    } else if (
      ext !== "jpg" &&
      ext !== "JPG" &&
      ext !== "jpeg" &&
      ext !== "JPEG" &&
      ext !== "png" &&
      ext !== "PNG" &&
      ext !== "pdf" &&
      ext !== "PDF"
    ) {
      setError(() => {
        const fileErr = { fileErr: "Fis is not suported." };
        return fileErr;
      });
      return false;
    } else {
      setError(() => {
        const fileErr = {};
        return fileErr;
      });
      return true;
    }
  };

  const fileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const files = [...e.target.files];
      const ext = files[0].name.split(".")[files[0].name.split(".").length - 1];
      const isFileValid = validateFile(files[0], ext);
      const fileObject = files[0];
      if (isFileValid) {
        let response = getBase64(fileObject);
        response.then((data) => {
          try {
            if (data) {
              getFile(data);
            } else alert("Promise Pending!!");
          } catch (err) {
            alert("An error occured", err);
          }
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = e.target;
    const data = {};
    data["name"] = t.fname.value + " " + t.lname.value;
    data[t.mob.name] = t.mob.value;
    data[t.dob.name] = t.dob.value.split("-").reverse().join("-");
    data[t.img.name] = t.img.value || fileBlob;
    sendData(data, () => {
      getAllUsers();
    });
    setDisplay();
  };
  const goBack = () => {
    getData({});
    setDisplay();
  };

  return (
    <>
    <h1>Add Birthday Details</h1>
      <article className="all_browser">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="firstName"> Fname: </label>
            <input
              type="text"
              id="fname"
              name="fname"
              onChange={captureData}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="lastName"> Lname: </label>
            <input
              type="text"
              id="lname"
              name="lname"
              onChange={captureData}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="mobile"> Mobile No: </label>
            <input
              type="number"
              id="mob"
              name="mob"
              onChange={captureData}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="date"> DOB: </label>
            <input
              type="date"
              id="dob"
              name="dob"
              onChange={captureData}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="url"> Image Url: </label>
            <input type="url" id="img" name="img" onChange={captureData} />
          </div>
          <div className="form-control">
            <label htmlFor="img2">Upload image:</label>
            <input
              type="file"
              id="img2"
              name="img2"
              onChange={fileUpload}
              accept="image/*"
            />
          </div>
          {error && Object.keys(error).length ? (
            <span style={{ display: "block", color: "red" }}>
              {error.fileErr}
            </span>
          ) : null}
          <button
            type="submit"
            className="add_birthday"
            disabled={
              Object.keys(error).length || !Object.keys(usrData).length || false
            }
          >
            Add Person
          </button>
          <button
            type="button"
            className="add_birthday marginLeft"
            onClick={goBack}
          >
            &larr; Back
          </button>
        </form>
      </article>
      <p className="birthDate notText">
        Use either of image url or upload image, using both will give image url
        prefrence.
      </p>
    </>
  );
};

export default AddPerson;
