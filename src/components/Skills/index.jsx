import React, { useState } from 'react';
import portfolioData from '@data/portfolioData.json';
import './Skills.css';

const frontEndSkills = portfolioData.skills.frontend;
const backEndSkills = portfolioData.skills.backend;
const allSkills = portfolioData.skills.all;

const Skills = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
  };

  const renderSkillsList = () => (
    <div className="skills-card">
      <h3 className="skills-title">Technical Skills</h3>
      <div className="skills-grid">
        {allSkills.map((skill, index) => (
          <div key={index} className="skill-chip">
            {skill}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillBars = (skills, title) => (
    <div className="skills-card">
      <h3 className="skills-title">{title}</h3>
      <div className="skills-bars">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item">
            <div className="skill-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-percentage">{skill.level}%</span>
            </div>
            <div className="skill-progress">
              <div 
                className="skill-progress-bar" 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return renderSkillsList();
      case 1:
        return renderSkillBars(frontEndSkills, 'Frontend Skills');
      case 2:
        return renderSkillBars(backEndSkills, 'Backend Skills');
      default:
        return renderSkillsList();
    }
  };

  return (
    <div className="skills-section">
      <div className="skills-container">
        <div className="skills-tabs">
          <button 
            className={`tab-button ${selectedTab === 0 ? 'active' : ''}`}
            onClick={() => handleTabChange(0)}
          >
            All Skills
          </button>
          <button 
            className={`tab-button ${selectedTab === 1 ? 'active' : ''}`}
            onClick={() => handleTabChange(1)}
          >
            Frontend
          </button>
          <button 
            className={`tab-button ${selectedTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabChange(2)}
          >
            Backend
          </button>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Skills;