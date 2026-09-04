import Link from 'next/link';
import { academyConfig } from '@/config/academy';
import { Camera, Globe, Video, MapPin, Phone, Mail } from 'lucide-react';
import ScrollReveal from './motion/ScrollReveal';

export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      color: '#fff',
      padding: '4rem 0 2rem',
      marginTop: 'auto',
      borderTop: '4px solid var(--color-gold)',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(/images/textures/stone.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -2,
      }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(30, 30, 30, 0.92)',
        zIndex: -1,
      }} />
      
      <ScrollReveal direction="up" delay={0.1}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Column */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>
              {academyConfig.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {academyConfig.description}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href={academyConfig.social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.8 }}>
                <Camera size={20} />
              </a>
              <a href={academyConfig.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.8 }}>
                <Globe size={20} />
              </a>
              <a href={academyConfig.social.youtube} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.8 }}>
                <Video size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.5rem', color: '#fff' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About the Guru</Link></li>
              <li><Link href="/training" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Training Programs</Link></li>
              <li><Link href="/rankings" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Student Rankings</Link></li>
              <li><Link href="/admissions" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Admissions</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '1.5rem', color: '#fff' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                <MapPin size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                <span>{academyConfig.contact.address}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                <Phone size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <span>{academyConfig.contact.phone}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                <Mail size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <span>{academyConfig.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.3}>
        <div className="container" style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.6)'
        }}>
          <p>&copy; {new Date().getFullYear()} {academyConfig.name}. All rights reserved.</p>
          <p>Built for the Classical Arts</p>
        </div>
      </ScrollReveal>
    </footer>
  );
}
