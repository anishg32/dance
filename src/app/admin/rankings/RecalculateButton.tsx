"use client";

import { useState, useTransition } from 'react';
import { forceRecalculateRankings } from './actions';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import styles from './RankingsAdmin.module.css';

export default function RecalculateButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleRecalculate = () => {
    if (!window.confirm("Are you sure you want to forcibly recalculate all rankings? This may take a few moments and will update the live public leaderboards.")) {
      return;
    }

    setStatus('idle');
    startTransition(async () => {
      const res = await forceRecalculateRankings();
      if (res.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    });
  };

  return (
    <div className={styles.recalcWrapper}>
      <button 
        onClick={handleRecalculate} 
        disabled={isPending}
        className="btn btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <RefreshCw size={18} className={isPending ? styles.spin : ''} />
        {isPending ? 'Recalculating...' : 'Recalculate Rankings'}
      </button>
      
      {status === 'success' && (
        <span className={styles.statusSuccess}><CheckCircle size={16} /> Rankings Updated</span>
      )}
      {status === 'error' && (
        <span className={styles.statusError}><AlertTriangle size={16} /> Recalculation Failed</span>
      )}
    </div>
  );
}
