import React from 'react';
import portfolioData from '@data/portfolioData.json';
import './Awards.css';

const awards = portfolioData.awards;

const Awards = () => {
  return (
    <div className="awards-section">
      <div className="awards-container">
        <h1 className="section-title">Achievements & Awards</h1>
        
        <div className="awards-grid">
          {awards.map((award, index) => (
            <div key={index} className="award-card">
              <div className="award-icon" style={{ backgroundColor: award.color }}>
                <span className="icon">{award.icon}</span>
              </div>
              
              <h3 className="award-title">{award.title}</h3>
              
              <p className="award-description">{award.description}</p>
              
              <span className="award-year">{award.year}</span>
            </div>
          ))}
        </div>

        <div className="recognition-summary">
          <h3 className="summary-title">Recognition Summary</h3>
          <div className="summary-list">
            {awards.map((award, index) => (
              <div key={index} className="summary-item">
                <div className="summary-icon" style={{ backgroundColor: award.color }}>
                  <span className="icon">{award.icon}</span>
                </div>
                <div className="summary-content">
                  <h4 className="summary-award-title">{award.title}</h4>
                  <p className="summary-award-description">
                    {award.description} ({award.year})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awards;