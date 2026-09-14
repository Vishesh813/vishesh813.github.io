import React from 'react';
import portfolioData from '@data/portfolioData.json';
import targetLogo from '@assets/img/target-logo.png';
import lowesLogo from '@assets/img/lowes-logo.png';
import principalLogo from '@assets/img/pricipal-logo.png';
import tcsLogo from '@assets/img/tcs-logo.png';

import './WorkExperience.css';

// Company color mapping
const companyColors = {
  'Target': '#CC0000',
  'Lowe\'s': '#004990',
  'Principal Global Services': '#1f4e79',
  'Tata Consultancy Services': '#0066cc'
};

// Logo mapping for all companies
const companyLogos = {
  'Target': targetLogo,
  'Lowe\'s': lowesLogo,
  'Principal Global Services': principalLogo,
  'Tata Consultancy Services': tcsLogo
};

const experiences = portfolioData.workExperience.map(exp => ({
  company: exp.company,
  position: exp.position,
  location: exp.location,
  duration: exp.duration,
  logo: companyLogos[exp.company] || exp.logo,
  color: companyColors[exp.company] || '#0066cc',
  achievements: exp.achievements,
}));

const WorkExperienceSection = () => {
  return (
    <div className="work-experience-section">
      <div className="work-container">
        <h1 className="section-title">Work Experience</h1>
        
        <div className="timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker" style={{ backgroundColor: exp.color }}>
                <span className="marker-icon">💼</span>
              </div>
              <div className="timeline-content">
                <div className="experience-card">
                  <div className="experience-header">
                    <img 
                      src={exp.logo} 
                      alt={exp.company} 
                      className="company-logo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="experience-info">
                      <h2 className="position-title">{exp.position}</h2>
                      <h3 className="company-name">{exp.company}</h3>
                    </div>
                  </div>
                  
                  <div className="experience-meta">
                    <span className="meta-item">📍 {exp.location}</span>
                    <span className="meta-item">📅 {exp.duration}</span>
                  </div>

                  <h4 className="achievements-title">Key Achievements:</h4>
                  <ul className="achievements-list">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="achievement-item">
                        <span className="bullet" style={{ backgroundColor: exp.color }}></span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceSection;