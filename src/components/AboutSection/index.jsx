import React, { useState } from 'react';
import portfolioData from '@data/portfolioData.json';
import profilePic from '@assets/img/profile-pic.webp';
import LinkPreview from '@components/LinkPreview/LinkPreview.jsx';
import ResumePreviewDrawer from '@components/ResumePreviewDrawer/ResumePreviewDrawer.jsx';
import './AboutSection.css';

const AboutSection = () => {
  const { personal } = portfolioData;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  
  return (
    <div className="about-section">
      <div className="about-container">
        <div className="about-grid">
          <div className="about-left">
            <div className="profile-card">
              <div className="profile-image-container">
                <img
                  src={profilePic}
                  alt={personal.name}
                  className="profile-image"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <h1 className="profile-name">{personal.name}</h1>
              <h2 className="profile-title">{personal.title}</h2>
              <div className="profile-tags">
                {personal.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="about-right">
            <div className="about-content">
              <h3 className="section-title">About Me</h3>
              {personal.about.map((paragraph, index) => (
                <p key={index} className="about-text">
                  {paragraph}
                </p>
              ))}

              <div className="divider"></div>

              <h4 className="contact-title">Contact Information</h4>
              
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <LinkPreview
                    href={`mailto:${personal.email}`}
                    className="contact-link"
                    placement="right"
                  >
                    {personal.email}
                  </LinkPreview>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">💼</span>
                  <LinkPreview
                    href={personal.linkedin}
                    className="contact-link"
                  >
                    LinkedIn Profile
                  </LinkPreview>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">🐙</span>
                  <LinkPreview
                    href={personal.github}
                    className="contact-link"
                  >
                    GitHub Profile
                  </LinkPreview>
                </div>
              </div>
              
              <div className="resume-download">
                <button 
                  className="download-resume-btn"
                  onClick={handleOpenDrawer}
                  aria-label="Preview and download resume"
                >
                  <span className="download-icon">📄</span>
                  Preview Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResumePreviewDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        resumeUrl={personal.resumeUrl}
      />
    </div>
  );
};

export default AboutSection;