import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../features/master/masterSlice';
import { 
  Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube,
  LogIn, UserPlus, ArrowRight, Menu, X, MapPin, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../../assets/logo2.png';

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // For Mobile
  const [hoverDropdown, setHoverDropdown] = useState(null); // For Desktop
  const location = useLocation(); // Hook to get current location
  const dispatch = useDispatch();

  // Fetch courses for dynamic dropdown
  const { courses, isLoading } = useSelector((state) => state.master);

  useEffect(() => {
    if (courses.length === 0 && !isLoading) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length, isLoading]);
  
  // Extract unique Course Types
  const courseTypes = [...new Set(courses.map(course => course.courseType))].filter(Boolean);

  const menuItems = [
    { name: 'Home', path: '/' },
    { 
      name: 'About Us', 
      isDropdown: true,
      subItems: [
        { name: 'About Smart', path: '/about-us#smart' },
        { name: 'Mission', path: '/about-us#mission' },
        { name: 'Vision', path: '/about-us#vision' },
      ]
    },
    { name: 'Why Smart', path: '/why-smart' },
    { 
      name: 'Course', 
      isDropdown: true, 
      isDynamic: true, // Marker for dynamic course types
      subItems: courseTypes.map(type => ({ 
        name: type, 
        path: `/course?type=${type}` 
      }))
    },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Franchise', path: '/franchise' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
    { name: 'Feedback', path: '/feedback' }
  ];

  // Helper to determine if a path is active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  // Helper to determine if a dropdown parent should be active
  const isDropdownActive = (subItems) => {
    return subItems.some(sub => {
       const cleanPath = sub.path.split('#')[0].split('?')[0];
       return location.pathname === cleanPath || (cleanPath !== '/' && location.pathname.startsWith(cleanPath));
    });
  };

  return (
    <nav className="bg-primary/95 backdrop-blur-md text-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
           {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center w-full gap-1">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group"
                   onMouseEnter={() => setHoverDropdown(index)}
                   onMouseLeave={() => setHoverDropdown(null)}
              >
                  {item.isDropdown ? (
                      <div>
                          <button className={`flex items-center gap-1 px-5 py-2 text-sm font-bold uppercase tracking-wider hover:bg-white/10 hover:text-accent transition-all rounded-md ${isDropdownActive(item.subItems) ? 'text-accent' : ''}`}>
                              {item.name} <ChevronDown size={14} />
                          </button>
                          
                          {/* Desktop Dropdown Content */}
                          <AnimatePresence>
                              {hoverDropdown === index && (
                                  <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute left-0 mt-0 w-56 bg-white text-gray-800 shadow-xl rounded-md overflow-hidden border-t-4 border-accent"
                                  >
                                      {item.subItems.map((sub, subIdx) => (
                                          <Link 
                                            key={subIdx} 
                                            to={sub.path} 
                                            className={`block px-6 py-3 text-sm font-semibold hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100 last:border-0 ${location.pathname === sub.path.split('#')[0].split('?')[0] ? 'text-primary bg-blue-50' : ''}`}
                                          >
                                              {sub.name}
                                          </Link>
                                      ))}
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>
                  ) : (
                      <Link to={item.path}
                          className={`px-5 py-2 text-sm font-bold uppercase tracking-wider hover:bg-white/10 hover:text-accent transition-all rounded-md ${isActive(item.path) ? 'text-accent' : ''}`}
                      >
                          {item.name}
                      </Link>
                  )}
              </div>
            ))}
          </div>
          
           {/* Mobile Right Spacer (optional balance) */}
           <div className="md:hidden w-10"></div> 
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-primary border-t border-blue-800 overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col p-4 space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                    {item.isDropdown ? (
                        <div>
                            <button 
                                onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold border-b border-blue-800/30 hover:bg-white/5 hover:text-accent rounded-lg transition-colors ${isDropdownActive(item.subItems) ? 'text-accent' : 'text-white'}`}
                            >
                                {item.name}
                                <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : ''}`}/>
                            </button>
                            <AnimatePresence>
                                {activeDropdown === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-blue-900/50 rounded-b-lg overflow-hidden"
                                    >
                                        {item.subItems.map((sub, subIdx) => (
                                            <Link 
                                                key={subIdx} 
                                                to={sub.path} 
                                                className={`block px-8 py-3 text-sm border-b border-blue-800/30 hover:text-white hover:bg-blue-800 transition-colors ${location.pathname === sub.path.split('#')[0].split('?')[0] ? 'text-accent font-bold' : 'text-blue-100'}`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to={item.path} className={`block px-4 py-3 text-sm font-bold border-b border-blue-800/30 hover:bg-white/5 hover:text-accent rounded-lg transition-colors ${isActive(item.path) ? 'text-accent' : 'text-white'}`} onClick={() => setIsOpen(false)}>
                            {item.name}
                        </Link>
                    )}
                </div>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 mt-2 border-t border-blue-800/50 grid grid-cols-1 gap-3"> {/* Changed grid-cols-2 to grid-cols-1 since one btn is hidden */}
                  <Link to="/login" className="flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-semibold" onClick={() => setIsOpen(false)}>
                      <LogIn size={18} /> Login
                  </Link>
                  {/* <Link to="/register" className="flex items-center justify-center gap-2 bg-accent hover:bg-orange-600 text-white py-3 rounded-lg transition-colors font-semibold" onClick={() => setIsOpen(false)}>
                      <UserPlus size={18} /> Register
                  </Link> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PublicLayout = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* 1. Slim Top Header */}
      <div className="bg-gray-900 text-gray-300 py-2 text-xs border-b border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Contact Info - Visible on Mobile & Desktop */}
          <div className="flex items-center justify-center w-full md:w-auto gap-4 md:gap-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors"><Phone size={14} className="text-accent" /> <span className="hidden sm:inline">+91-96017-49300</span><span className="sm:hidden">Call Us</span></span>
            <span className="flex items-center gap-2 hover:text-white transition-colors"><Mail size={14} className="text-accent" /> <span className="hidden sm:inline">info@smartinstitute.co.in</span><span className="sm:hidden">Email Us</span></span>
          </div>

          {/* Social & Auth - Hidden on Mobile, Visible on Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-4 pr-6 border-r border-gray-700">
              <a href="https://www.facebook.com/smartinstituteindia" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 cursor-pointer transition-transform hover:scale-110">
                <Facebook size={16} />
              </a>
              <a href="#" className="hover:text-sky-400 cursor-pointer transition-transform hover:scale-110">
                <span className="font-bold text-xs" style={{ fontFamily: 'sans-serif' }}>X</span>
              </a>
              <a href="#" className="hover:text-pink-500 cursor-pointer transition-transform hover:scale-110">
                <Instagram size={16} />
              </a>
              <a href="https://www.youtube.com/channel/UCFfLzGu6VS4gOTZkJRtmfkg" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 cursor-pointer transition-transform hover:scale-110">
                <Youtube size={16} />
              </a>
            </div>
            <div className="flex gap-4 font-bold tracking-wide">
              {user ? (
                 <Link to="/home" className="flex items-center gap-2 hover:text-accent transition-colors">
                   DASHBOARD <ArrowRight size={14} />
                 </Link>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-1 hover:text-white transition-colors"><LogIn size={16} /> LOGIN</Link>
                  {/* <Link to="/register" className="flex items-center gap-1 hover:text-white transition-colors"><UserPlus size={16} /> REGISTER</Link> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Logo & Branding */}
      <div className="bg-white/90 backdrop-blur-sm py-4 shadow-sm relative z-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             {/* Logo */}
             <div className="flex-shrink-0">
                <Link to="/">
                    <img src={logoImage} alt="Smart Institute Logo" className="h-20 md:h-24 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300" />
                </Link>
             </div>
             
             {/* Centered Slogan with Mirror Effect */}
             <div className="flex-grow flex justify-center items-center py-2 overflow-hidden">
                <h3 className="text-xl sm:text-2xl md:text-4xl font-black tracking-normal md:tracking-wider text-center drop-shadow-sm filter whitespace-nowrap"
                    style={{ 
                        fontFamily: "system-ui, -apple-system, sans-serif",
                    }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-blue-800">सपने जो </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-orange-500 via-red-500 to-pink-500 text-2xl sm:text-4xl md:text-5xl inline-block transform hover:scale-110 transition-transform duration-300 mx-1 filter drop-shadow-md" style={{ fontFamily: "'Arial Black', sans-serif" }}>SMART</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-blue-800"> बना दे</span>
                </h3>
             </div>

             {/* Right Side Spacer/Visual (Optional, keeps Logo left and Slogan center-ish) */}
             <div className="hidden md:block w-32">
                 {/* Placeholder or Call to Action could go here */}
             </div>
           </div>
        </div>
      </div>

      {/* 3. Public Navbar */}
      <PublicNavbar />

      {/* 4. Main Page Content */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* 5. Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-accent mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src={logoImage} alt="Smart Institute Logo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Disclaimer Smart Institute © 2026 Developed by Smart Institute Team All Logos / Characters are the Property of their Respective Organisation.
              </p>
              <div className="flex gap-4">
                 <a href="https://www.facebook.com/smartinstituteindia" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors"><Facebook size={18} /></a>
                 <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-sky-400 transition-colors flex items-center justify-center font-bold text-white w-[34px] h-[34px]">X</a>
                 <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-500 transition-colors"><Instagram size={18} /></a>
                 <a href="https://www.youtube.com/channel/UCFfLzGu6VS4gOTZkJRtmfkg" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors"><Youtube size={18} /></a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-accent pl-3">Navigation</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link to="/about-us" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link to="/course" className="hover:text-accent transition-colors">Courses</Link></li>
                <li><Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              </ul>
            </div>

             <div>
              <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-accent pl-3">Why SMART?</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Expert Faculty</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Digital Classrooms</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">100% Placement</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Practical Learning</a></li>
              </ul>
            </div>

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

export default PublicLayout;