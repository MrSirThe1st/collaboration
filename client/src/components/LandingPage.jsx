import { motion } from "framer-motion";
import { BackgroundBeams } from "./ui/BackgroundBeams";
import { SparklesCore } from "./ui/SparklesCore";
import { TypewriterEffect } from "./ui/TypewriterEffect";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { DotPattern } from "./ui/DotPattern";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Footer from "./shared/Footer";
import { Button } from "./ui/button";
import {
  Rocket,
  Brain,
  Target,
  GitMerge,
  MessageSquare,
  Globe,
  Layout,
  Shield,
  ChevronDown,
  Menu,
} from "lucide-react";

const TAGLINES = [
  "Where Innovation Meets Collaboration",
  "Building the Future, Together",
  "Connect. Create. Conquer.",
];

const UPCOMING_FEATURES = [
  {
    title: "Global Talent Network",
    description:
      "Connect with skilled people from around the world. Build your dream team without boundaries.",
    icon: <Brain className="h-5 w-5 md:h-6 md:w-6" />,
  },
  {
    title: "Project Analytics",
    description:
      "Insights into your project performance and team collaboration",
    icon: <Target className="h-5 w-5 md:h-6 md:w-6" />,
  },
  {
    title: "Project Success",
    description:
      "From ideation to launch, get the support and resources you need to bring your projects to life.",
    icon: <GitMerge className="h-5 w-5 md:h-6 md:w-6" />,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Work seamlessly with your team using our integrated tools for communication and project management.",
    icon: <Layout className="h-5 w-5 md:h-6 md:w-6" />,
  },
];

const LandingPage = () => {
  const words = [
    {
      text: "Build",
      className: "text-primary",
    },
    {
      text: "something",
    },
    {
      text: "amazing",
      className: "text-primary",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Responsive Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/50 border-b border-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo or App go here */}
            <div className="flex items-center">
              <span className="font-bold text-xl">LOGO</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-2">
              <Link to="/login">
                <Button variant="outline" className="font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="font-semibold">Sign up</Button>
              </Link>
            </div>

            {/* Mobile Navigation - Compact buttons */}
            <div className="md:hidden flex gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="font-semibold text-sm px-3 py-1 h-8"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="font-semibold text-sm px-3 py-1 h-8">
                  Join
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 md:pt-0">
        <BackgroundBeams />
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={50}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto mt-16 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 md:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-6">
              <span className="text-primary">Build</span> something{" "}
              <span className="text-primary">amazing</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light">
              {TAGLINES[0]}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 px-2"
          >
            We're revolutionizing how people collaborate on projects. Find your
            perfect team, build amazing things, and grow together in a
            supportive community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-6 sm:px-0"
          >
            <Link to="/signup">
              {" "}
              <Button size="lg" className="font-semibold text-base md:text-lg">
                Get Started
              </Button>
            </Link>

            {/* <Button
              size="lg"
              variant="outline"
              className="font-semibold text-base md:text-lg mt-3 sm:mt-0"
            >
              Explore Projects
            </Button> */}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <div className="animate-bounce">
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </motion.div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <DotPattern className="opacity-30" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Thank You, Early Adopters!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              We're building a platform where developers can find their dream
              teams, work on exciting projects, and grow their careers together.
              Our goal is to remove the barriers between great ideas and their
              execution.
            </p>
          </div>

          {/* Statistics - Responsive grid */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
            {[
              { number: "500+", label: "Active Projects" },
              { number: "2,000+", label: "Developers" },
              { number: "50+", label: "Countries" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 md:p-6 rounded-xl bg-card"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1 md:mb-2">
                  {stat.number}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative">
        <DotPattern className="opacity-20" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Why choose us
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience a new way of building software with tools and features
              designed to make collaboration seamless and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {UPCOMING_FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 md:p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Adopters Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-black/10 relative overflow-hidden">
        <BackgroundBeams className="opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Thank You!
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
              Be part of our journey from the beginning. Your support and
              feedback are invaluable in shaping the future of our platform.
              We're committed to building something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="default" className="text-base">
                  Sign Up Now
                </Button>
              </Link>

              {/* <Button
                size="lg"
                variant="outline"
                className="text-base mt-3 sm:mt-0"
              >
                Learn About Benefits
              </Button> */}
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
