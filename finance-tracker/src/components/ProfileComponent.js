// src/components/ProfileComponent.js
import React from 'react';

const ProfileComponent = ({ user }) => {
    return (
        <div>
            <h1>Profile for {user.username}</h1>
            <p>Email: {user.email}</p>
            {/* Other user info... */}
        </div>
    );
};

export default ProfileComponent;