import React, { useState, useEffect } from 'react';
import './LiveProjectBadge.css';

const fallbackProjects = [
  "E-Commerce App for UK Client 🛒",
  "AI Dashboard Development 🤖",
  "Real Estate Portal UI/UX 🏡",
  "SEO Optimization for Lead Gen 🚀",
  "Custom CRM Architecture ⚙️"
];

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const LiveProjectBadge = () => {
  const [currentProject, setCurrentProject] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/live-projects`);
        const data = await res.json();
        if (data && data.length > 0) {
          setProjectsData(data);
        } else {
          setProjectsData(fallbackProjects.map(title => ({ title })));
        }
      } catch (err) {
        console.error("Error fetching live projects:", err);
        setProjectsData(fallbackProjects.map(title => ({ title })));
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectsData.length <= 1) return;

    const interval = setInterval(() => {
      setIsFading(true);
      
      setTimeout(() => {
        setCurrentProject((prev) => (prev + 1) % projectsData.length);
        setIsFading(false);
      }, 500); // Wait for fade out
      
    }, 4000); // Change project every 4 seconds

    return () => clearInterval(interval);
  }, [projectsData]);

  if (projectsData.length === 0) return null;

  const activeProject = projectsData[currentProject];

  // If there's a live link or github link, we make the title clickable
  const renderTitle = () => {
    if (activeProject.liveLink) {
      return (
        <a 
          href={activeProject.liveLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="live-project-link"
          title="View Live Deploy"
        >
          {activeProject.title} 🔗
        </a>
      );
    }
    if (activeProject.githubLink) {
      return (
        <a 
          href={activeProject.githubLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="live-project-link"
          title="View on GitHub"
        >
          {activeProject.title} 🔗
        </a>
      );
    }
    return activeProject.title;
  };

  return (
    <div className="live-project-container">
      <div className="live-project-glass">
        <div className="live-indicator">
          <span className="pulse-dot"></span>
        </div>
        <div className="live-content">
          <span className="live-label">Currently Working On:</span>
          <span className={`live-project-title ${isFading ? 'fade-out' : 'fade-in'}`}>
            {renderTitle()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveProjectBadge;
