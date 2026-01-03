import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { fetchMyPermissions } from '../../features/userRights/userRightsSlice'; // Ensure this path is correct
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Defined outside component to prevent re-creation
const BASE_MENU_ITEMS = [
  {
    title: 'Home',
    path: '/home',
    subItems: ['Inquiry List', 'Exam Pending List']
  },
  { 
    title: 'Master', 
    path: '/master',
    subItems: ['Student', 'Employee', 'Batch', 'Course', 'Subject', 'Exam Request List'] 
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
  // specific selector with safe fallback
  const { myPermissions = [] } = useSelector((state) => state.userRights || {}); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [filteredMenu, setFilteredMenu] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // 1. Fetch Permissions on Load
  useEffect(() => {
    if (user) {
      // console.log("Fetching permissions for user:", user.email); // Debug
      dispatch(fetchMyPermissions());
    }
  }, [user, dispatch]);

  // 2. Filter Menu based on Permissions
  useEffect(() => {
    if (!user) return;

    // console.log("Current User Permissions:", myPermissions); // Debug

    // Super Admin gets everything + User Rights page
    if (user.role === 'Super Admin') {
      const adminMenu = BASE_MENU_ITEMS.map(item => {
        if (item.title === 'Master') {
          // Add 'User Rights' if not already present
          const hasRights = item.subItems.includes('User Rights');
          return hasRights ? item : { ...item, subItems: [...item.subItems, 'User Rights'] };
        }
        return item;
      });
      setFilteredMenu(adminMenu);
      return;
    }

    // Normal User Filtering
    const newMenu = BASE_MENU_ITEMS.map(item => {
      // Always show Home
      if (item.title === 'Home') return item;

      // Filter sub-items based on 'view' permission
      const visibleSubItems = item.subItems.filter(sub => {
        // Find permission matching the Page Name exactly
        const perm = myPermissions.find(p => p.page === sub);
        
        // Debugging logs for specific items (check your browser console)
        // if (sub === 'Student') console.log(`Checking ${sub}:`, perm);

        // Return true only if permission exists AND view is true
        return perm && perm.view === true;
      });

      // Only return the main menu item if it has visible sub-items
      if (visibleSubItems.length > 0) {
        return { ...item, subItems: visibleSubItems };
      }
      return null;
    }).filter(Boolean); // Remove null entries (empty menus)

    setFilteredMenu(newMenu);

  }, [user, myPermissions]);

  return (
    <header className="bg-white shadow-md relative z-50">
      {/* Top Bar */}
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

      {/* Main Navigation - Uses filteredMenu */}
      <nav className="hidden md:block bg-primary text-white py-3">
        <div className="container mx-auto flex justify-center gap-8">
          {filteredMenu.map((item, index) => (
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
                          to={`${item.path}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          {filteredMenu.map((item, index) => (
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