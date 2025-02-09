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
  const [filteredUserProfiles, setFilteredUserProfiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaImg, setmediaImg] = useState('');
  const [lastMsg, setlastMsg] = useState('');

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (!data) {
      navigate('/login');
      return;
    }
    const userdata = JSON.parse(data);
    const userid = userdata.user.id;
    setUserId(userid);

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
        setFilteredUserProfiles(data.profiles.filter(profile => profile.user_id !== userid));
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchUserProfiles();
  }, [navigate]);

  const fetch_img = async () => {
    try {
      const response = await fetch(`${apiURL}/get_media/${userId}`);
      const data = await response.json();
      setmediaImg(data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    const filtered = userProfiles.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUserProfiles(filtered);
    fetch_img()
  }, [searchQuery, userProfiles]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessageByReceiver(user.user_id);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const fetchMessageByReceiver = async (receiverId) => {
    try {
      const response = await fetch(`${apiURL}/get_msg/${receiverId}`);
      const data = await response.json();
      setMessages(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessageBySender = async (senderId) => {
    try {
      const response = await fetch(`${apiURL}/get_msg_s/${userId}`);
      const data = await response.json();
      setMessages(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const userProfile = () => {
    navigate(`/UserProfile/${selectedUser.user_id}`);
  };

  const handlesend = async () => {


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
      await fetchMessageByReceiver(selectedUser.user_id);
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <main className="content position-absolute top-50 start-50 translate-middle" style={{ width: "1300px" }}>
      <div className="container p-0">
        <h1 className="h3 mb-3">Messages</h1>
        <div className="card">
          <div className="row g-0">
            <div className="col-12 col-lg-5 col-xl-3 border-right user-list">
              <div className="px-4 d-none d-md-block">
                <input
                  type="text"
                  className="form-control my-3"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="user-scroll">
                {filteredUserProfiles.map((user) => (
                  <a key={user.id} href="#" className="list-group-item list-group-item-action border-0 p-2 pl-3" onClick={() => handleSelectUser(user)}>
                    <div className="d-flex align-items-start">
                      <img src={user.image || "https://bootdey.com/img/Content/avatar/avatar5.png"} className="rounded-circle mr-1" alt={user.name} width="40" height="40" />
                      <div className="flex-grow-1 ml-4">
                        <div>{user.name}</div>
                      </div>
                    </div>
                  </a>
                ))}

              </div>
            </div>
            <div className="col-12 col-lg-7 col-xl-6">
              {selectedUser ? (
                <div className="chat-box">
                  <div className="chat-header d-flex align-items-center py-2 px-4 border-bottom">
                    <img src={selectedUser.image || "https://bootdey.com/img/Content/avatar/avatar5.png"} className="rounded-circle mr-2" alt={selectedUser.name} width="40" height="40" />
                    <strong className='ml-2'>{selectedUser.name}</strong>
                    <i className="fa-solid fa-user" style={{ position: "absolute", right: "340px", fontSize: "20px", cursor: "pointer" }} title='User Profile' onClick={userProfile}></i>
                  </div>
                  <div className="chat-messages p-4" style={{ overflowY: 'auto', maxHeight: '400px', position: 'relative' }}>
                    {messages.length > 0 ? (
                      messages.map((msg, index) => (
                        <div key={index} className={`d-flex mb-3 ${msg.sender_id === userId ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div className={`chat-bubble p-2 rounded ${msg.sender_id === userId ? 'bg-primary text-white' : 'bg-light text-dark'}`}>
                            <p className="mb-0">{msg.message}</p>
                            {msg.file && (
                              <img src={msg.file} alt="attachment" className="mt-2 rounded" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <p className="text-muted">There is no message yet.</p>
                      </div>
                    )}

                  </div>
                  <div className="input-group p-3" style={{ position: 'relative', bottom: 0, backgroundColor: 'white', borderTop: '1px solid #ddd', width: 590 }}>
                    <input type="text" className="form-control" placeholder="Type your message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <div className="file-input-wrapper">
                      <input type="file" id="file-upload" onChange={handleFileChange} hidden />
                      <label htmlFor="file-upload" className="btn btn-secondary">📎</label>
                    </div>
                    <button className="btn btn-primary" onClick={handlesend}>Send</button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-5">Choose a friend to start a conversation</div>
              )}
            </div>
            <div className="col-12 col-xl-3 profile-section d-none d-xl-block mt-5">
              {profile && (
                <div className="p-4 text-center">
                  <img src={profile.image || "https://bootdey.com/img/Content/avatar/avatar1.png"} className="rounded-circle mb-3" alt="User" width="80" height="80" />
                  <h5>{profile.name}</h5>
                  <p className="text-muted small">{profile.description || "No bio available"}</p>
                  <button className="btn btn-danger" onClick={logout}>Logout</button>
                </div>
              )}
              <hr />
              <div className="media p-3 border rounded">
                <h6 className="mb-2 text-primary">Your Media</h6>
                <div
                  className="media-content d-flex align-items-center"
                  style={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {mediaImg && mediaImg.length > 0 ? (
                      mediaImg.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Media ${index}`}
                          className="rounded shadow-sm"
                          style={{ width: 60, height: 60, objectFit: 'cover' }}
                        />
                      ))
                    ) : (
                      <p>No media available</p>
                    )}
                  </div>
                </div>
                <style>
                  {`
      .media-content::-webkit-scrollbar {
        display: none;
      }
    `}
                </style>
              </div>

            </div>


          </div>
        </div>
      </div>
    </main>
  );
};

export default Chat;