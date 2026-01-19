export const TRANSACTION_MENU = [
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
  {
    title: 'Attendance',
    hasSubOptions: true,
    subOptions: [
      { name: 'Student Attendance', path: '/transaction/attendance/student' },
      { name: 'Employee Attendance', path: '/transaction/attendance/employee' }
    ]
  },
  { title: 'Student Admission', path: '/master/student/new', hasSubOptions: false },
  { title: 'Pending Admission Fees', path: '/transaction/pending-admission-fees', hasSubOptions: false },
  { title: 'Pending Student Registration', path: '/transaction/pending-registration', hasSubOptions: false },
  { title: 'Student Cancellation', path: '/transaction/student-cancellation', hasSubOptions: false },
  { title: 'Fees Receipt', path: '/transaction/fees-receipt', hasSubOptions: false },
];

export const BASE_MENU_ITEMS = [
  {
    title: 'Home',
    path: '/home',
    subItems: [] 
  },
  { 
    title: 'Master', 
    path: '/master',
    subItems: ['Student', 'Employee', 'Batch', 'Course', 'Subject', 'Exam Request List', 'Exam Schedule', 'Exam Result', 'Manage News'] 
  },
  { 
    title: 'Transaction', 
    path: '/transaction',
    isCustom: true,
    customMenu: TRANSACTION_MENU,
    subItems: []
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

/**
 * Helper to get all configurable pages for User Rights
 * Flattens the menu structure into sections.
 */
export const getMenuSections = () => {
    const sections = {};

    BASE_MENU_ITEMS.forEach(item => {
        if (item.title === 'Home') return; // Skip Home, usually open to all logged in
        
        let pages = [];
        if (item.subItems && item.subItems.length > 0) {
            pages = [...item.subItems];
        } 
        
        if (item.isCustom && item.customMenu) {
            // Flatten custom menu (Transaction)
            item.customMenu.forEach(sub => {
                if (sub.hasSubOptions && sub.subOptions) {
                    pages.push(...sub.subOptions.map(opt => opt.name)); // Just name like "Online", "Student" might be ambiguous? 
                    // Wait, current UserRights uses names like 'Student', 'Employee' which collide with Master.
                    // Checking current UserRights.jsx:
                    // 'Master': ['Student', 'Employee', 'Batch', 'Course', 'Subject', 'User Rights'],
                    // 'Transaction': ['Admission', 'Fees Receipt', 'Inquiry'],
                    
                    // The current implementation in UserRest.jsx uses SIMPLE names.
                    // But Transaction menu has 'Inquiry' -> 'Online' ...
                    // If I auto-generate, I need to make sure the names match what the permission check expects.
                    // Let's use the TITLE/NAME as the key.
                } else {
                    pages.push(sub.title);
                }
            });
        }

        if (pages.length > 0) {
             // For Transaction, the names in current UserRights.jsx were ['Admission', 'Fees Receipt', 'Inquiry']
             // In my new config:
             // 'Inquiry' (Group) -> Online, Offline, DSR
             // 'Visitors' (Group) -> ...
             // Standing items: Student Admission, Pending..., Fees Receipt
             
             // To preserve existing functionality, I should map these carefully.
             // The user asked "If we add new options or suboptions... add them automatically".
             // So I should populate based on the Config.
             sections[item.title] = pages;
        }
    });
    
    // Add 'User Rights' manually to Master if not present (logic in Component handles hiding it for non-SuperAdmin, but here we define checking list)
    if (sections['Master'] && !sections['Master'].includes('User Rights')) {
        sections['Master'].push('User Rights');
    }

    return sections;
};
