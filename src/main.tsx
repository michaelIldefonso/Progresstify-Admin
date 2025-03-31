import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Tailwind CSS styles
import AppRoutes from './routes'; // Import AppRoutes

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes /> {/* Ensure AppRoutes is rendered */}
  </StrictMode>
);
