import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Building, Users, Award, Globe, TrendingUp, Target,
  ChevronDown, Search, PhoneCall, MailIcon, MapPinIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';

const FranchisePage = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFranchise, setShowFranchise] = useState(false);

  const states = [
    'Gujarat', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 
    'Uttar Pradesh', 'Delhi', 'Karnataka', 'Tamil Nadu'
  ];

  const cities = {
    'Gujarat': ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem']
  };

  const franchiseLocations = [
    {
      name: 'Godadara',
      address: '1st & 2nd Floor, 50 Kuber Nagar, Opp. Baba Baijnath Mandir, Nilgiri Road, Aas Pass Circle, Godadara, Surat, Gujarat-395010 (INDIA)',
      phone: '9898830409',
      mobile: '9601749300',
      state: 'Gujarat',
      city: 'Surat'
    },
    {
      name: 'Bhestan',
      address: '309-A, 309-B, 3rd Floor, Sai Square Building, Bhestan Circle, Bhestan Surat Gujarat-395023 (INDIA)',
      phone: '9601749300',
      mobile: '9898830409',
      state: 'Gujarat',
      city: 'Surat'
    }
  ];

  const benefits = [
    {
      icon: <Award className="text-accent" size={32} />,
      title: 'Established Brand',
      description: 'Partner with a trusted name in education with over 10 years of excellence'
    },
    {
      icon: <Users className="text-accent" size={32} />,
      title: 'Training & Support',
      description: 'Comprehensive training programs and ongoing operational support'
    },
    {
      icon: <Globe className="text-accent" size={32} />,
      title: 'Marketing Support',
      description: 'Professional marketing materials and national advertising campaigns'
    },
    {
      icon: <Target className="text-accent" size={32} />,
      title: 'Proven Business Model',
      description: 'Tested and successful business model with high ROI potential'
    },
    {
      icon: <TrendingUp className="text-accent" size={32} />,
      title: 'Growth Potential',
      description: 'Be part of the rapidly growing education sector in India'
    },
    {
      icon: <Building className="text-accent" size={32} />,
      title: 'Infrastructure Support',
      description: 'Guidance for setting up world-class educational infrastructure'
    }
  ];

  const requirements = [
    'Minimum 1000 sq. ft. commercial space',
    'Investment capacity of ₹10-15 Lakhs',
    'Passion for education and student development',
    'Basic business management skills',
    'Team of 3-5 dedicated staff members',
    'Willingness to follow Smart Institute standards'
  ];

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setShowFranchise(false);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    if (selectedState && e.target.value) {
      setShowFranchise(true);
    }
  };

  const filteredFranchises = franchiseLocations.filter(
    franchise => franchise.state === selectedState && franchise.city === selectedCity
  );

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
            <div className="w-20 h-20 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
              <Building size={40} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Franchise <span className="text-accent">Opportunities</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join hands with Smart Institute and be part of our success story
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Franchise Locator */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Our <span className="text-primary">Franchise Centers</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Select your state and city to locate nearby Smart Institute centers</p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select State</label>
                <div className="relative">
                  <select 
                    value={selectedState}
                    onChange={handleStateChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none bg-white"
                  >
                    <option value="">Choose State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
                <div className="relative">
                  <select 
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedState}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none bg-white disabled:bg-gray-100"
                  >
                    <option value="">Choose City</option>
                    {selectedState && cities[selectedState]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            {showFranchise && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {filteredFranchises.length > 0 ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Franchise Centers in {selectedCity}, {selectedState}</h3>
                    {filteredFranchises.map((franchise, index) => (
                      <div key={index} className="bg-gradient-to-r from-primary/5 to-blue-800/5 border border-primary/20 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-primary mb-3">{franchise.name}</h4>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-start gap-3">
                            <MapPinIcon size={18} className="text-accent shrink-0 mt-1" />
                            <span className="text-sm">{franchise.address}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-accent" />
                              <span className="text-sm">Ph: {franchise.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <PhoneCall size={16} className="text-accent" />
                              <span className="text-sm">Mobile: {franchise.mobile}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No franchise centers found in {selectedCity}, {selectedState}</p>
                    <p className="text-gray-400 text-sm mt-2">Be the first to open a Smart Institute franchise in this area!</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Franchise Benefits */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Franchise <span className="text-primary">Benefits</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Why partner with Smart Institute</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Requirements */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Franchise <span className="text-primary">Requirements</span></h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                To become a Smart Institute franchise partner, you need to meet certain criteria that ensure the quality and standards of our brand.
              </p>
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="https://placehold.co/600x400/png?text=Franchise+Opportunity" alt="Franchise Opportunity" className="rounded-2xl shadow-xl" />
              <div className="absolute -bottom-6 -right-6 bg-accent text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm">Franchise Centers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Investment Details */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Investment <span className="text-accent">Details</span></h2>
            <p className="text-blue-100 max-w-2xl mx-auto">Transparent investment structure with high returns</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
              <div className="text-4xl font-bold text-accent mb-4">₹10-15 Lakhs</div>
              <div className="text-xl font-semibold mb-2">Total Investment</div>
              <p className="text-blue-100">One-time investment including setup and operational costs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
              <div className="text-4xl font-bold text-accent mb-4">18-24 Months</div>
              <div className="text-xl font-semibold mb-2">Break-even Period</div>
              <p className="text-blue-100">Expected time to recover your initial investment</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
              <div className="text-4xl font-bold text-accent mb-4">25-30%</div>
              <div className="text-xl font-semibold mb-2">ROI Potential</div>
              <p className="text-blue-100">Annual return on investment with proper operations</p>
            </div>
          </div>
        </div>
      </div>

      {/* 9. CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your <span className="text-accent">Franchise Journey?</span></h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Take the first step towards becoming a Smart Institute franchise partner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                Apply Now <ArrowRight size={20} />
              </button>
              <button className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                <PhoneCall size={20} /> Call Us
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

export default FranchisePage;
