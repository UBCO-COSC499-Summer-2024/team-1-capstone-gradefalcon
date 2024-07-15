import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Signup.css';
import logo from '../assets/logo.png';


const Popup = ({ message, onClose }) => (
  <div className="popup">
    <div className="popup-content">
      <span className="popup-message">{message}</span>
      <button onClick={onClose} className="close-button">Close</button>
    </div>
  </div>
);

export const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword(password)) {
      setPopupMessage(`Password does not meet the requirements. Password must meet the following criteria:
                          Minimum length of 8 characters
                          At least one uppercase letter
                          At least one lowercase letter
                          At least one digit
                          At least one special character`);
      setShowPopup(true);
      return;
    }
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name: `${firstName} ${lastName}`, role }), // Concatenating first and last name for the `name` field
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/Student-Dashboard");
      } else if (response.status === 409) {
        setPopupMessage('Email already exists, please try another one!');
        setShowPopup(true);
      }else {
        console.error("Signup failed");
        setPopupMessage('Signup failed, please try again!');
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setPopupMessage('An error occurred, please try again later!');
      setShowPopup(true);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPopupMessage('Passwords do not match, please try again!');
      setShowPopup(true);
    } else if (role == null) {
      setPopupMessage('Please select what your role is!');
      setShowPopup(true);
    } else {
      handleSubmit(e);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="instructor-signup">
      <style>
        {`
          body {
            justify-content: center;
          }
        `}
      </style>
      <div className="div">
        <div className="text-wrapper">App</div>
        <img src={logo} alt="Logo" className="logo"/>
        <div className="overlap-group">
          <div className="content">
            <div className="copy">
              <div className="text-wrapper-2">Create an account</div>
            </div>
            <div className="input-and-button">
              <form onSubmit={handleSignup}>
                <input 
                  className="field" 
                  id="firstName" 
                  placeholder="First Name" 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <input 
                  className="field" 
                  id="lastName" 
                  placeholder="Last Name" 
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

                <input 
                  className="field" 
                  id="email" 
                  placeholder="Enter Email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input 
                  className="field" 
                  id="password" 
                  placeholder="Enter Password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <input 
                  className="field" 
                  id="confirmPassword" 
                  placeholder="Confirm Password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button type="submit" className="button">
                  <label className="label" htmlFor="input-1">
                    Sign up
                  </label>
                </button>
              </form>
            </div>
            <div className="divider">
              <div className="rectangle" />
              <div className="text-wrapper-3">or continue with</div>
              <div className="rectangle" />
            </div>
            <div className="button-2">
              <div className="text-wrapper-4">Sign up with Google</div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && <Popup message={popupMessage} onClose={handleClosePopup} />}
    </div>
  );
};


export default Signup;