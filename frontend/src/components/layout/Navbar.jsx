import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Menu Structure mapped to Modules
const MENU_ITEMS = [
  { 
    title: 'Master', 
    path: '/master',
    subItems: ['Student', 'Employee', 'Batch', 'Course', 'Subject'] 
  },
  { 
    title: 'Transaction', 
    path: '/transaction',
    subItems: ['Admission', 'Fees Receipt', 'Attendance', 'Inquiry'] 
  },
  { 
    title: 'Reports', 
    path: '/reports',
    subItems: ['Ledger', 'Monthly Report', 'Admission Form'] 
  },
  { title: 'Blog', path: '/blog', subItems: ['Manage Blogs', 'Comments'] },
  { title: 'Connect', path: '/connect', subItems: ['Video Call', 'Inquiry List'] },
  { title: 'Utility', path: '/utility', subItems: ['Downloads', 'Free Learning'] },
];

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      {/* Top Bar - Branding & User Profile */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
           {/* Placeholder for Logo */}
           <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold">SI</div>
           <div>
              <h1 className="text-xl font-bold text-primary tracking-tight">Smart Institute</h1>
              <p className="text-xs text-gray-500">Management Analysis of Technocrats</p>
           </div>
        </div>

        {/* User Profile (Right Side) */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-700">{user?.name || 'Guest'}</span>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full text-red-500" title="Logout">
            <LogOut size={20} />
          </button>
          
          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Main Navigation - Centered & Animated */}
      <nav className="hidden md:block bg-primary text-white py-3">
        <div className="container mx-auto flex justify-center gap-8">
          {MENU_ITEMS.map((item, index) => (
            <div 
              key={index} 
              className="relative group"
              onMouseEnter={() => setHoveredMenu(index)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button className="flex items-center gap-1 font-medium text-sm tracking-wide hover:text-accent transition-colors">
                {item.title}
                <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredMenu === index ? 'rotate-180' : ''}`}/>
              </button>

              {/* Animated Dropdown */}
              <AnimatePresence>
                {hoveredMenu === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-56"
                  >
                    <div className="bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden border-t-4 border-accent">
                      {item.subItems.map((sub, subIdx) => (
                        <Link 
                          key={subIdx} 
                          to={`${item.path}/${sub.toLowerCase().replace(' ', '-')}`}
                          className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          {MENU_ITEMS.map((item, index) => (
            <div key={index} className="border-b">
              <div className="px-4 py-3 font-semibold text-primary bg-gray-50">{item.title}</div>
              <div className="pl-6 bg-white">
                {item.subItems.map((sub, subIdx) => (
                  <Link key={subIdx} to="#" className="block py-2 text-sm text-gray-600 border-b border-gray-100 last:border-0">
                    {sub}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;