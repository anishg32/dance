"use client";

import { useTransition } from 'react';
import { updateRankingSettings } from './actions';
import styles from './RankingsAdmin.module.css';

interface SettingsProps {
  settings: {
    points1stPlace: number;
    points2ndPlace: number;
    points3rdPlace: number;
    pointsParticipation: number;
    pointsPerformance: number;
  } | null;
}

export default function RankingsSettingsForm({ settings }: SettingsProps) {
  const [isPending, startTransition] = useTransition();

  const action = async (formData: FormData) => {
    startTransition(async () => {
      await updateRankingSettings(formData);
      alert("Settings updated successfully and rankings recalculated.");
    });
  };

  return (
    <form action={action} className={styles.settingsForm}>
      <h2 className={styles.sectionTitle}>Ranking Weight Configuration</h2>
      <p className={styles.sectionDesc}>Adjust how points are awarded. Changes will immediately trigger a recalculation.</p>
      
      <div className={styles.gridSettings}>
        <div className={styles.inputGroup}>
          <label>1st Place Points</label>
          <input type="number" name="points1stPlace" defaultValue={settings?.points1stPlace || 100} required />
        </div>
        <div className={styles.inputGroup}>
          <label>2nd Place Points</label>
          <input type="number" name="points2ndPlace" defaultValue={settings?.points2ndPlace || 75} required />
        </div>
        <div className={styles.inputGroup}>
          <label>3rd Place Points</label>
          <input type="number" name="points3rdPlace" defaultValue={settings?.points3rdPlace || 50} required />
        </div>
        <div className={styles.inputGroup}>
          <label>Participation Points</label>
          <input type="number" name="pointsParticipation" defaultValue={settings?.pointsParticipation || 20} required />
        </div>
        <div className={styles.inputGroup}>
          <label>Performance Points</label>
          <input type="number" name="pointsPerformance" defaultValue={settings?.pointsPerformance || 10} required />
        </div>
      </div>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <button type="submit" className="btn btn-outline" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}
