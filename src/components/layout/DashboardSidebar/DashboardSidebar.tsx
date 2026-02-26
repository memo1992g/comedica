'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import styles from './styles/DashboardSidebar.module.css';
import { sidebarItems } from './consts/dashboard-sidebar.config';
import type { Item, SubItem } from './consts/dashboard-sidebar.config';

export default function DashboardSidebar({
  isCollapsed,
  onToggle,
}: Readonly<{
  isCollapsed: boolean;
  onToggle: () => void;
}>) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const currentParentKey = useMemo(() => {
    const match = sidebarItems.find(
      (item) => item.children && pathname.startsWith(item.basePath ?? item.href)
    );
    return match?.basePath ?? match?.href ?? null;
  }, [pathname]);

  const [expandedItem, setExpandedItem] = useState<string | null>(currentParentKey);
  const [expandedSubmenus, setExpandedSubmenus] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    setExpandedItem(currentParentKey);
  }, [currentParentKey]);

  const initials = (user?.fullName || user?.username || 'AP')
    .split(' ')
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

  const isPathActive = (href?: string) => !!href && (pathname === href || pathname.startsWith(`${href}/`));

  const hasActiveDescendant = (items?: SubItem[]) => {
    if (!items || !items.length) return false;

    return items.some((child) => {
      if (isPathActive(child.href)) return true;
      if (child.children?.length) return hasActiveDescendant(child.children);
      return false;
    });
  };

  const toggleSubmenu = (key: string, force?: boolean) => {
    setExpandedSubmenus((prev) => ({
      ...prev,
      [key]: typeof force === 'boolean' ? force : !prev[key],
    }));
  };

  const handleItemClick = (item: Item, e: React.MouseEvent) => {
    if (item.children && item.children.length > 0 && !isCollapsed) {
      e.preventDefault();
      const itemKey = item.basePath ?? item.href;
      setExpandedItem(expandedItem === itemKey ? null : itemKey);
    }
  };

  const renderSubItems = (items: SubItem[], level = 0, parentKey = ''): React.ReactNode => {
    return items.map((child, index) => {
      const itemKey = `${parentKey}-${level}-${index}-${child.label}`;
      const hasChildren = !!child.children?.length;
      const childActive = isPathActive(child.href);
      const childDescendantActive = hasActiveDescendant(child.children);
      const isExpanded = expandedSubmenus[itemKey] ?? childDescendantActive;

      if (hasChildren) {
        return (
          <div key={itemKey} className={styles.submenuGroup}>
            <button
              type="button"
              className={`${styles.submenuToggle} ${childDescendantActive ? styles.submenuActive : ''}`}
              style={{ paddingLeft: `${8 + level * 14}px` }}
              onClick={() => toggleSubmenu(itemKey)}
            >
              <span>{child.label}</span>
              {isExpanded ? <ChevronDown className={styles.chev} /> : <ChevronRight className={styles.chev} />}
            </button>

            {isExpanded && (
              <div className={styles.submenuNested}>
                {renderSubItems(child.children!, level + 1, itemKey)}
              </div>
            )}
          </div>
        );
      }

      if (!child.href) return null;

      return (
        <Link
          key={itemKey}
          href={child.href}
          className={`${styles.submenuItem} ${childActive ? styles.submenuActive : ''}`}
          style={{ paddingLeft: `${8 + level * 14}px` }}
        >
          {child.label}
        </Link>
      );
    });
  };

  return (
    <aside className={isCollapsed ? styles.sidebarCollapsed : styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logoRow}>
          <img
            className={styles.logo}
            src="/images/comedica-logo-white.png"
            alt="Comédica"
          />
        </div>

        {!isCollapsed && (
          <button className={styles.toggle} onClick={onToggle} aria-label="Colapsar sidebar">
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {sidebarItems.map((it) => {
          const itemKey = it.basePath ?? it.href;
          const matchPath = it.basePath ?? it.href;
          const active = pathname === it.href || pathname.startsWith(matchPath + '/');
          const isExpanded = expandedItem === itemKey;
          const hasChildren = it.children && it.children.length > 0;
          const submenuHeight = hasChildren ? 640 : 0;
          const isHovered = hoveredItem === itemKey;

          return (
            <div
              key={it.href}
              className={styles.navGroup}
              onMouseEnter={() => isCollapsed && hasChildren && setHoveredItem(itemKey)}
              onMouseLeave={() => isCollapsed && setHoveredItem(null)}
            >
              <Link
                href={it.href}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
                title={isCollapsed ? it.label : undefined}
                onClick={(e) => handleItemClick(it, e)}
              >
                <img className={styles.icon} src={it.icon} alt="" />
                {!isCollapsed && (
                  <span className={styles.label}>
                    {it.label}
                    {hasChildren && (
                      isExpanded ? <ChevronDown className={styles.chev} /> : <ChevronRight className={styles.chev} />
                    )}
                  </span>
                )}
              </Link>

              {!isCollapsed && hasChildren && (
                <div
                  className={`${styles.submenu} ${isExpanded ? styles.submenuExpanded : styles.submenuCollapsed}`}
                  style={{ maxHeight: isExpanded ? submenuHeight : 0 }}
                >
                  {renderSubItems(it.children!, 0, itemKey)}
                </div>
              )}

              {isCollapsed && hasChildren && isHovered && (
                <div className={styles.popover}>
                  <div className={styles.popoverTitle}>{it.label}</div>
                  {it.children!.map((child, idx) => {
                    if (!child.href) {
                      return (
                        <div key={`${child.label}-${idx}`} className={styles.popoverGroupLabel}>
                          {child.label}
                        </div>
                      );
                    }

                    const childActive = pathname === child.href || pathname.startsWith(child.href + '/');
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`${styles.popoverItem} ${childActive ? styles.popoverItemActive : ''}`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className={styles.userBar}>
        <div className={styles.avatar}>{initials || 'AP'}</div>
        {!isCollapsed && (
          <div className={styles.userText}>
            <div className={styles.userName}>{user?.fullName || user?.username || 'Amy Pérez'}</div>
            <div className={styles.userRole}>{user?.role || 'Administrador'}</div>
          </div>
        )}
        {!isCollapsed && <div className={styles.dots}>⋮</div>}
      </div>
    </aside>
  );
}
