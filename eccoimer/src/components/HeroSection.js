import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // Correct Swiper imports
import { Pagination, Navigation, Autoplay } from 'swiper/modules'; // Import Autoplay module

// Import required Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay'; // Optional: Autoplay CSS if needed

// Import your images and video
import Sophere from "../assets/images/shophere.png";
import Two from "../assets/images/two.png";
import VideoFile from "../assets/images/vid2.mp4";  // Import the video file from the correct path

// Define the slides, including the video
const HeroSection = () => {
  const slides = [
    {
      id: 1,
      type: 'image',
      content: Sophere,
    },
    {
      id: 2,
      type: 'image',
      content: Two,
    },
    {
      id: 3,
      type: 'video',
      content: VideoFile, // Use the imported video file
    }
  ];

  return (
    <section className="hero-carousel">
      <Swiper
        spaceBetween={30}
        navigation={true} // Show navigation arrows
        pagination={{ clickable: true }} // Enable pagination
        autoplay={{ delay: 3000 }} // Autoplay slides, 1000ms delay between slides
        modules={[Pagination, Navigation, Autoplay]} // Add Autoplay module here
        className="h-[400px] md:h-[600px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {slide.type === 'image' ? (
              // Render image slide
              <div
                className="h-full bg-cover bg-bottom"
                style={{ backgroundImage: `url(${slide.content})` }}
              ></div>
            ) : (
              // Render video slide (autoplay, no controls, muted, and looped)
              <div className="h-full flex justify-center items-center bg-black">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  className="h-full w-full object-cover"
                >
                  <source src={slide.content} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
