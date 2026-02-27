import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { AttentionType } from '../../data/mock-data';
import { getQuestionnaireQuestions, validateQuestionnaire } from '@/lib/api/user-management.service';
import styles from './styles/security-modal.module.css';

interface SecurityVerificationModalProps {
  attentionType: AttentionType;
  clientIdentifier: number;
  onClose: () => void;
  onVerified: () => void;
}

export default function SecurityVerificationModal({
  attentionType,
  clientIdentifier,
  onClose,
  onVerified,
}: SecurityVerificationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionnaire, setQuestionnaire] = useState<{
    reasonCode: string;
    description: string;
    questions: Array<{ id: number; text: string }>;
    requiresQuestionnaire: boolean;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getQuestionnaireQuestions(attentionType.code);
        if (!mounted) return;

        setQuestionnaire({
          reasonCode: response.reasonCode,
          description: response.description,
          questions: response.questions,
          requiresQuestionnaire: response.requiresQuestionnaire,
        });

        if (!response.requiresQuestionnaire || response.questions.length === 0) {
          onVerified();
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'No fue posible cargar las preguntas de seguridad');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadQuestions();

    return () => {
      mounted = false;
    };
  }, [attentionType.code, onVerified]);

  const questions = questionnaire?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentReasonCode = questionnaire?.reasonCode ?? attentionType.code;

  const canVerify = useMemo(() => {
    if (loading || submitting || !currentQuestion) return false;
    return answer.trim().length > 0;
  }, [answer, currentQuestion, loading, submitting]);

  const submitValidation = async (nextAnswers: Record<number, string>) => {
    try {
      setSubmitting(true);
      setError(null);

      const payload = questions.map((question) => ({
        questionId: question.id,
        answer: (nextAnswers[question.id] ?? '').trim(),
      }));

      const result = await validateQuestionnaire({
        reasonCode: currentReasonCode,
        clientIdentifier,
        answers: payload,
      });

      if (!result.valid) {
        setError('No fue posible validar las respuestas de seguridad.');
        return;
      }

      onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible validar las respuestas');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = () => {
    if (!currentQuestion || !answer.trim()) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: answer.trim(),
    };
    setAnswers(nextAnswers);

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      const nextQuestion = questions[currentIndex + 1];
      setAnswer(nextQuestion ? (nextAnswers[nextQuestion.id] ?? '') : '');
      return;
    }

    void submitValidation(nextAnswers);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Verificación de Seguridad</h2>
          <p className={styles.modalSubtitle}>
            Tipo de atención: {attentionType.name}
          </p>
          {!loading && questions.length > 0 && (
            <p className={styles.modalProgress}>
              Pregunta {currentIndex + 1} de {questions.length}
            </p>
          )}
        </div>

        {loading ? (
          <p className={styles.fieldHint}>Cargando preguntas de seguridad...</p>
        ) : (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="security-answer">
              {currentQuestion?.text ?? 'No se encontraron preguntas para este motivo'}
            </label>
            <input
              id="security-answer"
              className={styles.fieldInput}
              type="text"
              placeholder="Ingrese su respuesta"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!currentQuestion || submitting}
            />
            <p className={styles.fieldHint}>Presione Enter para continuar</p>
          </div>
        )}

        {error && (
          <p className={styles.errorMessage}>
            {error}
          </p>
        )}

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className={styles.verifyButton}
            onClick={handleVerify}
            type="button"
            disabled={!canVerify}
          >
            {isLastQuestion ? 'Validar' : 'Verificar'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
