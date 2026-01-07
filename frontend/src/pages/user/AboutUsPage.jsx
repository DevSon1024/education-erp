import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Users, Award, BookOpen, Target, Clock, CheckCircle,
  GraduationCap, Lightbulb, Heart, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';

const AboutUsPage = () => {
  const timeline = [
    { year: '2013', event: 'Smart Institute Established', description: 'Started with a vision to provide quality education' },
    { year: '2015', event: 'First Batch Graduated', description: '100% placement rate achieved' },
    { year: '2018', event: 'New Campus Launch', description: 'Expanded to state-of-the-art facility' },
    { year: '2020', event: 'Digital Transformation', description: 'Launched online learning platforms' },
    { year: '2023', event: '10 Years of Excellence', description: 'Served over 10,000 students successfully' }
  ];

  const values = [
    { icon: <Target className="text-accent" />, title: 'Mission', description: 'To provide world-class education that empowers students to achieve their dreams and build successful careers.' },
    { icon: <Lightbulb className="text-accent" />, title: 'Vision', description: 'To be the leading educational institution known for innovation, excellence, and student success.' },
    { icon: <Heart className="text-accent" />, title: 'Values', description: 'Integrity, Excellence, Innovation, and Student-Centric Approach guide everything we do.' }
  ];

  const achievements = [
    { number: '10,000+', label: 'Students Placed' },
    { number: '500+', label: 'Corporate Partners' },
    { number: '95%', label: 'Placement Rate' },
    { number: '50+', label: 'Courses Offered' }
  ];

  const team = [
    { name: 'Dr. Rajesh Patel', role: 'Founder & Director', image: 'https://placehold.co/200x200/png?text=Dr.+Patel' },
    { name: 'Prof. Anita Sharma', role: 'Academic Head', image: 'https://placehold.co/200x200/png?text=Prof.+Sharma' },
    { name: 'Mr. Vikram Singh', role: 'Placement Director', image: 'https://placehold.co/200x200/png?text=Mr.+Singh' },
    { name: 'Dr. Priya Desai', role: 'Research Head', image: 'https://placehold.co/200x200/png?text=Dr.+Desai' }
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About <span className="text-accent">Smart Institute</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transforming lives through quality education and innovation since 2013
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Mission Vision Values */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our <span className="text-primary">Foundation</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide our commitment to excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. About Smart Institute */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to <span className="text-primary">Smart Institute</span></h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Smart Institute is a premier educational institution committed to transforming lives through technology and innovation. Established in 2013, we have been at the forefront of providing world-class education that empowers students to achieve their dreams.
                </p>
                <p>
                  Our state-of-the-art facilities, expert faculty, and industry-aligned curriculum ensure that our students are well-prepared for the challenges of the modern workplace. We believe in nurturing talent and building careers through practical learning and real-world exposure.
                </p>
                <p>
                  With over 10,000 successful alumni placed in leading companies worldwide, we take pride in our contribution to shaping the future of countless students. Our comprehensive approach to education combines theoretical knowledge with practical skills, making our graduates industry-ready from day one.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-accent shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Expert Faculty</h4>
                    <p className="text-sm text-gray-600">Industry-experienced instructors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-accent shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Modern Infrastructure</h4>
                    <p className="text-sm text-gray-600">State-of-the-art facilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-accent shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">100% Placement</h4>
                    <p className="text-sm text-gray-600">Guaranteed career support</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-accent shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Practical Learning</h4>
                    <p className="text-sm text-gray-600">Hands-on training approach</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img src="https://placehold.co/600x400/png?text=Smart+Institute+Campus" alt="Smart Institute Campus" className="rounded-2xl shadow-xl" />
              <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Achievements */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our <span className="text-accent">Achievements</span></h2>
            <p className="text-blue-100 max-w-2xl mx-auto">Numbers that speak volumes about our commitment to excellence</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{achievement.number}</div>
                <div className="text-blue-100">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Timeline */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our <span className="text-primary">Journey</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Milestones that mark our growth and success</p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-1/2"></div>
                <div className="w-8 h-8 bg-accent rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2 px-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="text-accent font-bold text-lg mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.event}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. Team */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our <span className="text-primary">Leadership Team</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Meet the visionaries behind Smart Institute's success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img src={member.image} alt={member.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-accent font-semibold">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;