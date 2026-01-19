import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { fetchMyPermissions } from '../../features/userRights/userRightsSlice';
import { Menu, X, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { BASE_MENU_ITEMS, TRANSACTION_MENU } from '../../utils/menuConfig';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { myPermissions = [] } = useSelector((state) => state.userRights || {}); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [expandedSubItems, setExpandedSubItems] = useState({});

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const toggleSubItem = (title) => {
    setExpandedSubItems(prev => ({ ...prev, [title]: !prev[title] }));
  };

  useEffect(() => {
    if (user) dispatch(fetchMyPermissions());
  }, [user, dispatch]);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'Super Admin') {
      const adminMenu = BASE_MENU_ITEMS.map(item => {
        if (item.title === 'Master') {
          return item.subItems.includes('User Rights') ? item : { ...item, subItems: [...item.subItems, 'User Rights'] };
        }
        return item;
      });
      setFilteredMenu(adminMenu);
      return;
    }

    const newMenu = BASE_MENU_ITEMS.map(item => {
      if (item.title === 'Home') return item;
      if (item.isCustom) return item;

      const visibleSubItems = item.subItems ? item.subItems.filter(sub => {
        const perm = myPermissions.find(p => p.page === sub);
        return perm && perm.view === true;
      }) : [];

      if (visibleSubItems.length > 0) return { ...item, subItems: visibleSubItems };
      return null;
    }).filter(Boolean);

    setFilteredMenu(newMenu);
  }, [user, myPermissions]);

  const TransactionDropdown = ({ isHovered, isMobile = false }) => {
    // Mobile View
    if (isMobile) {
      return (
        <div className="bg-gray-50 border-t border-gray-100">
          {TRANSACTION_MENU.map((item, idx) => (
            <div key={idx} className="border-b border-gray-200 last:border-0 border-dashed">
              {item.hasSubOptions ? (
                <div>
                  <button onClick={() => toggleSubItem(item.title)} className="w-full flex items-center justify-between px-6 py-3 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors font-medium">
                    <span>{item.title}</span>
                    <ChevronRight size={16} className={`transition-transform duration-200 ${expandedSubItems[item.title] ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSubItems[item.title] && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-white overflow-hidden border-t border-gray-100">
                        {item.subOptions.map((subOpt, subIdx) => (
                          <Link key={subIdx} to={subOpt.path} className="block px-10 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 border-l-4 border-transparent hover:border-primary transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                            {subOpt.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to={item.path} className="block px-6 py-3 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // Desktop Dropdown
    return (
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }} 
            transition={{ duration: 0.2 }} 
            className="absolute left-0 top-full pt-2 w-64 z-50" // Aligned left naturally
            onMouseEnter={() => setHoveredMenu(filteredMenu.findIndex(m => m.title === 'Transaction'))} 
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <div className="bg-white text-gray-800 shadow-xl rounded-md overflow-hidden border border-gray-200 ring-1 ring-black/5">
              <div className="h-1 bg-primary w-full"></div>
              {TRANSACTION_MENU.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0">
                  {item.hasSubOptions ? (
                    <div className="group/item relative">
                       {/* Nested Submenu Trigger */}
                      <button 
                        onClick={() => toggleSubItem(item.title)} 
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <span>{item.title}</span>
                        <ChevronDown size={14}/> 
                      </button>
                      
                       {/* Nested Submenu Display (Simple Expansion for now to avoid complexity or side popout) */}
                        <div className="bg-gray-50 border-t border-gray-100 hidden group-hover/item:block">
                           {item.subOptions.map((subOpt, subIdx) => (
                              <Link key={subIdx} to={subOpt.path} className="block px-6 py-2 text-xs font-semibold text-gray-600 hover:text-primary hover:bg-blue-50">
                                {subOpt.name}
                              </Link>
                            ))}
                        </div>
                    </div>
                  ) : (
                    <Link to={item.path} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-md border-b border-gray-200 transition-all duration-300 h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 transform transition-transform hover:scale-105">
                  SI
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                        Smart Institute
                    </h1>
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">Management System</span>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 h-full">
                {filteredMenu.map((item, index) => (
                    <div key={index} className="relative h-full flex items-center px-1" onMouseEnter={() => setHoveredMenu(index)} onMouseLeave={() => setHoveredMenu(null)}>
                    {/* FIX: Safely check for subItems using optional chaining */}
                    {(item.subItems?.length > 0) || item.isCustom ? (
                        <>
                            <button 
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 
                                ${hoveredMenu === index ? 'text-primary bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                            >
                                {item.title}
                                <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredMenu === index ? 'rotate-180 text-primary' : 'text-gray-400'}`}/>
                            </button>
                            {/* Dropdowns */}
                            {item.isCustom ? <TransactionDropdown isHovered={hoveredMenu === index} /> : (
                                <AnimatePresence>
                                {hoveredMenu === index && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        exit={{ opacity: 0, y: 10 }} 
                                        transition={{ duration: 0.2 }} 
                                        className="absolute left-0 top-full pt-2 w-56 z-50"
                                    >
                                    <div className="bg-white text-gray-800 shadow-xl rounded-md overflow-hidden border border-gray-200 ring-1 ring-black/5">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                                        <div className="py-2">
                                            {item.subItems.map((sub, subIdx) => (
                                                <Link key={subIdx} to={`${item.path}/${sub.toLowerCase().replace(/\s+/g, '-')}`} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-all border-l-4 border-transparent hover:border-primary">
                                                    {sub}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            )}
                        </>
                    ) : (
                        <Link 
                            to={item.path} 
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 
                            ${location.pathname.startsWith(item.path) ? 'text-primary bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            {item.title}
                        </Link>
                    )}
                    </div>
                ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-2 border-r pr-4 border-gray-200">
                    <span className="text-sm font-bold text-gray-900 leading-tight">{user?.name || 'Guest'}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{user?.role}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-all duration-300 border border-red-100 font-medium text-sm" title="Logout">
                    <LogOut size={16} />
                    <span className="hidden md:inline">Logout</span>
                </button>
                
                <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-gray-200 max-h-[85vh] overflow-y-auto shadow-xl absolute w-full left-0 top-16">
            <div className="py-2">
                {filteredMenu.map((item, index) => (
                    <div key={index} className="">
                        {(item.subItems?.length > 0) || item.isCustom ? (
                            <>
                                <div className="px-4 py-3 font-bold text-gray-800 bg-gray-50 border-y border-gray-100 flex items-center justify-between">
                                    {item.title}
                                    <ChevronDown size={14} className="text-gray-400"/>
                                </div>
                                {item.isCustom ? <TransactionDropdown isMobile={true} /> : (
                                    <div className="bg-white">
                                    {item.subItems.map((sub, subIdx) => (
                                        <Link key={subIdx} to={`${item.path}/${sub.toLowerCase().replace(/\s+/g, '-')}`} className="block px-8 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors border-b border-gray-50 last:border-0" onClick={() => setIsMobileMenuOpen(false)}>
                                        {sub}
                                        </Link>
                                    ))}
                                    </div>
                                )}
                            </>
                        ) : (
                                <Link to={item.path} className="block px-4 py-4 font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
                                {item.title}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
            {/* Mobile User Profile Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {user?.name?.charAt(0) || 'G'}
                     </div>
                     <div>
                        <div className="font-bold text-gray-900">{user?.name}</div>
                        <div className="text-xs font-semibold text-gray-500 uppercase">{user?.role}</div>
                     </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;