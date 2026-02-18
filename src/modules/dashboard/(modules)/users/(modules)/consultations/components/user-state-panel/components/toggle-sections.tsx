import { TOGGLE_SECTIONS } from '../consts/toogle-sections';
import styles from '../styles/state-management.module.css';

interface ToggleSectionsProps {
    toggles: Record<string, boolean>;
    onToggle: (key: string) => void;
}

export default function ToggleSections({ toggles, onToggle }: ToggleSectionsProps) {
    return (
        <div className={styles.sectionsWrapper}>
            {TOGGLE_SECTIONS.map((section) => (
                <div key={section.title} className={styles.toggleSection}>
                    <p className={styles.sectionTitle}>{section.title}</p>
                    <p className={styles.sectionDesc}>{section.description}</p>
                    <div className={styles.toggleGroup}>
                        {section.options.map((option) => (
                            <div key={option.key} className={styles.toggleRow}>
                                <div className={styles.toggleInfo}>
                                    <span className={styles.toggleLabel}>{option.label}</span>
                                    <span className={styles.toggleHint}>{option.hint}</span>
                                </div>
                                <button
                                    className={`${styles.toggle} ${toggles[option.key] ? styles.toggleOn : styles.toggleOff}`}
                                    onClick={() => onToggle(option.key)}
                                    type="button"
                                    aria-label={`${option.label} ${toggles[option.key] ? 'activado' : 'desactivado'}`}
                                >
                                    <span
                                        className={`${styles.toggleKnob} ${toggles[option.key] ? styles.toggleKnobOn : styles.toggleKnobOff}`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
