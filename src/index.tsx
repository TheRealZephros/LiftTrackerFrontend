import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routes/Routes';

// Ensure the hover portal div exists in the DOM
const portalDivId = 'hover-portal';
let portalDiv = document.getElementById(portalDivId);
if (!portalDiv) {
  portalDiv = document.createElement('div');
  portalDiv.id = portalDivId;
  document.body.appendChild(portalDiv);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Optional: performance reporting
reportWebVitals();
