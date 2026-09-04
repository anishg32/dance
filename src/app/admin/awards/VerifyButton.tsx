"use client";

import { useState, useTransition } from 'react';
import { toggleAwardVerification } from './actions';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import styles from './AwardsAdmin.module.css';

export default function VerifyButton({ awardId, isVerified }: { awardId: string, isVerified: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleAwardVerification(awardId, isVerified);
    });
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={isPending}
      className={`${styles.verifyBtn} ${isVerified ? styles.btnVerified : styles.btnUnverified}`}
      title={isVerified ? "Unverify Award" : "Verify Award"}
    >
      {isPending ? (
        <Loader2 size={16} className={styles.spinner} />
      ) : isVerified ? (
        <><ShieldCheck size={16} /> Verified</>
      ) : (
        <><ShieldAlert size={16} /> Unverified</>
      )}
    </button>
  );
}
