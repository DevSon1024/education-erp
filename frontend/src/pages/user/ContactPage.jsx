import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Send, Clock, MessageSquare, Globe, Headphones,
  Building, Users, Award, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const contactInfo = [
    {
      icon: <MapPin className="text-accent" size={24} />,
      title: 'Head Office',
      details: [
        '1st & 2nd Floor, 50-kubernagar,',
        'Opp. Baba Baijnath Mandir,',
        'Nilgiri Road, Ass-Pass Circle,',
        'Godadra Surat - 395010',
        'Gujarat, India'
      ]
    },
    {
      icon: <Phone className="text-accent" size={24} />,
      title: 'Phone Numbers',
      details: [
        '+91-96017-49300',
        '+91-98988-30409',
        '+91-96017-49300 (Franchise)'
      ]
    },
    {
      icon: <Mail className="text-accent" size={24} />,
      title: 'Email Addresses',
      details: [
        'info@smartinstitute.co.in',
        'admission@smartinstitute.co.in',
        'franchise@smartinstitute.co.in'
      ]
    },
    {
      icon: <Globe className="text-accent" size={24} />,
      title: 'Website',
      details: [
        'www.smartinstitute.co.in',
        'www.smartcampus.in'
      ]
    }
  ];

  const departments = [
    {
      name: 'Admissions',
      email: 'admission@smartinstitute.co.in',
      phone: '+91-96017-49300',
      timing: '9:00 AM - 6:00 PM'
    },
    {
      name: 'Franchise',
      email: 'franchise@smartinstitute.co.in',
      phone: '+91-96017-49300',
      timing: '10:00 AM - 7:00 PM'
    },
    {
      name: 'Technical Support',
      email: 'support@smartinstitute.co.in',
      phone: '+91-98988-30409',
      timing: '24/7 Available'
    },
    {
      name: 'Student Services',
      email: 'students@smartinstitute.co.in',
      phone: '+91-96017-49300',
      timing: '9:00 AM - 8:00 PM'
    }
  ];

  const faqs = [
    {
      question: 'What courses do you offer?',
      answer: 'We offer a wide range of courses including Web Development, Data Science, Digital Marketing, UI/UX Design, Business Analytics, and Mobile App Development.'
    },
    {
      question: 'How can I enroll in a course?',
      answer: 'You can enroll by visiting our campus, calling our admission team, or filling out the online inquiry form on our website.'
    },
    {
      question: 'Do you provide placement assistance?',
      answer: 'Yes, we provide 100% placement assistance to all our students through our dedicated placement cell and industry partnerships.'
    },
    {
      question: 'What are the admission requirements?',
      answer: 'Admission requirements vary by course. Generally, you need to be 10+2 passed for diploma courses and a graduate for degree programs.'
    },
    {
      question: 'Do you offer online classes?',
      answer: 'Yes, we offer both classroom and online learning options for most of our courses to suit different learning preferences.'
    },
    {
      question: 'What is the fee structure?',
      answer: 'Fee structure varies by course duration and type. Please contact our admission team for detailed fee information.'
    }
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
            <div className="w-20 h-20 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
              <MessageSquare size={40} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact <span className="text-accent">Us</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get in touch with us for any queries, admissions, or franchise opportunities
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Contact Information */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in <span className="text-primary">Touch</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're here to help you with all your educational needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-gray-600">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Contact Form & Map */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a <span className="text-primary">Message</span></h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">Select Subject</option>
                    <option value="admission">Admission Query</option>
                    <option value="course">Course Information</option>
                    <option value="franchise">Franchise Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Map & Quick Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Find <span className="text-primary">Our Location</span></h2>
              
              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-2xl overflow-hidden mb-8 h-96 relative">
                <img src="https://placehold.co/800x400/png?text=Map+Location" alt="Map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center">
                    <MapPin className="text-primary mx-auto mb-2" size={32} />
                    <p className="font-semibold text-gray-900">Smart Institute, Surat</p>
                    <p className="text-sm text-gray-600">Click to view on Google Maps</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Contact */}
              <div className="bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-accent" />
                    <div>
                      <p className="font-semibold">Office Hours</p>
                      <p className="text-sm text-blue-100">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Headphones size={20} className="text-accent" />
                    <div>
                      <p className="font-semibold">24/7 Support</p>
                      <p className="text-sm text-blue-100">Emergency: +91-98988-30409</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-accent" />
                    <div>
                      <p className="font-semibold">Live Chat Available</p>
                      <p className="text-sm text-blue-100">Chat with our representatives</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Departments */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact by <span className="text-primary">Department</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Reach out to the right department for faster assistance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-primary mb-4">{dept.name}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-gray-600">{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-600">{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-gray-600">{dept.timing}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. FAQs */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Quick answers to common questions</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. CTA Section */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your <span className="text-accent">Learning Journey?</span></h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact us today and take the first step towards a brighter future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                <Phone size={20} /> Call Now
              </button>
              <button className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                <Mail size={20} /> Email Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
