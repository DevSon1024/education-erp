import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Phone, Mail, Facebook, Twitter, Instagram, Linkedin, 
  LogIn, UserPlus, ChevronLeft, ChevronRight, MapPin, 
  Star, Trophy, Calendar, ArrowRight, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import logo from assets
import logoImage from '../assets/logo2.png';
import HeroImage1 from '../assets/Gemini_Generated_Image_ds77tjds77tjds77.png'

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    'About Us', 'Course', 'Facilities', 'Gallery', 
    'Why This Institute', 'Franchise', 'Contact', 'Blog', 'Feedback'
  ];

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 w-full justify-center">
            {menuItems.map((item, index) => (
              <a 
                key={index} 
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 hover:text-accent transition-colors rounded-md uppercase tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-primary border-t border-blue-800 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {menuItems.map((item, index) => (
                <a key={index} href="#" className="block py-2 text-sm hover:text-accent border-b border-blue-800 last:border-0">
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Carousel = ({ items, type = "hero" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  // Auto-slide for hero
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
               // Student Topper Card
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

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary">
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-accent' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  const heroImages = [
    { image: HeroImage1 },
    { image: "https://placehold.co/1920x600/f59e0b/white?text=Smart+Campus+Facilities" },
    { image: "https://placehold.co/1920x600/10b981/white?text=Excellence+in+Teaching" },
  ];

  const toppers = [
    { name: "Rahul Sharma", percentage: "98.5", course: "Computer Science", image: "https://placehold.co/150x150/png?text=Rahul" },
    { name: "Priya Patel", percentage: "97.2", course: "Information Tech", image: "https://placehold.co/150x150/png?text=Priya" },
    { name: "Amit Kumar", percentage: "96.8", course: "Data Science", image: "https://placehold.co/150x150/png?text=Amit" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* 1. Slim Top Header */}
      <div className="bg-gray-900 text-gray-300 py-1.5 text-xs">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={12} /> +91-96017-49300</span>
            <span className="flex items-center gap-1"><Mail size={12} /> info@smartinstitute.co.in</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 pr-4 border-r border-gray-700">
              <Facebook size={14} className="hover:text-blue-500 cursor-pointer" />
              <Twitter size={14} className="hover:text-sky-400 cursor-pointer" />
              <Instagram size={14} className="hover:text-pink-500 cursor-pointer" />
              <Linkedin size={14} className="hover:text-blue-700 cursor-pointer" />
            </div>
            <div className="flex gap-3 font-semibold">
              {user ? (
                 <Link to="/home" className="flex items-center gap-1 hover:text-white text-accent">
                   Dashboard <ArrowRight size={12} />
                 </Link>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-1 hover:text-white"><LogIn size={12} /> Login</Link>
                  <Link to="/register" className="flex items-center gap-1 hover:text-white"><UserPlus size={12} /> Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Logo & Branding */}
      <div className="bg-white py-4 shadow-sm relative z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
             {/* Logo Image */}
             <img 
               src={logoImage} 
               alt="Smart Institute Logo" 
               className="h-16 w-auto object-contain"
             />
             {/* Slogan with Mirror Effect */}
             <div className="relative">
                <p className="text-base md:text-lg text-accent font-bold tracking-wide uppercase" 
                   style={{
                     background: 'linear-gradient(180deg, #f59e0b 60%, transparent 60%)',
                     WebkitBackgroundClip: 'text',
                    //  WebkitTextFillColor: 'transparent',
                     backgroundClip: 'text'
                   }}>
                  सपने जो SMART बना दे
                </p>
                {/* Mirror Reflection */}
                <p className="text-base md:text-lg font-bold tracking-wide uppercase absolute top-full left-0 opacity-30 blur-[1px]"
                   style={{
                     transform: 'scaleY(-1)',
                     background: 'linear-gradient(0deg, #f59e0b 0%, transparent 100%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     backgroundClip: 'text'
                   }}>
                  सपने जो SMART बना दे
                </p>
             </div>
           </div>
        </div>
      </div>

      {/* 3. Public Navbar */}
      <PublicNavbar />

      {/* 4. Hero Carousel */}
      <Carousel items={heroImages} type="hero" />

      {/* 5. Contest & About Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contest Section */}
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

          {/* About Section */}
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

      {/* 6. Quick Contact (Inquiry Form) */}
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

      {/* 7. Our Toppers */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our <span className="text-accent">Toppers</span></h2>
          <p className="text-gray-500 mb-10 max-w-2xl mx-auto">Celebrating the academic excellence and hard work of our brilliant students.</p>
          <Carousel items={toppers} type="topper" />
        </div>
      </div>

      {/* 8. Latest News (Placeholder) */}
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

      {/* 9. Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Disclaimer & Logo */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src={logoImage} alt="Smart Institute Logo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Disclaimer Smart Institute © 2026 Developed by Smart Institute Team All Logos / Characters are the Property of their Respective Organisation.
              </p>
              <div className="flex gap-4">
                 <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors"><Facebook size={18} /></a>
                 <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-sky-400 transition-colors"><Twitter size={18} /></a>
                 <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-accent pl-3">Navigation</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Gallery</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>

             {/* Why SMART */}
             <div>
              <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-accent pl-3">Why SMART?</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Expert Faculty</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Digital Classrooms</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">100% Placement</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Practical Learning</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-accent pl-3">Contact Us</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-accent shrink-0" />
                  <span>1st & 2nd Floor, 50-kubernagar, Opp. Baba Baijnath Mandir, Nilgiri Road, Ass-Pass Circle, Godadra Surat - 395010</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-accent shrink-0" />
                  <span>+91-96017-49300</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-accent shrink-0" />
                  <span>info@smartinstitute.co.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
             Copyright © 2013 - 2026 Smart Institute. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
