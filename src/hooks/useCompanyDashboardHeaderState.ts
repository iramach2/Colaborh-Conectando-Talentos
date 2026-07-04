import { useEffect, useRef, useState } from 'react';

export const useCompanyDashboardHeaderState = () => {
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    companyDropdownRef,
    profileMenuRef,
    isCompanyDropdownOpen,
    setIsCompanyDropdownOpen,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    companySearchQuery,
    setCompanySearchQuery,
  };
};
