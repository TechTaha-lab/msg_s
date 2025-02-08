import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiURL from './common/http';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const userdata = localStorage.getItem("userInfo");
  const dts = JSON.parse(userdata);
  const user_id = dts.user.id;
  

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    const name = nameRef.current.value;
    const description = descriptionRef.current.value;

    if (!name || !description || !file) {
      alert('Please fill all fields and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', file);
    formData.append('user_id',user_id);

    try {
      const response = await fetch(`${apiURL}/profile`, {
        method: 'POST',
        body: formData,
      });

      
      const result = await response.json();
      console.log(result);
      
      navigate('/chat')
    } catch (error) {
      alert('Error creating profile');
    }
  };

  return (
    <div className="container mt-5 position-absolute top-50 start-50 translate-middle bg-white shadow-lg rounded p-4">
      <div className="row">
        <div className="col-md-4 text-center">
          <div className="border p-3">
            <img 
              src={image || 'https://pluspng.com/img-png/user-png-icon-big-image-png-2240.png'}
              alt="Profile" 
              className="img-fluid rounded-circle mb-3" 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
            />
            <input type="file" className="form-control" onChange={handleImageChange} />
          </div>
        </div>
        <div className="col-md-8">
          <div className="border p-3">
            <input type="text" className="form-control mb-3" placeholder="Name" ref={nameRef} />
            <textarea className="form-control mb-3" rows="4" placeholder="Description" ref={descriptionRef}></textarea>
            <button className="btn btn-primary w-100" onClick={handleSubmit}>Create Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;