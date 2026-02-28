"use client";

import React, { useRef, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from "./styles/users-role-tabs.module.css";

export type UsersRoleTab = "detallada" | "resumen";

interface UsersRoleTabsProps {
  activeTab: UsersRoleTab;
  onTabChange: (tab: UsersRoleTab) => void;
}

const tabs: { id: UsersRoleTab; label: string }[] = [
  { id: "detallada", label: "Vista detallada" },
  { id: "resumen", label: "Resumen por rol" },
];

export default function UsersRoleTabs({
  activeTab,
  onTabChange,
}: UsersRoleTabsProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as UsersRoleTab)}
      className={styles.tabsContainer}
    >
      <TabsList className={styles.tabsList}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            className={styles.tabTrigger}
          >
            {tab.label}
          </TabsTrigger>
        ))}
        <div
          className={styles.indicator}
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </TabsList>
    </Tabs>
  );
}
