
import React, { useState, useEffect } from "react";
import '../../css/App.css';
import logo from '../../assets/logo.png';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // New state for editing user

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [studentsRes, instructorsRes, adminsRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/instructors"),
        fetch("/api/admins")
      ]);
  
      // Check if the responses are OK and return JSON, otherwise throw an error
      if (!studentsRes.ok) throw new Error(`Error fetching students: ${studentsRes.statusText}`);
      if (!instructorsRes.ok) throw new Error(`Error fetching instructors: ${instructorsRes.statusText}`);
      if (!adminsRes.ok) throw new Error(`Error fetching admins: ${adminsRes.statusText}`);
  
      const [studentsData, instructorsData, adminsData] = await Promise.all([
        studentsRes.json(),
        instructorsRes.json(),
        adminsRes.json()
      ]);
  
      setStudents(studentsData);
      setInstructors(instructorsData);
      setAdmins(adminsData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPopupMessage('Passwords do not match, please try again!');
      setShowPopup(true);
      return;
    }
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
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name: `${firstName} ${lastName}`, role }), // Concatenating first and last name for the `name` field
      });

      if (response.ok) {
        await fetchUsers();
        setPopupMessage('User created successfully!');
        setShowPopup(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('');
      } else if (response.status === 409) {
        setPopupMessage('Email already exists, please try another one!');
        setShowPopup(true);
      } else {
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

  const handleEditUser = (user) => {
    const standardizedUser = {
      ...user,
      id: user.instructor_id || user.student_id || user.admin_id,
    };
    setEditingUser(standardizedUser);
    setFirstName(user.name.split(' ')[0]);
    setLastName(user.name.split(' ')[1]);
    setEmail(user.email);
    setRole(user.role);
    setActiveTab('edit');
  };
  
  const handleUpdateUser = async (event) => {
    event.preventDefault();
    console.log(editingUser); // Check the editingUser state
  
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: `${firstName} ${lastName}`,
          role: editingUser.role,
        }),
      });
  
      if (response.ok) {
        await fetchUsers();
        setPopupMessage('User updated successfully!');
        setShowPopup(true);
        setEditingUser(null);
        setFirstName('');
        setLastName('');
        setEmail('');
        setRole('');
        setActiveTab('view');
      } else {
        console.error("Update failed");
        setPopupMessage('Update failed, please try again!');
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setPopupMessage('An error occurred, please try again later!');
      setShowPopup(true);
    }
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const renderUsers = (users) => {
    return users.map((user) => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <button onClick={() => handleEditUser(user)}>Edit</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="user-management">
      <div className="tabs">
        <button className={activeTab === 'create' ? 'active' : ''} onClick={() => handleTabChange('create')}>
          Create User
        </button>
        <button className={activeTab === 'view' ? 'active' : ''} onClick={() => handleTabChange('view')}>
          View Users
        </button>
        {editingUser && (
          <button className={activeTab === 'edit' ? 'active' : ''} onClick={() => handleTabChange('edit')}>
            Edit User
          </button>
        )}
      </div>
      <div className="tab-content">
        {activeTab === 'create' && (
          <div className="create-user">
            <h3>Create User</h3>
            <form onSubmit={handleCreateUser}>
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

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select a role</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
                <option value="administrator">Administrator</option>
              </select>

              <button className="field field-upload" type="submit">Create</button>
            </form>
          </div>
        )}
        {activeTab === 'view' && (
          <div className="view-users">
            <h3>View Users</h3>
            <div className="user-list">
              <h4>Students</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderUsers(students)}
                </tbody>
              </table>

              <h4>Instructors</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderUsers(instructors)}
                </tbody>
              </table>

              <h4>Admins</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderUsers(admins)}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'edit' && editingUser && (
  <div className="edit-user">
    <h3>Edit User</h3>
    <form onSubmit={handleUpdateUser}>
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

      <button className="field field-upload" type="submit">Update</button>
    </form>
  </div>
)}

      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{popupMessage}</h3>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
