import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './frontend/App'
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
);