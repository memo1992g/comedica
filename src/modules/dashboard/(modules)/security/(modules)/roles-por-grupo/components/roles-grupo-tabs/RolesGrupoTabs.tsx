"use client";

import React, { useRef, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from "./styles/roles-grupo-tabs.module.css";

export type RolesGrupoTab = "detallada" | "resumen";

interface RolesGrupoTabsProps {
  activeTab: RolesGrupoTab;
  onTabChange: (tab: RolesGrupoTab) => void;
}

const tabs: { id: RolesGrupoTab; label: string }[] = [
  { id: "detallada", label: "Vista detallada" },
  { id: "resumen", label: "Vista resumida" },
];

export default function RolesGrupoTabs({
  activeTab,
  onTabChange,
}: RolesGrupoTabsProps) {
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
      onValueChange={(v) => onTabChange(v as RolesGrupoTab)}
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
