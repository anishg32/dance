import prisma from "@/lib/prisma";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from 'lucide-react';
import styles from './Events.module.css';



export const revalidate = 3600; // Revalidate every hour

export default async function PublicEventsPage() {
  const today = new Date();
  
  // Separate into upcoming and past events
  const upcomingEvents = await prisma.event.findMany({
    where: {
      published: true,
      date: { gte: today }
    },
    orderBy: { date: 'asc' }
  });

  const pastEvents = await prisma.event.findMany({
    where: {
      published: true,
      date: { lt: today }
    },
    orderBy: { date: 'desc' },
    take: 6
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className="container">
          <h1 className={styles.heroTitle}>Events & Workshops</h1>
          <p className={styles.heroSubtitle}>Join us for immersive workshops, special performances, and cultural celebrations.</p>
        </div>
      </div>

      <div className="container">
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>
        
        {upcomingEvents.length > 0 ? (
          <div className={styles.eventsList}>
            {upcomingEvents.map(event => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.dateCol}>
                  <span className={styles.dateMonth}>{event.date.toLocaleString('default', { month: 'short' })}</span>
                  <span className={styles.dateDay}>{event.date.getDate()}</span>
                  <span className={styles.dateYear}>{event.date.getFullYear()}</span>
                </div>
                
                <div className={styles.contentCol}>
                  <div className={styles.typeBadge}>{event.featured ? 'Featured' : 'Event'}</div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  
                  <div className={styles.metaRow}>
                    {event.time && (
                      <div className={styles.metaItem}>
                        <Clock size={16} /> {event.time}
                      </div>
                    )}
                    <div className={styles.metaItem}>
                      <MapPin size={16} /> {event.location}
                    </div>
                  </div>
                  
                  {event.description && (
                    <p className={styles.eventDesc}>{event.description}</p>
                  )}
                </div>
                
                <div className={styles.actionCol}>
                  <button className="btn btn-outline" style={{ width: '100%' }}>View Details</button>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Register</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <CalendarIcon size={48} className={styles.emptyIcon} />
            <h3>No upcoming events right now</h3>
            <p>Check back soon for new announcements and workshops.</p>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div className={styles.pastSection}>
            <h2 className={styles.sectionTitle}>Recent Highlights</h2>
            <div className={styles.pastGrid}>
              {pastEvents.map(event => (
                <div key={event.id} className={styles.pastCard}>
                  <div className={styles.pastHeader}>
                    <span className={styles.pastType}>{event.featured ? 'Featured' : 'Event'}</span>
                    <span className={styles.pastDate}>{event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h4 className={styles.pastTitle}>{event.title}</h4>
                  <p className={styles.pastLocation}><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />{event.location}</p>
                </div>
              ))}
            </div>
            <div className={styles.viewMoreContainer}>
              <a href="/performances" className={styles.viewMoreLink}>
                View complete performance archives <ArrowRight size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
