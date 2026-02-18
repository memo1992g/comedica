'use client';

import React from 'react';
import styles from './login.module.css';
import LoginForm from '@/components/auth/LoginForm';
import LoginCarousel from '@/components/auth/LoginCarousel';

export default function LoginPage() {
  return (
    <div className={styles.loginRoot}>
      {/* Izquierda */}
      <section className={styles.leftPanel}>
        <div className={styles.leftInner}>
          {/* Logo (poné tu archivo en /public/images/comedica-logo.png) */}
          <div className={styles.brand}>
            <img
              className={styles.brandLogo}
              src="/images/comedica-logo.png"
              alt="Comédica"
            />
          </div>

          <h1 className={styles.title}>Bienvenido</h1>
          <p className={styles.subtitle}>Ingresa tus credenciales para acceder</p>

          <div className={styles.formWrap}>
            <LoginForm />
          </div>
        </div>
      </section>

      {/* Derecha */}
      <section className={styles.rightPanel}>
        <LoginCarousel />
      </section>
    </div>
  );
}
