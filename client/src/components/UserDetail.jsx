import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";

const UserDetail = () => {
  const { state } = useLocation(); // Get the passed state
  const { user } = state; // Extract user from state

  return (
    <div>
      <Navbar />
      <div className="container mx-auto my-10">
        <div className="p-4 border rounded">
          <img
            src={user.profile.profilePhoto}
            alt={user.username}
            className="w-32 h-32 rounded-full mx-auto"
          />
          <h3 className="text-xl font-bold text-center mt-4">
            {user.username}
          </h3>
          <p className="text-center">{user.profession}</p>
          <p className="text-center mt-2">{user.profile.bio}</p>
          {/* Add more user details as needed */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDetail;
