import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Button from '@/components/ui/Button';
import type { MutableRefObject } from 'react';
import { MAIN_TABS } from '../../interfaces/UsersConsultations';
import type { MainTab, TabIndicatorStyle } from '../../interfaces/UsersConsultations';
import styles from '../../styles/users-consultations.module.css';

interface MainTabsProps {
  activeTab: MainTab;
  onTabChange: (value: string) => void;
  tabRefs: MutableRefObject<Record<string, HTMLButtonElement | null>>;
  indicatorStyle: TabIndicatorStyle;
  showHistoryButton: boolean;
  onHistoryClick: () => void;
}

export default function MainTabs({
  activeTab,
  onTabChange,
  tabRefs,
  indicatorStyle,
  showHistoryButton,
  onHistoryClick,
}: MainTabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className={styles.tabsList}>
          {MAIN_TABS.map((tab) => (
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
      {showHistoryButton && (
        <Button
          variant="outline"
          size="sm"
          className={styles.historyButton}
          onClick={onHistoryClick}
        >
          Historial
        </Button>
      )}
    </div>
  );
}
