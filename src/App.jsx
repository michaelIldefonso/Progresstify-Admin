import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';

function App() {
  return (
    <Router>
      <div>
        {/* Add any global layout components like header, footer, or sidebar here */}
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;