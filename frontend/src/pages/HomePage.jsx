import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../features/master/masterSlice';
import { createInquiry } from '../features/transaction/transactionSlice';
import { toast } from 'react-toastify';
import newsService from '../services/newsService';
import { ArrowRight, Trophy, Calendar, ChevronLeft, ChevronRight, Phone, Mail, MapPin, AlertCircle, Quote, Star, Users, BookOpen } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import HeroCarousel from '../components/ui/HeroCarousel';
import HeroImage1 from '../assets/6.jpg'
import HeroImage2 from '../assets/5.jpg';
import HeroImage3 from '../assets/Accounting.png';
import HeroImage4 from '../assets/textileDesign.png';
import HeroImage5 from '../assets/GraphicDesigning.png';
import HeroImage6 from '../assets/textileDesign_2.png';

// Keep existing generic Carousel for Toppers/Reviews
const Carousel = ({ items, type = "hero" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  // Auto-play removed for non-hero carousels mainly, or can keep if desired
  useEffect(() => {
    if (type === 'hero') { // We aren't using this type for hero anymore, but good to keep logic safe
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, type]);

  return (
    <div className={`relative overflow-hidden group ${type === 'hero' ? 'h-[200px] sm:h-[400px] md:h-[550px]' : 'h-auto py-8'}`}>
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full flex items-center justify-center relative px-2">
            {type === 'hero' ? (
              <img src={item.image} alt="Slide" className="w-full h-full object-contain md:object-cover bg-white" />
            ) : (
                // Improved Card Design for Toppers / Testimonials
               <div className="w-full h-full flex justify-center items-center pb-8 pt-4">
                 <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border-t-4 border-accent relative transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute top-4 right-6 text-yellow-400 opacity-20"><Quote size={40} /></div>
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-primary font-medium text-sm mb-3 uppercase tracking-wide">{item.course}</p>
                    <div className="bg-blue-50 py-2 rounded-lg mx-6">
                         <div className="text-3xl font-black text-accent">{item.percentage}%</div>
                         <div className="text-[10px] text-gray-500 font-semibold uppercase">Score Achieved</div>
                    </div>
                 </div>
               </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-r-lg shadow-md hover:bg-white hover:text-accent transition-all z-10">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-l-lg shadow-md hover:bg-white hover:text-accent transition-all z-10">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

const HomePage = () => {
    const dispatch = useDispatch();
    const { courses } = useSelector((state) => state.master);
    const [captcha, setCaptcha] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [latestNews, setLatestNews] = useState([]); 
    const [newsLoading, setNewsLoading] = useState(true);
  
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      state: '',
      city: 'Surat',
      interestedCourse: '',
      message: ''
    });
  
    const generateCaptcha = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCaptcha(result);
    };
  
    useEffect(() => {
      dispatch(fetchCourses());
      generateCaptcha();
      fetchLatestNews();
    }, [dispatch]);

    const fetchLatestNews = async () => {
        try {
            const data = await newsService.getPublicNews();
            // Sort by release date descending
            const sortedData = [...data].sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            setLatestNews(sortedData.slice(0, 3)); // Only take top 3
        } catch (error) {
            console.error("Failed to load news", error);
        } finally {
            setNewsLoading(false);
        }
    };
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (userCaptcha !== captcha) {
        toast.error('Invalid Security Code!');
        return;
      }
  
      if (!formData.name || !formData.phone || !formData.state || !formData.city || !formData.interestedCourse) {
        toast.error('Please fill all required fields (*)!');
        return;
      }
  
      setFormLoading(true);
      try {
        const payload = {
          firstName: formData.name,
          contactStudent: formData.phone,
          email: formData.email,
          state: formData.state,
          city: formData.city,
          interestedCourse: formData.interestedCourse,
          remarks: formData.message,
          source: 'QuickContact',
          status: 'Pending'
        };
        
        await dispatch(createInquiry(payload)).unwrap();
        
        toast.success("Inquiry Submitted Successfully! We'll contact you soon.");
        setFormData({
          name: '',
          email: '',
          phone: '',
          state: '',
          city: 'Surat',
          interestedCourse: '',
          message: ''
        });
        setUserCaptcha('');
        generateCaptcha();
  
      } catch (error) {
        toast.error(error.message || 'Failed to submit inquiry');
      } finally {
        setFormLoading(false);
      }
    };
  
    const heroImages = [
      { image: HeroImage1 },
      { image: HeroImage2 },
      { image: HeroImage3 },
      { image: HeroImage4},
      { image: HeroImage5},
      { image: HeroImage6}
    ];
  
    // Dummy Data for Toppers - Ideally this should also come from an API
    const toppers = [
      { name: "Priya Patel", percentage: "98.5", course: "Full Stack Development", image: "https://placehold.co/600x400/png?text=Priya+Patel" },
      { name: "Rahul Sharma", percentage: "97.2", course: "Data Science & AI", image: "https://placehold.co/600x400/png?text=Rahul+Sharma" },
      { name: "Amit Kumar", percentage: "96.8", course: "Cyber Security", image: "https://placehold.co/600x400/png?text=Amit+Kumar" },
    ];
  
    return (
      <div className="w-full">
        {/* 1. New Hero Carousel */}
        <HeroCarousel items={heroImages} />
  
        {/* 2. Welcome / About Section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
                
                <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Excellence in Education</h4>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Futures</span>, <br/>
                  Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Lives</span>.
                </h2>
                <div className="w-20 h-1.5 bg-accent rounded-full mb-8"></div>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Welcome to <span className="font-bold text-gray-800">Smart Institute</span>, where potential meets opportunity. For over a decade, we have been at the forefront of providing industry-relevant education that bridges the gap between academic learning and professional requirements.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Our comprehensive curriculum, experienced faculty, and strong industry connects ensure that our students are not just graduates, but future leaders ready to make an impact.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                     {/* 10000+ Alumni Network - Removed */}
                    
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                            <Star size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">10+ Years</div>
                            <div className="text-xs text-gray-500">Of Excellence</div>
                        </div>
                    </div>
                </div>

                <a href="/about-us" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary transition-colors hover:shadow-lg">
                  Learn More About Us <ArrowRight size={18} />
                </a>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 gap-5"> {/* Changed to single column/simplified grid since items removed */}
                     {/* Best Institute Award & 100% Placement - Removed */}

                     <div className="space-y-4 pt-8 md:pt-0">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-accent transform hover:-translate-y-1 transition-transform cursor-default">
                             <BookOpen className="text-primary mb-4" size={40} />
                             <h3 className="font-bold text-xl mb-2">Industry Curriculum</h3>
                             <p className="text-sm text-gray-500">Courses designed by experts to meet current market demands.</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-2xl shadow-inner flex flex-col justify-center items-center text-center">
                             <div className="font-black text-6xl text-gray-200">20+</div>
                             <div className="font-bold text-gray-500">Professional Courses</div>
                        </div>
                     </div>
                </div>
            </div>

          </div>
        </div>
  
        {/* 3. Quick Contact (Inquiry Form) */}
        <div className="bg-slate-50 py-20 relative overflow-hidden">
             {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/3 pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
              {/* Left Info Panel */}
              <div className="lg:w-2/5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-black mb-6">Get In Touch</h3>
                  <p className="text-gray-300 text-lg mb-10 leading-relaxed font-light">
                    Have questions about our courses or admissions? Fill out the form and our career counselors will assist you.
                  </p>
                  
                  <div className="space-y-8">
                     <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-white/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all backdrop-blur-sm shrink-0">
                          <Phone size={24} />
                        </div> 
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Call Us</p>
                            <p className="font-bold text-lg">+91-96017-49300</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 group">
                         <div className="p-3 bg-white/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all backdrop-blur-sm shrink-0">
                          <Mail size={24} /> 
                         </div>
                         <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Email Us</p>
                            <p className="font-bold text-lg break-all">info@smartinstitute.co.in</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-white/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all backdrop-blur-sm shrink-0">
                          <MapPin size={24} /> 
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Visit Us</p>
                            <p className="font-bold text-lg leading-snug">Surat, Gujarat</p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                    <p className="text-xs text-gray-400">© Smart Institute. All rights reserved.</p>
                </div>
              </div>
              
              {/* Right Form Panel */}
              <div className="lg:w-3/5 p-8 md:p-12 bg-white">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Admission Inquiry</h3>
                    <p className="text-gray-500">Take the first step towards your career.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Mobile Number <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" required />
                    </div>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">City <span className="text-red-500">*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" required/>
                        </div>
                   </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                             <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">State <span className="text-red-500">*</span></label>
                             <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Enter State" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" required />
                        </div>
                         <div className="space-y-1.5">
                             <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Branch Preference</label>
                             <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-500 font-medium disabled:opacity-60 cursor-not-allowed" disabled>
                                <option>Main Branch (Varachha)</option>
                             </select>
                        </div>
                    </div>
                  
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Interested Course <span className="text-red-500">*</span></label>
                     <select name="interestedCourse" value={formData.interestedCourse} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-700 font-medium cursor-pointer hover:bg-white transition-colors" required>
                        <option value="">Select a Course...</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.name}</option>
                        ))}
                     </select>
                  </div>
                  
                  <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Security Code <span className="text-red-500">*</span></label>
                         <button type="button" onClick={generateCaptcha} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                             Refresh Code
                         </button>
                      </div>
                      <div className="flex gap-3 items-stretch">
                        <div className="bg-gray-100 border border-gray-300 rounded-xl px-4 flex items-center justify-center min-w-[100px] select-none">
                            <span className="text-2xl font-mono font-bold text-gray-600 tracking-widest">{captcha}</span>
                        </div>
                        <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Type code here" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium uppercase placeholder:normal-case" required />
                      </div>
                  </div>

                  <button disabled={formLoading} className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-6 text-lg tracking-wide">
                    {formLoading ? 'Submitting Application...' : 'Submit Inquiry Now'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
  
        {/* 4. Student Success Stories (Toppers) */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-3">Hall of Fame</h4>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Student <span className="text-primary">Success Stories</span></h2>
            <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-lg">Celebrating the academic excellence and outstanding achievements of our brilliant students who have made us proud.</p>
            <Carousel items={toppers} type="topper" />
          </div>
        </div>
  
        {/* 5. Latest News */}
        <div className="bg-slate-50 py-20 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
               <div>
                 <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-3">Campus Updates</h4>
                 <h2 className="text-3xl md:text-4xl font-black text-gray-900">Latest <span className="text-primary">News & Events</span></h2>
               </div>
               <a href="/news" className="text-primary font-bold hover:text-blue-700 flex items-center gap-2 group transition-colors">
                 View All News <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
               </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-64">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                  ))
              ) : latestNews.length === 0 ? (
                  <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <Calendar size={24} className="text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">No recent news available.</p>
                  </div>
              ) : (
                  latestNews.map((item) => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden border border-gray-100 group">
                      <div className="h-1.5 bg-gradient-to-r from-primary to-blue-400 relative"></div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">
                                <Calendar size={12} />
                                <span>{formatDate(item.releaseDate) || "Recent"}</span>
                            </div>
                             {item.isBreaking && (
                                 <div className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1 animate-pulse">
                                    <AlertCircle size={10} /> BREAKING
                                 </div>
                             )}
                        </div>
                        
                        <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                          {item.smallDetail || item.description?.substring(0, 80) + '...'}
                        </p>
                        
                        <button className="text-sm font-bold text-gray-900 flex items-center gap-2 group/btn self-start">
                            Read More <ChevronRight size={16} className="text-accent group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HomePage;
