import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--color-ivory)',
        padding: '4rem 2rem',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-dark)',
        maxWidth: '500px',
        width: '100%',
        borderTop: '4px solid #C62828'
      }}>
        <ShieldAlert size={64} style={{ color: '#C62828', marginBottom: '1.5rem', opacity: 0.8 }} />
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          color: 'var(--color-maroon)',
          marginBottom: '1rem'
        }}>Access Denied</h1>
        
        <p style={{
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          fontSize: '1.05rem'
        }}>
          You do not have permission to view this page. If you believe this is an error, please contact the academy administration.
        </p>
        
        <Link href="/" className="btn btn-primary btn-large">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
