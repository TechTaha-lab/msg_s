import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiURL from './common/http'

const UserProfile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiURL}/profile/${id}`)
        const data = await response.json()
        console.log(data);
        
        setProfile(data.profile)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProfile()
  }, [id])

  return (
    <div className='position-absolute top-50 start-50 translate-middle w-50' style={{ marginLeft: '140px' }}>
      <div className="shadow bg-white w-50 p-4 rounded">
        <div className="text-center mb-4">
          <img src={profile?.image || "https://bootdey.com/img/Content/avatar/avatar1.png"} className="rounded-circle mb-3" alt="User" width="120" height="120" />
          <h3 className="mb-1">{profile?.name || "Loading..."}</h3>
          <p className="text-muted">{profile?.description || "No description available"}</p>
        </div>
       
       
      </div>
    </div>
  )
}

export default UserProfile
