import { useEffect, useRef, useState } from 'react';
import type { MainTab, SubTab, TabIndicatorStyle, SearchHistoryEntry, UserResult } from '../interfaces/UsersConsultations';
import { consultUser } from '@/lib/api/user-management.service';
import { toConsultationUser } from '@/lib/api/types/user-management.types';

const MAX_HISTORY_ENTRIES = 5;

export function useUsersConsultations() {
  const [activeTab, setActiveTab] = useState<MainTab>('usuarios');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.dui.includes(searchQuery) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.includes(searchQuery)
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
        const consultationUser = toConsultationUser(profile);

        if (!cancelled) {
          setSelectedUser(consultationUser);
          setUsers((currentUsers) => {
            const withoutDuplicated = currentUsers.filter((user) => user.id !== consultationUser.id);
            return [consultationUser, ...withoutDuplicated];
          });
          setSearchHistory((currentHistory) => {
            const query = searchQuery.trim();
            const now = new Date();
            const entry: SearchHistoryEntry = {
              id: `${now.getTime()}`,
              query,
              timestamp: now.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' }),
            };

            const deduped = currentHistory.filter((item) => item.query !== query);
            return [entry, ...deduped].slice(0, MAX_HISTORY_ENTRIES);
          });
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

    void fetchUser();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, filteredUsers.length]);

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
    setActiveSubTab('general');

    const matchedUser = users.find((user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.dui.includes(query) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.id.includes(query)
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
    users,
    searchHistory,
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
