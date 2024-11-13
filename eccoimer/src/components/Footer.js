import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#001F3F] text-white py-12">
        <div className="col-span-4 md:col-span-1 text-center md:text-left flex justify-between mx-14">
          <p className="mb-4">Get connected with us on social networks:</p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#"><i className="fab fa-facebook fa-lg"></i></a>
            <a href="#"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="#"><i className="fab fa-google fa-lg"></i></a>
            <a href="#"><i className="fab fa-instagram fa-lg"></i></a>
          </div>
        </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Social Media and Footer Heading */}
        

        {/* Restorex Information */}
        <div>
          <h3 className="text-lg font-bold">RESTOREX</h3>
          <p className="mt-2">When restoration meets innovation. Get connected with Restorex, a project by RGC.</p>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-bold">RESTOREX SUPPORT</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Start Selling</a></li>
            <li><a href="#" className="hover:underline">Our Blogs</a></li>
          </ul>
        </div>

        {/* Know Us Links */}
        <div>
          <h3 className="text-lg font-bold">KNOW US</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Term & Conditions</a></li>
            <li><a href="#" className="hover:underline">Services & Policies</a></li>
            <li><a href="#" className="hover:underline">Help & Support</a></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold">CONTACT</h3>
          <ul className="mt-2 space-y-2">
            <li>Lahore, Pakistan</li>
            <li><a href="mailto:ceo@restorex.com" className="hover:underline">ceo@restorex.com</a></li>
            <li>+92 318 710 1450</li>
            <li>+111 318 710 1450</li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center">
        <p>Copyright by Restorex 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
