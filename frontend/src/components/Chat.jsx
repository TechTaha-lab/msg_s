import React, { useEffect, useState } from 'react';
import './chat.css';
import apiURL from './common/http';
import { useNavigate } from 'react-router-dom';
import useLogout from './common/logout';

const Chat = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (!data) {
      navigate('/login');
      return;
    }
    const userdata = JSON.parse(data);
    const userid = userdata.user.id;
    setUserId(userdata.user.id);

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiURL}/profile/${userid}`);
        const data = await response.json();
        if (!data.profile) {
          navigate('/profile');
        } else {
          setProfile(data.profile);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUserProfiles = async () => {
      try {
        const response = await fetch(`${apiURL}/profile`);
        const data = await response.json();
        setUserProfiles(data.profiles.filter(profile => profile.user_id !== userid));
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchUserProfiles();
  }, [navigate]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessageByReceiver(user.user_id);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const fetchMessageByReceiver = async (receiverId) => {
    try {
      const response = await fetch(`${apiURL}/get_msg/${receiverId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handlesend = async () => {
    if (!selectedUser || !message.trim()) {
      alert("Please select a user and enter a message.");
      return;
    }

    const formData = new FormData();
    formData.append("sender_id", userId);
    formData.append("receiver_id", selectedUser.user_id);
    formData.append("message", message);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await fetch(`${apiURL}/send_msg`, {
        method: "POST",
        body: formData,
      });
      setMessage('');
      setSelectedFile(null);
      fetchMessageByReceiver(selectedUser.user_id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="content position-absolute top-50 start-50 translate-middle" style={{ width: "900px" }}>
      <div className="container p-0">
        <h1 className="h3 mb-3">Messages</h1>
        <div className="card">
          <div className="row g-0">
            <div className="col-12 col-lg-5 col-xl-3 border-right user-list">
              <div className="px-4 d-none d-md-block">
                <input type="text" className="form-control my-3" placeholder="Search..." />
              </div>
              <div className="user-scroll">
                {userProfiles.map((user) => (
                  <a key={user.id} href="#" className="list-group-item list-group-item-action border-0 p-2 pl-3" onClick={() => handleSelectUser(user)}>
                    <div className="d-flex align-items-start">
                      <img src={user.image || "https://bootdey.com/img/Content/avatar/avatar5.png"} className="rounded-circle mr-1" alt={user.name} width="40" height="40" />
                      <div className="flex-grow-1 ml-4">
                        {user.name}
                        <div className="small text-muted">{user.description || "No bio available"}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-7 col-xl-6">
              {selectedUser ? (
                <>
                  <div className="py-2 px-4 border-bottom d-none d-lg-block">
                    <div className="d-flex align-items-center py-1">
                      <img src={selectedUser.image || "https://bootdey.com/img/Content/avatar/avatar3.png"} className="rounded-circle mr-1" alt={selectedUser.name} width="40" height="40" />
                      <div className="flex-grow-1 pl-3">
                        <strong>{selectedUser.name}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="position-relative chat-box">
                    <div className="chat-messages p-4">
                      {messages.map((msg, index) => (
                        <div key={index} className={`d-flex mb-3 ${msg.sender_id === userId ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div className="d-flex">
                            <img src={msg.sender_id === userId ? profile.image : selectedUser.image || "https://bootdey.com/img/Content/avatar/avatar3.png"} className="rounded-circle mr-2" alt="User" width="40" height="40" />
                            <div className={`chat-bubble p-2 rounded ${msg.sender_id === userId ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '60%' }}>
                              <p className="mb-0">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-grow-0 py-3 px-4 border-top">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Type your message" value={message} onChange={(e) => setMessage(e.target.value)} />
                      <button className='btn btn-danger'>
                        <label htmlFor='files' style={{ cursor: "pointer" }}>
                          <i className="fas fa-file" id='files'></i>
                        </label>
                        <input type="file" id='files' style={{ display: "none" }} onChange={handleFileChange} />
                      </button>
                      <button className="btn btn-primary" onClick={handlesend}>Send</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-5">Choose a friend to start a conversation</div>
              )}
            </div>
            <div className="col-12 col-xl-3 profile-section d-none d-xl-block mt-5">
              <div className="p-4 text-center">
                {profile ? (
                  <>
                    <img src={profile.image || "https://bootdey.com/img/Content/avatar/avatar1.png"} className="rounded-circle mb-3" alt="User" width="80" height="80" />
                    <h5 className="mb-1">{profile.name}</h5>
                    <p className="text-muted small">{profile.description || "No bio available"}</p>
                  </>
                ) : (
                  <p>Loading profile...</p>
                )}
                <button className="btn btn-danger" onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Chat;
