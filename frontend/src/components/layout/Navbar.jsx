import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { fetchMyPermissions } from '../../features/userRights/userRightsSlice';
import { Menu, X, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Transaction menu with nested structure
const TRANSACTION_MENU = [
  {
    title: 'Inquiry',
    hasSubOptions: true,
    subOptions: [
      { name: 'Online', path: '/transaction/inquiry/online' },
      { name: 'Offline', path: '/transaction/inquiry/offline' },
      { name: 'DSR', path: '/transaction/inquiry/dsr' }
    ]
  },
  {
    title: 'Visitors',
    hasSubOptions: true,
    subOptions: [
      { name: 'Todays Visitors List', path: '/transaction/visitors/todays-list' },
      { name: 'Todays Visited Report', path: '/transaction/visitors/todays-report' },
      { name: 'Visitors', path: '/transaction/visitors' }
    ]
  },
  { title: 'Pending Admission Fees', path: '/transaction/student-admission-fees', hasSubOptions: false },
  { title: 'Student Registration', path: '/transaction/student-registration', hasSubOptions: false },
  { title: 'Student Cancellation', path: '/transaction/student-cancellation', hasSubOptions: false },
  { title: 'Fees Receipt', path: '/transaction/fees-receipt', hasSubOptions: false }
];

const BASE_MENU_ITEMS = [
  {
    title: 'Home',
    path: '/home',
    subItems: [] 
  },
  { 
    title: 'Master', 
    path: '/master',
    subItems: ['Student', 'Employee', 'Batch', 'Course', 'Subject', 'Exam Request List', 'Exam Schedule', 'Exam Result'] 
  },
  { 
    title: 'Transaction', 
    path: '/transaction',
    isCustom: true,
    customMenu: TRANSACTION_MENU,
    subItems: [] // Added empty array to be safe, but code fix below handles it too
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
  const { myPermissions = [] } = useSelector((state) => state.userRights || {}); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [expandedSubItems, setExpandedSubItems] = useState({});

  const handleLogout = () => {
    dispatch(logout());
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
    if (isMobile) {
      return (
        <div className="bg-white">
          {TRANSACTION_MENU.map((item, idx) => (
            <div key={idx} className="border-b border-gray-100 last:border-0">
              {item.hasSubOptions ? (
                <div>
                  <button onClick={() => toggleSubItem(item.title)} className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-blue-50">
                    <span>{item.title}</span>
                    <ChevronRight size={16} className={`transition-transform duration-200 ${expandedSubItems[item.title] ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSubItems[item.title] && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-gray-50 overflow-hidden">
                        {item.subOptions.map((subOpt, subIdx) => (
                          <Link key={subIdx} to={subOpt.path} className="block px-8 py-2 text-sm text-gray-600 hover:bg-blue-100" onClick={() => setIsMobileMenuOpen(false)}>
                            {subOpt.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to={item.path} className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      );
    }
    return (
      <AnimatePresence>
        {isHovered && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-72 z-50" onMouseEnter={() => setHoveredMenu(filteredMenu.findIndex(m => m.title === 'Transaction'))} onMouseLeave={() => setHoveredMenu(null)}>
            <div className="bg-white text-gray-800 shadow-2xl rounded-lg overflow-hidden border-t-4 border-accent max-h-[500px] overflow-y-auto">
              {TRANSACTION_MENU.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0">
                  {item.hasSubOptions ? (
                    <div className="group/item">
                      <button onClick={() => toggleSubItem(item.title)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50">
                        <span>{item.title}</span>
                        <ChevronRight size={16} className={`transition-transform duration-200 ${expandedSubItems[item.title] ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedSubItems[item.title] && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-gradient-to-r from-blue-50 to-gray-50 overflow-hidden">
                            {item.subOptions.map((subOpt, subIdx) => (
                              <Link key={subIdx} to={subOpt.path} className="block px-8 py-2.5 text-sm text-gray-600 hover:bg-blue-100 border-l-2 border-transparent hover:border-primary">
                                • {subOpt.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link to={item.path} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-primary">
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
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold">SI</div>
           <div>
              <h1 className="text-xl font-bold text-primary tracking-tight">Smart Institute</h1>
              <p className="text-xs text-gray-500">Management Analysis of Technocrats</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-700">{user?.name || 'Guest'}</span>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full text-red-500" title="Logout">
            <LogOut size={20} />
          </button>
          
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <nav className="hidden md:block bg-primary text-white py-3">
        <div className="container mx-auto flex justify-center gap-8">
          {filteredMenu.map((item, index) => (
            <div key={index} className="relative group" onMouseEnter={() => setHoveredMenu(index)} onMouseLeave={() => setHoveredMenu(null)}>
              {/* FIX: Safely check for subItems using optional chaining */}
              {(item.subItems?.length > 0) || item.isCustom ? (
                <>
                    <button className="flex items-center gap-1 font-medium text-sm tracking-wide hover:text-accent transition-colors">
                        {item.title}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredMenu === index ? 'rotate-180' : ''}`}/>
                    </button>
                    {item.isCustom ? <TransactionDropdown isHovered={hoveredMenu === index} /> : (
                        <AnimatePresence>
                        {hoveredMenu === index && (
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-56">
                            <div className="bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden border-t-4 border-accent">
                                {item.subItems.map((sub, subIdx) => (
                                <Link key={subIdx} to={`${item.path}/${sub.toLowerCase().replace(/\s+/g, '-')}`} className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-primary transition-colors border-b border-gray-50 last:border-0">
                                    {sub}
                                </Link>
                                ))}
                            </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    )}
                </>
              ) : (
                <Link to={item.path} className="flex items-center gap-1 font-medium text-sm tracking-wide hover:text-accent transition-colors">
                    {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t max-h-[80vh] overflow-y-auto">
          {filteredMenu.map((item, index) => (
            <div key={index} className="border-b">
                {/* FIX: Safely check for subItems here as well */}
                {(item.subItems?.length > 0) || item.isCustom ? (
                    <>
                        <div className="px-4 py-3 font-semibold text-primary bg-gray-50">{item.title}</div>
                        {item.isCustom ? <TransactionDropdown isMobile={true} /> : (
                            <div className="pl-6 bg-white">
                            {item.subItems.map((sub, subIdx) => (
                                <Link key={subIdx} to={`${item.path}/${sub.toLowerCase().replace(/\s+/g, '-')}`} className="block py-2 text-sm text-gray-600 border-b border-gray-100 last:border-0" onClick={() => setIsMobileMenuOpen(false)}>
                                {sub}
                                </Link>
                            ))}
                            </div>
                        )}
                    </>
                ) : (
                     <Link to={item.path} className="block px-4 py-3 font-semibold text-primary bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                        {item.title}
                    </Link>
                )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;