import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Calendar, ChevronLeft, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import HeroImage1 from '../assets/Gemini_Generated_Image_ds77tjds77tjds77.png'
import HeroImage2 from '../assets/Gemini_Generated_Image_j44de9j44de9j44d.png';
import HeroImage3 from '../assets/Gemini_Generated_Image_k4t3pqk4t3pqk4t3.png';
import HeroImage4 from '../assets/Gemini_Generated_Image_xdv7jexdv7jexdv7.png';

// Carousel Component (Keep this as is)
const Carousel = ({ items, type = "hero" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (type === 'hero') {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, type]);

  return (
    <div className={`relative overflow-hidden group ${type === 'hero' ? 'h-[400px] md:h-[550px]' : 'h-auto py-8'}`}>
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full flex items-center justify-center bg-gray-100 relative">
            {type === 'hero' ? (
              <img src={item.image} alt="Slide" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full px-4 flex justify-center">
                 <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center border-t-4 border-accent">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{item.course}</p>
                    <div className="text-3xl font-black text-accent">{item.percentage}%</div>
                 </div>
               </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary">
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentIndex(idx)} className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-accent' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const heroImages = [
    { image: HeroImage1 },
    { image: HeroImage2 },
    { image: HeroImage3 },
    { image: HeroImage4}
  ];

  const toppers = [
    { name: "Rahul Sharma", percentage: "98.5", course: "Computer Science", image: "https://placehold.co/150x150/png?text=Rahul" },
    { name: "Priya Patel", percentage: "97.2", course: "Information Tech", image: "https://placehold.co/150x150/png?text=Priya" },
    { name: "Amit Kumar", percentage: "96.8", course: "Data Science", image: "https://placehold.co/150x150/png?text=Amit" },
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Carousel */}
      <Carousel items={heroImages} type="hero" />

      {/* 2. Contest & About Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Trophy size={150} />
             </div>
             <h2 className="text-3xl font-bold mb-4 flex items-center gap-2"><Trophy className="text-accent" /> Mega Scholarship Contest</h2>
             <p className="mb-8 text-blue-100 leading-relaxed">
               Participate in our annual scholarship test and win up to 100% scholarship on our premium courses. Prove your merit and secure your future.
             </p>
             <button className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1">
               Apply Now
             </button>
          </div>

          <div className="flex flex-col justify-center">
            <h4 className="text-accent font-bold uppercase tracking-wider mb-2">Who We Are</h4>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About <span className="text-primary">Smart Institute</span></h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We are a premier educational institution committed to transforming lives through technology and innovation. Our mission is to provide world-class education that empowers students to achieve their dreams. With state-of-the-art facilities and expert faculty, we nurture talent and build careers.
            </p>
            <div>
              <button className="text-primary font-bold hover:text-blue-700 flex items-center gap-2 border-b-2 border-primary pb-1">
                Read More <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Contact (Inquiry Form) */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-primary p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4">Quick Contact</h3>
                <p className="text-blue-100 text-sm mb-6">Have questions? Fill out the form and our team will get back to you within 24 hours.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm"><Phone size={16} /> +91-96017-49300</div>
                <div className="flex items-center gap-3 text-sm"><Mail size={16} /> info@smartinstitute.co.in</div>
                <div className="flex items-start gap-3 text-sm"><MapPin size={16} className="mt-1" /> Surat, Gujarat</div>
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Create Inquiry</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                  <input type="tel" placeholder="Mobile Number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-gray-500">
                  <option>Select Course Interest</option>
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>Digital Marketing</option>
                </select>
                <textarea rows="3" placeholder="Your Message" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
                <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Our Toppers */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our <span className="text-accent">Toppers</span></h2>
          <p className="text-gray-500 mb-10 max-w-2xl mx-auto">Celebrating the academic excellence and hard work of our brilliant students.</p>
          <Carousel items={toppers} type="topper" />
        </div>
      </div>

      {/* 5. Latest News */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
             <div>
               <h2 className="text-3xl font-bold text-gray-900">Latest <span className="text-primary">News</span></h2>
               <p className="text-gray-500 mt-2">Updates from the campus</p>
             </div>
             <button className="text-primary font-semibold hover:underline">View All News</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                   <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded">NEW</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                    <Calendar size={12} /> <span>Jan 4, 2026</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Annual Tech Fest 2026 Announced</h3>
                  <p className="text-gray-500 text-sm mb-4">Get ready for the biggest technology festival of the year...</p>
                  <a href="#" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Read full story <ArrowRight size={14}/></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;