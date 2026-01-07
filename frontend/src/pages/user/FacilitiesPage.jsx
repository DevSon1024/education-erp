import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Wifi, Monitor, Coffee, Car, Shield, Users, BookOpen,
  Award, Clock, Dumbbell, Gamepad2, Pizza, Home, Zap, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';

const FacilitiesPage = () => {
  const facilities = [
    {
      icon: <Monitor className="text-accent" size={32} />,
      title: 'Computer Labs',
      description: 'State-of-the-art computer labs with latest hardware and software',
      features: ['High-speed internet', 'Latest software', '24/7 access', 'Technical support'],
      image: 'https://placehold.co/400x300/png?text=Computer+Labs'
    },
    {
      icon: <Wifi className="text-accent" size={32} />,
      title: 'Wi-Fi Campus',
      description: 'High-speed Wi-Fi connectivity throughout the campus',
      features: ['24/7 connectivity', 'High-speed internet', 'Secure network', 'Multiple access points'],
      image: 'https://placehold.co/400x300/png?text=Wi-Fi+Campus'
    },
    {
      icon: <BookOpen className="text-accent" size={32} />,
      title: 'Digital Library',
      description: 'Modern library with digital resources and study materials',
      features: ['E-books collection', 'Online journals', 'Study spaces', 'Research databases'],
      image: 'https://placehold.co/400x300/png?text=Digital+Library'
    },
    {
      icon: <Users className="text-accent" size={32} />,
      title: 'Smart Classrooms',
      description: 'Interactive classrooms with modern teaching aids',
      features: ['Projectors', 'Smart boards', 'Audio systems', 'Video conferencing'],
      image: 'https://placehold.co/400x300/png?text=Smart+Classrooms'
    },
    {
      icon: <Coffee className="text-accent" size={32} />,
      title: 'Cafeteria',
      description: 'Hygienic and spacious cafeteria with variety of food options',
      features: ['Multi-cuisine food', 'Hygienic environment', 'Seating capacity 200+', 'Affordable prices'],
      image: 'https://placehold.co/400x300/png?text=Cafeteria'
    },
    {
      icon: <Car className="text-accent" size={32} />,
      title: 'Parking Facility',
      description: 'Secure parking for students and faculty',
      features: ['Covered parking', '24/7 security', 'CCTV surveillance', 'Ample space'],
      image: 'https://placehold.co/400x300/png?text=Parking+Facility'
    }
  ];

  const additionalFacilities = [
    {
      icon: <Dumbbell className="text-accent" size={24} />,
      title: 'Gym & Fitness Center',
      description: 'Modern gym equipment and fitness programs'
    },
    {
      icon: <Gamepad2 className="text-accent" size={24} />,
      title: 'Game Zone',
      description: 'Indoor games and recreational activities'
    },
    {
      icon: <Shield className="text-accent" size={24} />,
      title: '24/7 Security',
      description: 'Round-the-clock security and surveillance'
    },
    {
      icon: <Zap className="text-accent" size={24} />,
      title: 'Power Backup',
      description: 'Uninterrupted power supply with backup generators'
    },
    {
      icon: <Pizza className="text-accent" size={24} />,
      title: 'Food Court',
      description: 'Multiple food options and snacks'
    },
    {
      icon: <Home className="text-accent" size={24} />,
      title: 'Hostel Facility',
      description: 'Comfortable accommodation for outstation students'
    }
  ];

  const campusHighlights = [
    { number: '50+', label: 'Classrooms' },
    { number: '10', label: 'Computer Labs' },
    { number: '500+', label: 'Systems' },
    { number: '24/7', label: 'Power & Internet' }
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
              <Link to="/login" className="flex items-center gap-1 hover:text-white">Login</Link>
              <Link to="/register" className="flex items-center gap-1 hover:text-white">Register</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Logo & Branding */}
      <div className="bg-white py-4 shadow-sm relative z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <img src={logoImage} alt="Smart Institute Logo" className="h-16 w-auto object-contain" />
             <div className="relative">
                <center><h3 className="text-base md:text-lg text-accent font-bold tracking-wide uppercase">सपने जो SMART बना दे</h3></center>
             </div>
           </div>
        </div>
      </div>

      {/* 3. Navigation */}
      <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-14">
            <div className="hidden md:flex space-x-1">
              {['Home', 'About Us', 'Course', 'Facilities', 'Gallery', 'Franchise', 'Contact', 'Blog', 'Feedback'].map((item, index) => (
                <Link 
                  key={index} 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s/g, '-')}`}
                  className="px-4 py-2 text-sm font-medium hover:bg-white/10 hover:text-accent transition-colors rounded-md uppercase tracking-wide"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Hero Section */}
      <div className="relative bg-gradient-to-br from-primary to-blue-800 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our <span className="text-accent">Facilities</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              World-class infrastructure and amenities for an exceptional learning experience
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Campus Highlights */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Campus <span className="text-primary">Highlights</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Numbers that showcase our infrastructure strength</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {campusHighlights.map((highlight, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{highlight.number}</div>
                <div className="text-gray-600">{highlight.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Main Facilities */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium <span className="text-primary">Facilities</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">State-of-the-art infrastructure designed for excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={facility.image} alt={facility.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    {facility.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{facility.title}</h3>
                  <p className="text-gray-600 mb-4">{facility.description}</p>
                  <div className="space-y-2">
                    {facility.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Additional Facilities */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Additional <span className="text-primary">Amenities</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">More facilities to enhance your learning experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFacilities.map((facility, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {facility.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{facility.title}</h3>
                    <p className="text-gray-600 text-sm">{facility.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Infrastructure Features */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Infrastructure <span className="text-accent">Excellence</span></h2>
            <p className="text-blue-100 max-w-2xl mx-auto">Features that make our campus stand out</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <Globe className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Modern Architecture</h3>
              <p className="text-blue-100">Contemporary building design with spacious classrooms and corridors</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <Shield className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Safety First</h3>
              <p className="text-blue-100">Fire safety systems, emergency exits, and first aid facilities</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <Zap className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">Eco-Friendly</h3>
              <p className="text-blue-100">Green campus with solar panels and rainwater harvesting</p>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Virtual Tour CTA */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Monitor size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Take a Virtual <span className="text-accent">Campus Tour</span></h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Explore our world-class facilities from the comfort of your home
              </p>
              <button className="bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2 mx-auto">
                Start Virtual Tour <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 10. Footer */}
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
                <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link to="/about-us" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link to="/course" className="hover:text-accent transition-colors">Courses</Link></li>
                <li><Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
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

export default FacilitiesPage;
