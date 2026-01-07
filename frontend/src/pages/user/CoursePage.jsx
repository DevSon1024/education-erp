import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Clock, Users, Award, BookOpen, Star, CheckCircle,
  Play, Calendar, DollarSign, Target, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';

const CoursePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'programming', 'design', 'business', 'data-science', 'digital-marketing'];
  
  const courses = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      category: 'programming',
      duration: '6 Months',
      students: 1250,
      rating: 4.8,
      price: '₹45,000',
      image: 'https://placehold.co/400x250/png?text=Full+Stack+Web',
      description: 'Master HTML, CSS, JavaScript, React, Node.js and MongoDB',
      features: ['HTML5 & CSS3', 'JavaScript ES6+', 'React.js', 'Node.js', 'MongoDB', 'REST APIs'],
      instructor: 'Rajesh Kumar',
      level: 'Beginner to Advanced'
    },
    {
      id: 2,
      title: 'Data Science & Machine Learning',
      category: 'data-science',
      duration: '8 Months',
      students: 890,
      rating: 4.9,
      price: '₹65,000',
      image: 'https://placehold.co/400x250/png?text=Data+Science',
      description: 'Learn Python, Machine Learning, Deep Learning and AI',
      features: ['Python Programming', 'Machine Learning', 'Deep Learning', 'Data Visualization', 'TensorFlow', 'Statistics'],
      instructor: 'Dr. Priya Sharma',
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      category: 'digital-marketing',
      duration: '3 Months',
      students: 2100,
      rating: 4.7,
      price: '₹25,000',
      image: 'https://placehold.co/400x250/png?text=Digital+Marketing',
      description: 'Complete Digital Marketing with SEO, SEM, Social Media',
      features: ['SEO & SEM', 'Social Media Marketing', 'Google Ads', 'Content Marketing', 'Analytics', 'Email Marketing'],
      instructor: 'Amit Patel',
      level: 'Beginner'
    },
    {
      id: 4,
      title: 'UI/UX Design Professional',
      category: 'design',
      duration: '4 Months',
      students: 650,
      rating: 4.8,
      price: '₹35,000',
      image: 'https://placehold.co/400x250/png?text=UI+UX+Design',
      description: 'Master User Interface and User Experience Design',
      features: ['Design Principles', 'Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
      instructor: 'Neha Singh',
      level: 'Beginner to Intermediate'
    },
    {
      id: 5,
      title: 'Business Analytics',
      category: 'business',
      duration: '5 Months',
      students: 780,
      rating: 4.6,
      price: '₹40,000',
      image: 'https://placehold.co/400x250/png?text=Business+Analytics',
      description: 'Learn Business Intelligence and Data Analysis',
      features: ['Excel Advanced', 'Tableau', 'Power BI', 'SQL', 'Business Intelligence', 'Data Storytelling'],
      instructor: 'Vikram Desai',
      level: 'Intermediate'
    },
    {
      id: 6,
      title: 'Mobile App Development',
      category: 'programming',
      duration: '6 Months',
      students: 920,
      rating: 4.7,
      price: '₹50,000',
      image: 'https://placehold.co/400x250/png?text=Mobile+Development',
      description: 'Build iOS and Android Apps with React Native',
      features: ['React Native', 'iOS Development', 'Android Development', 'App Deployment', 'UI Components', 'API Integration'],
      instructor: 'Sanjay Mehta',
      level: 'Intermediate'
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const popularCourses = courses.slice(0, 3);

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our <span className="text-accent">Courses</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transform your career with industry-relevant courses designed for success
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} />
                  <span>50+ Courses</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>10,000+ Students</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <Award size={20} />
                  <span>Expert Faculty</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5. Popular Courses */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular <span className="text-primary">Courses</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Most sought-after courses by our students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                    Popular
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-accent font-semibold">{course.category}</span>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{course.students}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">{course.price}</div>
                      <div className="text-sm text-gray-500">One-time payment</div>
                    </div>
                    <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      Enroll Now <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Course Categories */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by <span className="text-primary">Category</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose from our wide range of course categories</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-accent text-white p-3 rounded-full hover:bg-orange-600 transition-colors">
                      <Play size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-accent font-semibold text-sm">{course.category}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    {course.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-lg font-bold text-primary">{course.price}</div>
                      <div className="text-xs text-gray-500">{course.duration}</div>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Course Benefits */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose <span className="text-accent">Our Courses?</span></h2>
            <p className="text-blue-100 max-w-2xl mx-auto">Benefits that make our courses stand out</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Industry-Relevant</h3>
              <p className="text-blue-100">Courses designed with industry experts to meet current market demands</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Faculty</h3>
              <p className="text-blue-100">Learn from experienced professionals with real-world expertise</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Certification</h3>
              <p className="text-blue-100">Get industry-recognized certificates upon course completion</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Career Support</h3>
              <p className="text-blue-100">100% placement assistance and career guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your <span className="text-accent">Learning Journey?</span></h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1">
                Browse All Courses
              </button>
              <button className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1">
                Talk to Counselor
              </button>
            </div>
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

export default CoursePage;
