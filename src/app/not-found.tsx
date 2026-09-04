import Link from 'next/link';

export default function NotFound() {
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
      <h1 style={{ 
        fontFamily: 'var(--font-heading)', 
        fontSize: '4rem', 
        color: 'var(--color-maroon)',
        marginBottom: '1rem'
      }}>
        404
      </h1>
      <h2 style={{ 
        fontFamily: 'var(--font-heading)', 
        fontSize: '2rem', 
        color: 'var(--text-primary)',
        marginBottom: '1rem'
      }}>
        Page Not Found
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: '2rem',
        maxWidth: '500px'
      }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}
