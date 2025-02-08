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

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (!data) {
      navigate('/login');
      return;
    }
    const userdata = JSON.parse(data);
    const userid = userdata.user.id;

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
        const filteredProfiles = data.profiles.filter(profile => profile.user_id !== userid);
        setUserProfiles(filteredProfiles);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchUserProfiles();
  }, [navigate]);

  const handleSend = () => {
    if (message.trim() !== '') {
      setMessages([...messages, { sender: 'You', text: message, time: 'Now' }]);
      setMessage('');
    }
  };

  const handleProfileClick = (userId) => {
    if (profile) {
      console.log(userId);

      navigate(`/UserProfile/${userId}`);
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
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <input type="text" className="form-control my-3" placeholder="Search..." />
                  </div>
                </div>
              </div>
              <div className="user-scroll">
                {userProfiles.map((user) => (
                  <a key={user.id} href="" className="list-group-item list-group-item-action border-0 p-2 pl-3" onClick={() => setSelectedUser(user)}>
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
                      <div className="position-relative">
                        <img src={selectedUser.image || "https://bootdey.com/img/Content/avatar/avatar3.png"} className="rounded-circle mr-1" alt={selectedUser.name} width="40" height="40" />
                      </div>
                      <div className="flex-grow-1 pl-3">
                        <strong>{selectedUser.name}</strong>
                        <div className="text-muted small"><em>Online</em></div>
                      </div>
                      <div>
                        <i className="fas fa-user-circle" style={{ fontSize: "22px", cursor: "pointer", color: "#333" }} onClick={handleProfileClick(selectedUser.user_id)}></i>

                      </div>
                    </div>
                  </div>
                  <div className="position-relative chat-box">
                    <div className="chat-messages p-4">
                      {messages.map((msg, index) => (
                        <div key={index} className={`chat-message-${msg.sender === 'You' ? 'right' : 'left'} pb-4`}>
                          <div>
                            <img src={`https://bootdey.com/img/Content/avatar/${msg.sender === 'You' ? 'avatar1.png' : 'avatar3.png'}`} className="rounded-circle mr-1" alt={msg.sender} width="40" height="40" />
                            <div className="text-muted small text-nowrap mt-2">{msg.time}</div>
                          </div>
                          <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                            <div className="font-weight-bold mb-1">{msg.sender}</div>
                            {msg.text}
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
                        <input type="file" id='files' style={{ display: "none" }} />
                      </button>
                      <button className="btn btn-primary" onClick={handleSend(selectedUser.user_id)}>Send</button>
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
              <hr />
              <div className="profile">
                <div className="profile-details">
                  <p>Media</p>
                </div>
                <div className="media-gallery" style={{ overflowX: 'auto', overflowY: 'hidden', display: 'flex', gap: '10px', scrollbarWidth: 'none' }}>
                  <img src="http://localhost:8000/storage/messages/VJFnbgCUS7YjzsuzLXTlgJhw0DzcCbhS6kXz14c9.jpg" alt="Media 1" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <img src="http://localhost:8000/storage/messages/VJFnbgCUS7YjzsuzLXTlgJhw0DzcCbhS6kXz14c9.jpg" alt="Media 2" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <img src="http://localhost:8000/storage/messages/VJFnbgCUS7YjzsuzLXTlgJhw0DzcCbhS6kXz14c9.jpg" alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <img src="http://localhost:8000/storage/messages/VJFnbgCUS7YjzsuzLXTlgJhw0DzcCbhS6kXz14c9.jpg" alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <img src="http://localhost:8000/storage/messages/VJFnbgCUS7YjzsuzLXTlgJhw0DzcCbhS6kXz14c9.jpg" alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <img src="http://localhost:8000/storage/messages/VJFnbgCUS7YjzsuzLXTlgJhw0DzcCbhS6kXz14c9.jpg" alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              </div>




            </div>



          </div>
        </div>
      </div>
    </main>
  );
};

export default Chat;
