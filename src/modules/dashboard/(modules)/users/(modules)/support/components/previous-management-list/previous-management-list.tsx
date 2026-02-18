import React, { useState } from 'react';
import { Search, Calendar, Filter, CheckCircle2, XCircle } from 'lucide-react';
import type { PreviousManagement } from '../../data/mock-data';
import styles from './styles/previous-management.module.css';

interface PreviousManagementListProps {
  managements: PreviousManagement[];
}

export default function PreviousManagementList({ managements }: PreviousManagementListProps) {
  const [search, setSearch] = useState('');

  const filtered = managements.filter((m) =>
    m.userName.toLowerCase().includes(search.toLowerCase()) ||
    m.managementType.toLowerCase().includes(search.toLowerCase()) ||
    m.comment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar en historial..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.filterButton} type="button" aria-label="Filtrar por fecha">
            <Calendar size={16} />
          </button>
          <button className={styles.filterButton} type="button" aria-label="Filtrar">
            <Filter size={16} />
          </button>
        </div>
        <p className={styles.count}>{filtered.length} gestiones encontradas</p>
      </div>

      {filtered.map((m) => (
        <div key={m.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardAvatar}>
              <Search size={16} />
            </div>
            <div className={styles.cardUserInfo}>
              <p className={styles.cardUserName}>{m.userName}</p>
              <p className={styles.cardUserMeta}>
                ID: {m.userId} • DUI: {m.userDui}
              </p>
            </div>
          </div>
          <p className={styles.cardType}>{m.managementType}</p>

          <p className={styles.sectionLabel}>Preguntas de seguridad</p>
          {m.securityQuestions.map((q) => (
            <div key={q.question} className={styles.questionItem}>
              {q.result === 'Correcta' ? (
                <CheckCircle2 size={14} className={styles.questionIconCorrect} />
              ) : (
                <XCircle size={14} className={styles.questionIconIncorrect} />
              )}
              <div>
                <p className={styles.questionText}>{q.question}</p>
                <p className={`${styles.questionResult} ${q.result === 'Correcta' ? styles.resultCorrect : styles.resultIncorrect}`}>
                  {q.result}
                </p>
              </div>
            </div>
          ))}
          <p className={styles.totalResult}>
            Resultado: {m.totalCorrect} de {m.totalQuestions} correctas
          </p>

          <p className={styles.sectionLabel}>Comentario</p>
          <p className={styles.commentText}>{m.comment}</p>
        </div>
      ))}
    </div>
  );
}
