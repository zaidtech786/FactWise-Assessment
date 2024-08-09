import React, { useContext, useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

const DisplayTodo = ({
  user,
  isOpen,
  onToggle,
  isEditing,
  setIsEditing,
  data,
  setData,
}) => {
  const [singleUser, setSingleUser] = useState([]); // This state Stored Individual user data
  const [modal, setModal] = useState(false);
  const [userId, setUserId] = useState(0);
  const [disable, setDisable] = useState(true);
  const [editUsers, setEditUsers] = useState({}); // Updated data stored here
  const [editingUserId, setEditingUserId] = useState(null);
  const [fullName, setFullName] = useState("");

  // Fetching User Data
  const fetchData = (id) => {
    onToggle();
    const findUser = data.find((user) => user.id == id);
    let dob = findUser.dob.substring(0, 4);
    let year = new Date().getUTCFullYear();
    let calAge = year - +dob;
    setSingleUser({ ...findUser, age: calAge });
    setFullName(`${findUser.first} ${findUser.last}`);
  };

  // Delete User
  const deleteUser = () => {
    setModal(false);
    let filterUser = data.filter((user) => user.id != userId);
    setData(filterUser);
  };

  // Edit Operation Start
  const editingStart = (id) => {
    setIsEditing(true);
    setDisable(true);
    setEditingUserId(id);
    setEditUsers({ ...singleUser });
    if (!isOpen) {
      onToggle();
    }
  };

  //Handle User Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    const hasChanged = value != singleUser[name];
    setDisable(!hasChanged);
    setEditUsers({ ...editUsers, [name]: value });
  };

  // Handling Name Change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);
    if (value != editUsers.first + " " + editUsers.last) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  // Editing Functionality
  const editData = (id) => {
    if (
      !editUsers.age ||
      !editUsers.country ||
      !editUsers.description ||
      !editUsers.gender ||
      !fullName
    ) {
      return alert("Fields cannot empty");
    }
    if (/\d/.test(editUsers.country)) {
      return alert("Country not contain numbers");
    }

    let newDob = "";
    if (singleUser.age != editUsers.age) {
      const currentDate = new Date();
      const birthYear = currentDate.getFullYear() - Number(editUsers.age);
      const birthDate = new Date(singleUser.dob);
      newDob = new Date(birthDate.setFullYear(birthYear))
        .toISOString()
        .split("T")[0];
    }

    const name = fullName.split(" ");
    const firstName = name[0];
    const lastName = name[1];

    const findUser = data.find((user) => user.id == id);

    findUser.age = editUsers.age;
    findUser.country = editUsers.country;
    findUser.dob = newDob == "" ? editUsers.dob : newDob;
    findUser.gender = editUsers.gender;
    findUser.description = editUsers.description;
    findUser.first = firstName;
    findUser.last = lastName;
    setSingleUser(findUser);
    setIsEditing(false);
    setEditingUserId(null);
  };

  const genders = ["male", "female", "Rather not say", "Transgender", "others"];

  const filteredGender = genders.filter(
    //Filtering Gender
    (option) => option !== editUsers.gender
  );

  return (
    <>
      <div className="wrapper">
        <div key={user.id} className="profileContainer">
          {editingUserId === user.id ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img src={user.picture} alt="" className="img" />
              <input
                type="text"
                className="name_inputt"
                name="first"
                value={fullName}
                onChange={(e) => handleNameChange(e)}
              />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img src={user.picture} alt="" className="img" />
              <p style={{ fontWeight: "600", fontSize: "20px" }}>
                {user.first + " " + user.last}
              </p>
            </div>
          )}

          {isOpen ? (
            <KeyboardArrowUpIcon
              style={{ cursor: "pointer" }}
              onClick={() => onToggle()}
            />
          ) : (
            <button
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={() => fetchData(user.id)}
            >
              <KeyboardArrowDownIcon />
            </button>
          )}
        </div>
        {isOpen && (
          <>
            <div className="userInfo">
              <div className="info">
                <p style={{ color: "#4F4F4F" }}>Age</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={editUsers.age}
                    name="age"
                    onChange={(e) => handleChange(e)}
                    className="inputt"
                  />
                ) : (
                  <p>{singleUser.age}</p>
                )}
              </div>

              <div className="info">
                <p style={{ color: "#4F4F4F" }}>Gender</p>
                {isEditing ? (
                  <select name="gender" onChange={(e) => handleChange(e)}>
                    <option value={editUsers.gender}>{editUsers.gender}</option>
                    {filteredGender.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>{singleUser.gender}</p>
                )}
              </div>

              <div className="info">
                <p style={{ color: "#4F4F4F" }}>Country</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editUsers.country}
                    name="country"
                    onChange={(e) => handleChange(e)}
                    className="inputt"
                  />
                ) : (
                  <p>{singleUser.country}</p>
                )}
              </div>

              <div className="info">
                <p style={{ color: "#4F4F4F", marginTop: "10px" }}>
                  description
                </p>
                {isEditing ? (
                  // <input type="textarea" name="" style={{width:"370px"}}  />
                  <textarea
                    value={editUsers.description}
                    name="description"
                    onChange={(e) => handleChange(e)}
                  >
                    {editUsers.description}
                  </textarea>
                ) : (
                  <p>{singleUser.description}</p>
                )}
              </div>
            </div>
            <div className="btnContainer">
              {isEditing ? (
                <>
                  <CloseIcon
                    style={{
                      color: "red",
                      border: "1px solid red",
                      borderRadius: "50%",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setIsEditing(false), setEditingUserId(null);
                      setEditUsers({
                        ...singleUser,
                      });
                    }}
                  />
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    disabled={disable}
                    onClick={() => editData(singleUser.id)}
                  >
                    <CheckIcon
                      style={{
                        color: "green",
                        border: "1px solid green",
                        borderRadius: "50%",
                        fontSize: "18px",
                      }}
                    />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setModal(true), setUserId(singleUser.id);
                    }}
                    style={{ border: "none", background: "transparent" }}
                  >
                    <DeleteIcon
                      style={{
                        fontSize: "18px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </button>

                  <button
                    onClick={() => editingStart(singleUser.id)}
                    style={{ border: "none", background: "transparent" }}
                    disabled={singleUser.age < 18 ? true : false}
                  >
                    <ModeEditIcon
                      style={{
                        fontSize: "18px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {modal && (
          <div className="modalCotainer">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>Are you sure you want to delete ? </p>
              <CloseIcon
                onClick={() => setModal(false)}
                style={{ fontSize: "18px", cursor: "pointer" }}
              />
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.8rem",
              }}
            >
              <button className="btn" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button className="btn del" onClick={() => deleteUser()}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DisplayTodo;
