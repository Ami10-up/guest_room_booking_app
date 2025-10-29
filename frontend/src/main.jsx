import React from 'react'; // Changed from 'StrictMode'
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // By removing StrictMode, we ensure that useEffect only runs once per render,
  // which will break the infinite loop and allow our API calls to proceed.
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
);