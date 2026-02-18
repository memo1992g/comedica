import { useEffect, useRef, useState } from 'react';
import { mockUsers } from '../data/mock-data';
import type { UserResult } from '../data/mock-data';
import type { MainTab, SubTab, TabIndicatorStyle, View } from '../interfaces/UsersConsultations';

export function useUsersConsultations() {
  const [activeTab, setActiveTab] = useState<MainTab>('usuarios');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [currentView, setCurrentView] = useState<View>('main');

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
    if (searchQuery && filteredUsers.length === 0) {
      setSelectedUser(null);
    }
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
    setCurrentView('main');
  };

  return {
    activeTab,
    activeSubTab,
    searchQuery,
    selectedUser,
    showSecurityModal,
    currentView,
    tabRefs,
    indicatorStyle,
    setActiveSubTab,
    setSearchQuery,
    setSelectedUser,
    setShowSecurityModal,
    setCurrentView,
    handleHistorySelect,
    handleSaveState,
    handleVerify,
    handleTabChange,
  };
}
