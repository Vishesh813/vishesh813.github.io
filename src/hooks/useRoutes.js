import { useLocation } from 'react-router-dom';
import routeConfig from '@data/routeConfig.json';

export const useRoutes = () => {
  const location = useLocation();

  // Get all routes
  const getAllRoutes = () => routeConfig.routes;

  // Get routes that should show in navigation
  const getNavigationRoutes = () => 
    routeConfig.routes.filter(route => route.showInNav);

  // Get current route info
  const getCurrentRoute = () => 
    routeConfig.routes.find(route => route.path === location.pathname) || 
    routeConfig.routes.find(route => route.isDefault);

  // Get route by path
  const getRouteByPath = (path) => 
    routeConfig.routes.find(route => route.path === path);

  // Get route by id
  const getRouteById = (id) => 
    routeConfig.routes.find(route => route.id === id);

  // Get page title for current route
  const getCurrentPageTitle = () => {
    const currentRoute = getCurrentRoute();
    return currentRoute ? currentRoute.title : 'Portfolio';
  };

  // Get page description for current route
  const getCurrentPageDescription = () => {
    const currentRoute = getCurrentRoute();
    return currentRoute ? currentRoute.description : 'Vishesh Tiwari - Full Stack Java Developer';
  };

  // Check if route exists
  const routeExists = (path) => 
    routeConfig.routes.some(route => route.path === path);

  return {
    getAllRoutes,
    getNavigationRoutes,
    getCurrentRoute,
    getRouteByPath,
    getRouteById,
    getCurrentPageTitle,
    getCurrentPageDescription,
    routeExists,
    routeConfig
  };
};
