import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfileForm({ token }) {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    skills: '',
    projects: [{ title: '', description: '', link: '' }],
    github: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile/me`, {
          headers: { 'x-auth-token': token }
        });
        if (res.data) {
          setProfile({
            name: res.data.name || '',
            email: res.data.email || '',
            skills: res.data.skills ? res.data.skills.join(', ') : '',
            projects: res.data.projects.length ? res.data.projects : [{ title: '', description: '', link: '' }],
            github: res.data.github || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage('Error loading profile');
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (index, e) => {
    const newProjects = [...profile.projects];
    newProjects[index][e.target.name] = e.target.value;
    setProfile({ ...profile, projects: newProjects });
  };

  const addProject = () => {
    setProfile({ ...profile, projects: [...profile.projects, { title: '', description: '', link: '' }] });
  };

  const removeProject = index => {
    const newProjects = [...profile.projects];
    newProjects.splice(index, 1);
    setProfile({ ...profile, projects: newProjects });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = {
        name: profile.name,
        email: profile.email,
        skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean),
        projects: profile.projects.filter(p => p.title.trim() !== ''),
        github: profile.github
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/profile`, data, {
        headers: { 'x-auth-token': token }
      });
      setMessage('Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage('Error saving profile');
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      {message && <p className="message">{message}</p>}
      <label>Name</label>
      <input name="name" value={profile.name} onChange={handleChange} required />

      <label>Email</label>
      <input name="email" value={profile.email} onChange={handleChange} type="email" required />

      <label>Skills (comma separated)</label>
      <input name="skills" value={profile.skills} onChange={handleChange} placeholder="e.g. React, Node.js" />

      <label>GitHub Link</label>
      <input name="github" value={profile.github} onChange={handleChange} type="url" />

      <label>Projects</label>
      {profile.projects.map((project, idx) => (
        <div key={idx} className="project-group">
          <input
            name="title"
            placeholder="Title"
            value={project.title}
            onChange={e => handleProjectChange(idx, e)}
            required={idx === 0}
          />
          <input
            name="description"
            placeholder="Description"
            value={project.description}
            onChange={e => handleProjectChange(idx, e)}
          />
          <input
            name="link"
            placeholder="Link"
            value={project.link}
            onChange={e => handleProjectChange(idx, e)}
            type="url"
          />
          {idx > 0 && (
            <button type="button" className="btn-remove" onClick={() => removeProject(idx)}>
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addProject} className="btn-add">Add Project</button>

      <button type="submit" className="btn-submit">Save Profile</button>
    </form>
  );
}
