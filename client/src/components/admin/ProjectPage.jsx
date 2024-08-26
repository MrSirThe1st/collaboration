import React from "react";
import { useLocation } from "react-router-dom";

const ProjectPage = () => {
  const location = useLocation();
  const { project } = location.state || {};

  if (!project) {
    return <div>No project data available.</div>;
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>Requirements: {project.requirements.join(", ")}</p>
      <p>Max Team Size: {project.maxTeamSize}</p>
      <p>Location: {project.location}</p>
      <p>Created At: {new Date(project.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ProjectPage;
