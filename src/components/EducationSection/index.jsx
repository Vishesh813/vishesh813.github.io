import React from 'react';
import portfolioData from '@data/portfolioData.json';
import knitLogo from '@assets/img/knit-logo.jpg';
import csjmLogo from '@assets/img/csjm-logo.png';
import nlkLogo from '@assets/img/up-bord-logo.png';
import './EducationSection.css';

const schoolLogos = {
  'Kamla Nehru Institute of Technology': knitLogo,
  'V.S.S.D College, Kanpur': csjmLogo,
  'N.L.K Inter College, Kanpur': nlkLogo,
};

const EducationSection = () => {
  return (
    <div className="education-section">
      <div className="education-container">
        <h1 className="section-title">Education</h1>
        
        <div className="timeline">
          {portfolioData.education.map((edu, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker" style={{ backgroundColor: edu.color }}>
                <span className="marker-icon">🎓</span>
              </div>
              <div className="timeline-content">
                <div className="education-card">
                  <div className="education-header">
                    <img src={schoolLogos[edu.school]} alt={edu.school} className="school-logo" />
                    <div className="education-info">
                      <h2 className="degree-title">{edu.degree}</h2>
                      <h3 className="school-name">{edu.school}</h3>
                      <p className="university-name">{edu.university}</p>
                    </div>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="education-meta">
                    <span className="meta-item">📅 {edu.duration}</span>
                    <span className="meta-item">📊 {edu.percentage}</span>
                    <span className="type-chip" style={{ backgroundColor: edu.color }}>
                      {edu.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationSection;