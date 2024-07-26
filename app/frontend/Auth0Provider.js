import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-1wzrc3nphnk4w01y.ca.auth0.com"
    clientId="zUtm0FsUWaknfcSxpx3cyhFHNjIuVpoI"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://localhost:3000/api",
      scope: "read:current_user update:current_user_metadata"
    }}
  >
    <App />
  </Auth0Provider>
);