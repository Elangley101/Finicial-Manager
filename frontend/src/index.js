import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeContextProvider } from '../src/context/ThemeProviderComponent';
import { LanguageProvider } from '../src/context/LanguageContext';
import StarBackground from './components/StarBackground';  // Import the component here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeContextProvider>
    <LanguageProvider>
      <React.StrictMode>
        {/* <StarBackground />  Add the starry background component here */}
        <Router>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Router>
      </React.StrictMode>
    </LanguageProvider>
  </ThemeContextProvider>
);

reportWebVitals();
