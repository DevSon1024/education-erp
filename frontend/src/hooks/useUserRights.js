import { useSelector } from 'react-redux';

/**
 * Custom hook to check permissions for a specific page.
 * @param {string} pageName - The name of the page to check permissions for (e.g., 'Course', 'Student').
 * @returns {object} - { canView, canAdd, canEdit, canDelete }
 */
const useUserRights = (pageName) => {
  const { myPermissions } = useSelector((state) => state.userRights);
  const { user } = useSelector((state) => state.auth);

  // Safety fallback: If no user or permissions not loaded yet
  if (!user) return { canView: false, canAdd: false, canEdit: false, canDelete: false };

  // Super Admin bypass: Always has full rights
  if (user.role === 'Super Admin') {
    return { canView: true, canAdd: true, canEdit: true, canDelete: true };
  }

  // Find permissions for the specific page
  // Note: pageName must match exactly what is in the DB/Config (e.g. 'Student', 'Course')
  const permission = myPermissions?.find(p => p.page === pageName);

  if (!permission) {
    // If no specific permission record exists, default to FALSE for safety
    return { canView: false, canAdd: false, canEdit: false, canDelete: false };
  }

  return {
    canView: !!permission.view,
    canAdd: !!permission.add,
    canEdit: !!permission.edit,
    canDelete: !!permission.delete
  };
};

export default useUserRights;
