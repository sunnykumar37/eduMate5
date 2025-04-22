import React, { useState, useEffect } from 'react';
import { getCvData, updateCvInfo, generatePdfCV, exportCvAsJson } from '../../services/cvGeneratorService';
import './CV.css';

const CvGenerator = () => {
  const [cvData, setCvData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    profile: '',
    education: [],
    skills: [],
    achievements: []
  });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch CV data on component mount
  useEffect(() => {
    const fetchCvData = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from API
        // const data = await getCvData();
        
        // Using dummy data for demo
        const dummyData = {
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '(123) 456-7890',
          },
          profile: 'Dedicated computer science student with a passion for machine learning and data analysis. Looking to leverage academic projects and coursework to build a career in AI research.',
          education: [
            {
              id: 1,
              institution: 'University of Technology',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startDate: '2020',
              endDate: '2024'
            }
          ],
          skills: [
            { id: 1, name: 'Python', proficiency: 90 },
            { id: 2, name: 'Machine Learning', proficiency: 85 },
            { id: 3, name: 'Data Analysis', proficiency: 80 },
            { id: 4, name: 'JavaScript', proficiency: 75 }
          ],
          achievements: [
            { id: 1, title: '7-Day Learning Streak', description: 'Completed a week of continuous learning on the platform' },
            { id: 2, title: 'Quiz Master', description: 'Scored over 90% in 5 consecutive quizzes' }
          ]
        };
        
        setCvData(dummyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CV data:', error);
        setMessage({ text: 'Failed to load CV data', type: 'error' });
        setLoading(false);
      }
    };
    
    fetchCvData();
  }, []);

  // Handle form input changes for personal info
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCvData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [name]: value
      }
    }));
  };

  // Handle profile text changes
  const handleProfileChange = (e) => {
    setCvData(prevData => ({
      ...prevData,
      profile: e.target.value
    }));
  };

  // Handle education changes
  const handleEducationChange = (eduIndex, field, value) => {
    setCvData(prevData => {
      const updatedEducation = [...prevData.education];
      updatedEducation[eduIndex] = {
        ...updatedEducation[eduIndex],
        [field]: value
      };
      
      return {
        ...prevData,
        education: updatedEducation
      };
    });
  };

  // Add new education entry
  const addEducation = () => {
    setCvData(prevData => ({
      ...prevData,
      education: [
        ...prevData.education,
        {
          id: Date.now(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: ''
        }
      ]
    }));
  };

  // Remove education entry
  const removeEducation = (eduIndex) => {
    setCvData(prevData => ({
      ...prevData,
      education: prevData.education.filter((_, index) => index !== eduIndex)
    }));
  };

  // Generate PDF CV
  const handleGeneratePdf = async () => {
    try {
      setLoading(true);
      await generatePdfCV(cvData);
      setMessage({ text: 'PDF CV generated successfully!', type: 'success' });
      setLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage({ text: 'Failed to generate PDF CV', type: 'error' });
      setLoading(false);
    }
  };

  // Export as JSON
  const handleExportJson = () => {
    try {
      exportCvAsJson(cvData);
      setMessage({ text: 'CV data exported as JSON', type: 'success' });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      setMessage({ text: 'Failed to export CV data', type: 'error' });
    }
  };

  // Save CV data
  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real app, we would send to API
      // await updateCvInfo(cvData);
      setMessage({ text: 'CV data saved successfully!', type: 'success' });
      setLoading(false);
    } catch (error) {
      console.error('Error saving CV data:', error);
      setMessage({ text: 'Failed to save CV data', type: 'error' });
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading CV data...</div>;
  }

  return (
    <div className="cv-generator">
      <h1>Academic CV Generator</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="cv-form">
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={cvData.personalInfo.firstName}
              onChange={handlePersonalInfoChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={cvData.personalInfo.lastName}
              onChange={handlePersonalInfoChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={cvData.personalInfo.email}
              onChange={handlePersonalInfoChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={cvData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
          </div>
        </section>
        
        <section className="form-section">
          <h2>Profile</h2>
          <div className="form-group">
            <textarea
              rows="4"
              value={cvData.profile}
              onChange={handleProfileChange}
              placeholder="Write a brief professional summary..."
            />
          </div>
        </section>
        
        <section className="form-section">
          <h2>Education</h2>
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="education-entry">
              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Field of Study</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                    placeholder="Present (if ongoing)"
                  />
                </div>
              </div>
              
              <button 
                className="remove-btn" 
                onClick={() => removeEducation(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button 
            className="add-btn" 
            onClick={addEducation}
            type="button"
          >
            Add Education
          </button>
        </section>
        
        <section className="form-section">
          <h2>Skills & Achievements</h2>
          <p>Skills and achievements are automatically imported from your learning data.</p>
        </section>
        
        <div className="cv-actions">
          <button 
            className="btn-primary" 
            onClick={handleSave}
            type="button"
          >
            Save CV Data
          </button>
          
          <button 
            className="btn-primary" 
            onClick={handleGeneratePdf}
            type="button"
          >
            Generate PDF
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={handleExportJson}
            type="button"
          >
            Export as JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default CvGenerator; 