import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        async function handleLogout() {
            try {
                const response = await fetch('api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    navigate('/');
                } else {
                    console.error('Logout failed:', data.message);
                }  
            } catch (error) {
                console.error('Error:', error);
            }
        }

        handleLogout();
    }, [navigate]);

    return (
        <div>
            <h2>Logging out</h2>
        </div>
    );
}
