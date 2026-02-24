import { useEffect, useRef, useState } from 'react';
import { mockUsers } from '../data/mock-data';
import type { UserResult } from '../data/mock-data';
import type { MainTab, SubTab, TabIndicatorStyle } from '../interfaces/UsersConsultations';
import { consultUser } from '@/lib/api/user-management.service';
import { toConsultationUser } from '@/lib/api/types/user-management.types';

export function useUsersConsultations() {
  const [activeTab, setActiveTab] = useState<MainTab>('usuarios');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<TabIndicatorStyle>({ left: 0, width: 0 });

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (!activeTabElement) {
      return;
    }

    setIndicatorStyle({
      left: activeTabElement.offsetLeft,
      width: activeTabElement.offsetWidth,
    });
  }, [activeTab]);

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.dui.includes(searchQuery) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSelectedUser(null);
      setSearchError(null);
      return;
    }

    const isAssociatedNumber = /^\d{5,}$/.test(searchQuery.trim());
    if (!isAssociatedNumber) {
      if (filteredUsers.length === 0) {
        setSelectedUser(null);
      }
      setSearchError(null);
      return;
    }

    let cancelled = false;

    const fetchUser = async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const profile = await consultUser(Number(searchQuery.trim()));
        if (!cancelled) {
          setSelectedUser(toConsultationUser(profile));
        }
      } catch (error) {
        if (!cancelled) {
          setSelectedUser(null);
          setSearchError(error instanceof Error ? error.message : 'No fue posible consultar el usuario');
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, filteredUsers.length]);

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
    setActiveSubTab('general');

    const matchedUser = mockUsers.find((user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.dui.includes(query) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    );

    setSelectedUser(matchedUser ?? null);
  };

  const handleSaveState = () => setShowSecurityModal(true);
  const handleVerify = (_answer: string) => setShowSecurityModal(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value as MainTab);
  };

  return {
    activeTab,
    activeSubTab,
    searchQuery,
    selectedUser,
    showSecurityModal,
    tabRefs,
    indicatorStyle,
    isSearching,
    searchError,
    setActiveSubTab,
    setSearchQuery,
    setSelectedUser,
    setShowSecurityModal,
    handleHistorySelect,
    handleSaveState,
    handleVerify,
    handleTabChange,
  };
}
