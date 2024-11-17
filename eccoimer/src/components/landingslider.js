import React from 'react';
import img2 from '../assets/images/slider1.jpeg';
import img3 from '../assets/images/slider2.jpeg';
import img4 from '../assets/images/slider3.png';

function LandingSlider() {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <a href="https://example.com/page1" target="_blank" rel="noopener noreferrer">
            <img src={img2} className="d-block w-100" style={{ height: '500px' }} alt="Slide 1" />
            <div className="carousel-caption d-none d-md-block">
              <h5>First Slide</h5>
              <p>Click here to learn more.</p>
            </div>
          </a>
        </div>
        <div className="carousel-item">
          <a href="https://example.com/page2" target="_blank" rel="noopener noreferrer">
            <img src={img3} className="d-block w-100" style={{ height: '500px' }} alt="Slide 2" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Second Slide</h5>
              <p>Discover more details here.</p>
            </div>
          </a>
        </div>
        <div className="carousel-item">
          <a href="https://example.com/page3" target="_blank" rel="noopener noreferrer">
            <img src={img4} className="d-block w-100" style={{ height: '500px' }} alt="Slide 3" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Third Slide</h5>
              <p>Find out more information.</p>
            </div>
          </a>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default LandingSlider;
