'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <AlertCircle size={64} style={{ color: '#D32F2F', marginBottom: '1.5rem' }} />
      <h2 style={{ 
        fontFamily: 'var(--font-heading)', 
        fontSize: '2rem', 
        color: 'var(--text-primary)',
        marginBottom: '1rem'
      }}>
        Something went wrong
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: '2.5rem',
        maxWidth: '500px'
      }}>
        An unexpected error occurred. Our team has been notified.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          className="btn btn-outline"
        >
          Try again
        </button>
        <Link href="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
