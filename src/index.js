import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './frontend/src-frontend/App'
import { GoogleOAuthProvider } from '@react-oauth/google';
import CLIENT_ID from './backend/private/auth.tsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <GoogleOAuthProvider clientId={CLIENT_ID}>
    //     <React.StrictMode>
    //         <App />
    //     </React.StrictMode>
    // </GoogleOAuthProvider>,
    <App/>
);