import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const Category = () => {
  const { profession } = useParams();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUsers = async () => {
      console.log(`Fetching users for profession: ${profession}`);
      try {
        const response = await axios.get(
          `${USER_API_END_POINT}/users/profession/${profession}`
        );
        console.log("Response:", response);
        console.log("Users:", response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching users"
        );
      }
    };
    fetchUsers();
  }, [profession]);

  const handleUserClick = (user) => {
    navigate(`/user/${user._id}`, { state: { user } }); 
  };

  return (
    <div>
      <div className="container mx-auto my-10">
        <h2 className="text-3xl font-bold mb-6">{profession}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-4 border rounded cursor-pointer"
              onClick={() => handleUserClick(user)} // Handle user click
            >
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
              <div className="flex justify-center mt-4">
                {/* Add buttons or links for contacting or viewing more details */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
