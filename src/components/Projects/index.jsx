import React from 'react';
import portfolioData from '@data/portfolioData.json';
import './Projects.css';

const projects = portfolioData.projects;

const Projects = () => {
  return (
    <div className="projects-section">
      <div className="projects-container">
        <h1 className="section-title">Projects & Portfolio</h1>
        <p className="section-subtitle">
          A showcase of my professional projects and technical contributions across different organizations
        </p>
        
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <div className="project-icon">{project.icon}</div>
                <div className="project-meta">
                  <span className="project-company">{project.company}</span>
                  <span className="project-year">{project.year}</span>
                </div>
              </div>
              
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              
              <div className="project-features">
                <h4>Key Features:</h4>
                <ul>
                  {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="project-technologies">
                <h4>Technologies Used:</h4>
                <div className="tech-tags">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
              
              <div className="project-footer">
                <span className={`project-status ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="projects-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-number">6+</span>
              <span className="stat-label">Major Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Technologies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
