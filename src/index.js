//Importing core React libraries
import React from 'react';
import ReactDOM from 'react-dom/client'; // Note: Using modern React 18+ client API
// Importing the main App component
import App from './App';
// CSS imports for styling
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome icons
import 'bootstrap/dist/js/bootstrap.bundle'  // Bootstrap JavaScript (for components like modals, tooltips)

// Creating the root element using React 18's new root API
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);