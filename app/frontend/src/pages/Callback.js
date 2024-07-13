// src/pages/Callback/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleSignInCallback } from '@logto/react';

const Callback = () => {
  const navigate = useNavigate();
  const { isLoading } = useHandleSignInCallback(() => {
    // Navigate to root path when finished
    navigate('/');
  });

  // When it's working in progress
  if (isLoading) {
    return <div>Redirecting...</div>;
  }

  return null;
};

export default Callback;
