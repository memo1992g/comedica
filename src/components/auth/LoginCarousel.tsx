'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './LoginCarousel.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  src: string;
  alt: string;
  caption: string;
  captionStrong: string;
};

export default function LoginCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        src: '/images/login/slide-1.jpg',
        alt: 'Comédica',
        caption: 'Buscamos la satisfacción de',
        captionStrong: 'Asociados, Colaboradores y Clientes.',
      },
      {
        src: '/images/login/slide-2.jpg',
        alt: 'Comédica 2',
        caption: 'Atención integral para',
        captionStrong: 'cada asociado.',
      },
      {
        src: '/images/login/slide-3.jpg',
        alt: 'Comédica 3',
        caption: 'Compromiso y calidad con',
        captionStrong: 'nuestros clientes.',
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  const goTo = (next: number) => {
    const normalized = (next + slides.length) % slides.length;
    setIndex(normalized);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((p) => (p + 1) % slides.length);
    }, 8000);

    return () => window.clearInterval(id);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <div className={styles.carouselRoot}>
      <img className={styles.image} src={slide.src} alt={slide.alt} />
      <div className={styles.overlay} />

      <div className={styles.caption}>
        <div className={styles.captionText}>{slide.caption}</div>
        <div className={styles.captionStrong}>{slide.captionStrong}</div>
      </div>

      <div className={styles.controls}>
        <div className={styles.indicators}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.indicator} ${i === index ? styles.active : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>

        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => goTo(index - 1)}
            aria-label="Anterior"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            className={styles.navBtn}
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <button type="button" className={styles.help} aria-label="Ayuda">
          ?
        </button>
      </div>
    </div>
  );
}
