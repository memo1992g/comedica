"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import styles from './styles/DashboardSidebar.module.css';
import { sidebarItems } from './consts/dashboard-sidebar.config';
import type { Item, SubItem } from './consts/dashboard-sidebar.config';
import Image from "next/image";

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
      (item) =>
        item.children && pathname.startsWith(item.basePath ?? item.href),
    );
    return match?.basePath ?? match?.href ?? null;
  }, [pathname]);

  const [expandedItem, setExpandedItem] = useState<string | null>(
    currentParentKey,
  );
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedSubitems, setExpandedSubitems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpandedItem(currentParentKey);
  }, [currentParentKey]);

  useEffect(() => {
    const nextExpanded: Record<string, boolean> = {};

    sidebarItems.forEach((item) => {
      item.children?.forEach((child) => {
        if (child.children?.length) {
          nextExpanded[child.href] = pathname.startsWith(child.href);
        }
      });
    });

    setExpandedSubitems(nextExpanded);
  }, [pathname]);

  const initials = (user?.fullName || user?.username || 'AP')
    .split(' ')
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  const handleItemClick = (item: Item, e: React.MouseEvent) => {
    if (item.children && item.children.length > 0 && !isCollapsed) {
      e.preventDefault();
      const itemKey = item.basePath ?? item.href;
      setExpandedItem(expandedItem === itemKey ? null : itemKey);
    }
  };

  const handleSubitemClick = (subitem: SubItem, e: React.MouseEvent) => {
    if (!subitem.children?.length || isCollapsed) {
      return;
    }

    e.preventDefault();
    setExpandedSubitems((prev) => ({
      ...prev,
      [subitem.href]: !prev[subitem.href],
    }));
  };

  const renderSubmenuItems = (items: SubItem[], level = 0) => {
    return items.map((child) => {
      const childActive = pathname === child.href || pathname.startsWith(child.href + '/');
      const hasChildren = Boolean(child.children?.length);
      const isSubExpanded = Boolean(expandedSubitems[child.href]);

      return (
        <div key={child.href} className={styles.submenuItemWrapper}>
          <Link
            href={child.href}
            className={`${styles.submenuItem} ${childActive ? styles.submenuActive : ''}`}
            style={{ paddingLeft: `${8 + level * 14}px` }}
            onClick={(e) => handleSubitemClick(child, e)}
          >
            <span>{child.label}</span>
            {hasChildren && (
              isSubExpanded
                ? <ChevronDown className={styles.submenuChev} />
                : <ChevronRight className={styles.submenuChev} />
            )}
          </Link>

          {hasChildren && isSubExpanded && (
            <div className={styles.nestedSubmenu}>
              {renderSubmenuItems(child.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <aside className={isCollapsed ? styles.sidebarCollapsed : styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logoRow}>          
          <Image
            className={styles.logo}
            src={
              isCollapsed
                ? "/images/comedica-logo-white-small.svg"
                : "/images/comedica-logo-white.svg"
            }
            alt='Comédica'
            width={isCollapsed ? 40 : 200}
            height={isCollapsed ? 40 : 50}
          />
        </div>

        {!isCollapsed && (
          <button
            className={styles.toggle}
            onClick={onToggle}
            aria-label='Colapsar sidebar'
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {sidebarItems.map((it) => {
          const itemKey = it.basePath ?? it.href;
          const matchPath = it.basePath ?? it.href;
          const active =
            pathname === it.href || pathname.startsWith(matchPath + "/");
          const isExpanded = expandedItem === itemKey;
          const hasChildren = it.children && it.children.length > 0;
          const isHovered = hoveredItem === itemKey;

          return (
            <div
              key={it.href}
              className={styles.navGroup}
              onMouseEnter={() =>
                isCollapsed && hasChildren && setHoveredItem(itemKey)
              }
              onMouseLeave={() => isCollapsed && setHoveredItem(null)}
            >
              <Link
                href={it.href}
                className={`${styles.navItem} ${active ? styles.active : ""}`}
                title={isCollapsed ? it.label : undefined}
                onClick={(e) => handleItemClick(it, e)}
              >
                <Image className={styles.icon} src={it.icon} alt='' width={24} height={24} />
                {!isCollapsed && (
                  <span className={styles.label}>
                    {it.label}
                    {hasChildren &&
                      (isExpanded ? (
                        <ChevronDown className={styles.chev} />
                      ) : (
                        <ChevronRight className={styles.chev} />
                      ))}
                  </span>
                )}
              </Link>

              {!isCollapsed && hasChildren && (
                <div
                  className={`${styles.submenu} ${isExpanded ? styles.submenuExpanded : styles.submenuCollapsed}`}
                >
                  {renderSubmenuItems(it.children!)}
                </div>
              )}

              {isCollapsed && hasChildren && isHovered && (
                <div className={styles.popover}>
                  <div className={styles.popoverTitle}>{it.label}</div>
                  {it.children!.map((child) => {
                    const childActive =
                      pathname === child.href ||
                      pathname.startsWith(child.href + "/");
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`${styles.popoverItem} ${childActive ? styles.popoverItemActive : ""}`}
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
        <div className={styles.avatar}>{initials || "AP"}</div>
        {!isCollapsed && (
          <div className={styles.userText}>
            <div className={styles.userName}>
              {user?.fullName || user?.username || "Amy Pérez"}
            </div>
            <div className={styles.userRole}>
              {user?.role || "Administrador"}
            </div>
          </div>
        )}
        {!isCollapsed && <div className={styles.dots}>⋮</div>}
      </div>
    </aside>
  );
}
