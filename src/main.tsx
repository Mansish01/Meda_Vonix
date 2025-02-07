import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App';
import React from 'react';

const clientId: string = "696174744814-m5gqshccgb2skk1g7rm3r5d9fuig726u.apps.googleusercontent.com";

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
