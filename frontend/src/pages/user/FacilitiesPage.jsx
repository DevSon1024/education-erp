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
    </div>
  );
};

export default FacilitiesPage;
