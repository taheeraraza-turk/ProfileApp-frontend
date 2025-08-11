import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilePreview({ token }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile/me`, {
          headers: { 'x-auth-token': token }
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfile(null);
      }
    };
    fetchProfile();
  }, [token]);

  if (!profile) return <p>No profile found. Please create your profile first.</p>;

  return (
    <div className="profile-preview">
      <h2>{profile.name}</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
      <p><strong>GitHub:</strong> <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a></p>
      <h3>Projects:</h3>
      {profile.projects.length === 0 && <p>No projects added.</p>}
      <ul>
        {profile.projects.map((proj, idx) => (
          <li key={idx}>
            <strong>{proj.title}</strong>: {proj.description} {' '}
            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer">Link</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
