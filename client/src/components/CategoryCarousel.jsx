import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { PROFESSIONS } from "@/data/professions";

const CategoryCarousel = () => {
  const navigate = useNavigate();

  const navigateToCategory = (query) => {
    navigate(`/profession/${query}`);
  };

  return (
    <div>
      <Carousel className="w-full max-w-xl mx-auto my-20">
        <CarouselContent>
          {PROFESSIONS.map((cat, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg-basis-1/3">
              <Button
                onClick={() => navigateToCategory(cat)}
                variant="outline"
                className="w-full max-w-sm"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
