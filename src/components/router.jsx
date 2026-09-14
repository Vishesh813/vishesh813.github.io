import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import routeConfig from '@data/routeConfig.json';
import { useRoutes } from '@hooks/useRoutes.js';

// Dynamic component loader
const componentMap = {
  AboutSection: lazy(() => import('@components/AboutSection/index.jsx')),
  EducationSection: lazy(() => import('@components/EducationSection/index.jsx')),
  WorkExperienceSection: lazy(() => import('@components/WorkExperience/index.jsx')),
  Skills: lazy(() => import('@components/Skills/index.jsx')),
  Awards: lazy(() => import('@components/Awards/index.jsx')),
  Projects: lazy(() => import('@components/Projects/index.jsx'))
};

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Dynamic route generator
const generateRoutes = () => {
  return routeConfig.routes.map((route) => {
    const Component = componentMap[route.component];
    
    if (!Component) {
      console.warn(`Component ${route.component} not found in componentMap`);
      return null;
    }

    return (
      <Route
        key={route.id}
        path={route.path}
        element={<Component />}
      />
    );
  }).filter(Boolean);
};

const Routers = () => {
  const location = useLocation();
  const { getCurrentPageTitle } = useRoutes();

  useEffect(() => {
    document.title = getCurrentPageTitle();
  }, [getCurrentPageTitle, location.pathname]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes location={location}>
        {generateRoutes()}
        {/* Catch-all route for any unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default Routers;