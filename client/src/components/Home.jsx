import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestProjects from "./LatestProjects";
import Footer from "./shared/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllProjects from "@/hooks/useGetAllProjects";

const Home = () => {
  useGetAllProjects();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestProjects />
      <Footer />
    </div>
  );
};

export default Home;
