import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently, loginWithPopup } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = 'dev-1wzrc3nphnk4w01y.ca.auth0.com';

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
            prompt: "consent"
          },
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();
        setUserMetadata(user_metadata);
      } catch (e) {
        if (e.error === 'consent_required' || e.error === 'login_required') {
          // Prompt user to login and consent again
          await loginWithPopup({
            authorizationParams: {
              audience: `https://${domain}/api/v2/`,
              scope: "read:current_user",
            },
          });
          getUserMetadata(); // Retry after login
        } else {
          console.error(e.message);
        }
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, loginWithPopup, user?.sub]);

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.Profile}</p>
        <h3>User Metadata</h3>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </div>
    )
  );
};

export default Profile;
