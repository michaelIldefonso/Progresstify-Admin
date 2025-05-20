import { createRoot } from 'react-dom/client';
import './index.css'; // Tailwind CSS styles
import AppRoutes from './routes'; // Import AppRoutes

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <AppRoutes />
  );
} else {
  console.error("Root element not found!");
}
