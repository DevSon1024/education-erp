import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../features/master/masterSlice';
import { createInquiry } from '../features/transaction/transactionSlice';
import { toast } from 'react-toastify';
import newsService from '../services/newsService'; // Import news service
import { ArrowRight, Trophy, Calendar, ChevronLeft, ChevronRight, Phone, Mail, MapPin, AlertCircle, User, Award, BookOpen, Clock, ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import HeroImage1 from '../assets/6.jpg'
import HeroImage2 from '../assets/5.jpg';
import HeroImage3 from '../assets/Accounting.png';
import HeroImage4 from '../assets/textileDesign.png';
import HeroImage5 from '../assets/GraphicDesigning.png';
import HeroImage6 from '../assets/textileDesign_2.png';

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
    <div className={`relative overflow-hidden group ${type === 'hero' ? 'h-[200px] sm:h-[400px] md:h-[550px]' : 'h-auto py-8'}`}>
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full flex items-center justify-center bg-gray-100 relative">
            {type === 'hero' ? (
              <img src={item.image} alt="Slide" className="w-full h-full object-contain md:object-cover bg-white" />
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
    const dispatch = useDispatch();
    const { courses } = useSelector((state) => state.master);
    const [captcha, setCaptcha] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [latestNews, setLatestNews] = useState([]); // State for news
    const [newsLoading, setNewsLoading] = useState(true);
  
    // Form State
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      state: '',
      city: 'Surat', // Default as per inquiry schema hint
      interestedCourse: '',
      message: ''
    });
  
    // Generate new random captcha
    const generateCaptcha = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCaptcha(result);
    };
  
    useEffect(() => {
      dispatch(fetchCourses());
      generateCaptcha();
      fetchLatestNews(); // Fetch news on load
    }, [dispatch]);

    const fetchLatestNews = async () => {
        try {
            const data = await newsService.getPublicNews();
            setLatestNews(data);
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
        // Construct payload matching backend model
        const payload = {
          firstName: formData.name, // Mapping 'Name' to 'firstName' for simplicity. ideally we split names.
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
  
    const toppers = [
      { name: "Rahul Sharma", percentage: "98.5", course: "Computer Science", image: "https://placehold.co/150x150/png?text=Rahul" },
      { name: "Priya Patel", percentage: "97.2", course: "Information Tech", image: "https://placehold.co/150x150/png?text=Priya" },
      { name: "Amit Kumar", percentage: "96.8", course: "Data Science", image: "https://placehold.co/150x150/png?text=Amit" },
    ];
  
    return (
      <div className="w-full pt-[4.5rem]">
        {/* 1. Hero Carousel */}
        <Carousel items={heroImages} type="hero" />
  
        {/* 2. Contest & About Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
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
                <button className="text-primary font-bold hover:text-blue-700 flex items-center gap-2 border-b-2 border-primary pb-1 group">
                  Read More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* 3. Quick Contact (Inquiry Form) */}
        <div className="bg-gray-50 py-16 relative overflow-hidden">
             {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
              <div className="md:w-1/3 bg-gradient-to-br from-primary to-blue-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">Quick Contact</h3>
                  <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                    Start your journey with us. Fill out this quick form and our counselors will get in touch with you shortly to guide you towards your goals.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm group">
                      <div className="p-2 bg-white/10 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                        <Phone size={20} />
                      </div> 
                      <span>+91-96017-49300</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm group">
                       <div className="p-2 bg-white/10 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                        <Mail size={20} /> 
                       </div>
                       <span>info@smartinstitute.co.in</span>
                  </div>
                  <div className="flex items-start gap-4 text-sm group">
                      <div className="p-2 bg-white/10 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                        <MapPin size={20} /> 
                      </div>
                      <span>Surat, Gujarat</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 p-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    Start Learning <span className="text-accent">Today</span>
                </h3>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name <span className="text-red-500">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Required" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Required" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
                    </div>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Optional" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City <span className="text-red-500">*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required/>
                        </div>
                   </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">State <span className="text-red-500">*</span></label>
                             <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
                        </div>
                         <div className="space-y-1">
                             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</label>
                             <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-600 disabled:opacity-50" disabled>
                                <option>Main Branch (Varachha)</option>
                             </select>
                        </div>
                    </div>
                  
                  <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Interested Course <span className="text-red-500">*</span></label>
                     <select name="interestedCourse" value={formData.interestedCourse} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-600" required>
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.name}</option>
                        ))}
                     </select>
                  </div>
                  
                  <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Security Code: <span className="text-primary font-bold text-lg tracking-widest px-2 select-none border border-dashed border-gray-300 rounded mx-1">{captcha}</span> <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Enter above code" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" required />
                        <button type="button" onClick={generateCaptcha} className="p-3 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-xl transition-colors" title="Refresh Code">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
                        </button>
                      </div>
                  </div>

                  <button disabled={formLoading} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
                    {formLoading ? 'Submitting...' : 'Submit Inquiry'}
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
              {newsLoading ? (
                  <div className="col-span-3 text-center py-8 text-gray-500">Loading News...</div>
              ) : latestNews.length === 0 ? (
                  <div className="col-span-3 text-center py-8 text-gray-500">No news available at the moment.</div>
              ) : (
                  latestNews.map((item) => (
                    <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                      <div className="h-4 bg-primary relative">
                         {item.isBreaking && (
                             <div className="absolute top-0 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-b shadow-md flex items-center gap-1">
                                <AlertCircle size={10} /> BREAKING
                             </div>
                         )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                          {item.title.length > 50 
                            ? item.title.substring(0, 50) + '...' 
                            : item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <Calendar size={12} />
                          <span>{formatDate(item.releaseDate)}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {item.smallDetail || item.description?.substring(0, 80) + '...'}
                        </p>
                        {/* You can add a 'Read More' modal or page later if needed, mostly short description is enough */}
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

