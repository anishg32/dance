import { academyConfig } from "@/config/academy";
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      width: '100%',
      color: 'var(--color-maroon)'
    }}>
      <Loader2 size={48} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <h3 style={{ 
        marginTop: '1.5rem', 
        fontFamily: 'var(--font-heading)', 
        color: 'var(--color-maroon)',
        letterSpacing: '1px'
      }}>
        Loading {academyConfig.name}
      </h3>
    </div>
  );
}
