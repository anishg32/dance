import { academyConfig } from "@/config/academy";
import Link from 'next/link';
import { BookOpen, Star, Crown, Sparkles, CheckCircle, Clock, MapPin } from 'lucide-react';
import ParallaxSection from '@/components/motion/ParallaxSection';
import PremiumImage from '@/components/ui/PremiumImage';
import styles from './Training.module.css';

export const metadata = {
  title: `Training Programs | ${academyConfig.name}`,
  description: 'Explore our Bharatanatyam curriculum and training programs from beginner to advanced levels.',
};

export default function TrainingPage() {
  const programs = [
    {
      level: 'Beginner Level',
      icon: <BookOpen size={32} />,
      duration: '2-3 Years',
      description: 'The foundation phase focusing on stamina, basic postures (Aramandi), and the fundamental Adavus (footwork).',
      curriculum: [
        'Namaskaram and its significance',
        'Basic postures: Samapadam, Aramandi, Muzhumandi',
        'Tatta Adavu to Tirmanam Adavu',
        'Asamyuta Hastas (Single hand gestures)',
        'Samyuta Hastas (Double hand gestures)'
      ]
    },
    {
      level: 'Intermediate Level',
      icon: <Star size={32} />,
      duration: '3-4 Years',
      description: 'Transitioning from pure dance (Nritta) to expressional dance (Nritya) with basic choreographies.',
      curriculum: [
        'Alarippu (different talas)',
        'Jatiswaram',
        'Shabdam',
        'Introduction to Abhinaya (expressions)',
        'Navarasas (Nine emotions)'
      ]
    },
    {
      level: 'Advanced Level',
      icon: <Crown size={32} />,
      duration: '3-5 Years',
      description: 'Rigorous training in complex rhythmic patterns, deep emotional expression, and full-length repertoire pieces.',
      curriculum: [
        'Varnam (The centerpiece of Bharatanatyam)',
        'Padams and Javalis',
        'Keertanams',
        'Tillana',
        'Advanced Nattuvangam practice'
      ]
    },
    {
      level: 'Arangetram Preparation',
      icon: <Sparkles size={32} />,
      duration: '1-2 Years',
      description: 'Intensive one-on-one training to perfect the entire Margam for the solo debut stage performance.',
      curriculum: [
        'Endurance training for a 2.5 hour solo',
        'Polishing the complete repertoire',
        'Live orchestra rehearsals',
        'Stage presence and stamina building',
        'Thematic choreography'
      ]
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <ParallaxSection 
        className={styles.heroSection} 
        speed={0.5}
        backgroundImage={<PremiumImage src="/images/training/ghungroo.jpg" alt="Training" fill overlay="dark" />}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className={styles.heroTitle}>Training Programs</h1>
          <p className={styles.heroSubtitle}>A structured, traditional curriculum designed to shape passionate dancers into complete artists.</p>
        </div>
      </ParallaxSection>

      <div className="container" style={{ marginBottom: '6rem' }}>
        <div className={styles.introBox}>
          <div className={styles.introContent}>
            <h2>Our Philosophy</h2>
            <p>At {academyConfig.name}, we follow the revered Kalakshetra style of Bharatanatyam. Our training goes beyond mere physical movements; we focus on the holistic development of the student—instilling discipline, cultural awareness, physical endurance, and emotional depth.</p>
          </div>
          <div className={styles.introStats}>
            <div className={styles.statItem}>
              <Clock size={24} className={styles.statIcon} />
              <div>
                <strong>Weekly Classes</strong>
                <span>2-3 sessions per week</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <MapPin size={24} className={styles.statIcon} />
              <div>
                <strong>Location</strong>
                <span>Main Academy Studio</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>The Curriculum</h2>
        
        <div className={styles.programsGrid}>
          {programs.map((program, index) => (
            <div key={index} className={styles.programCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>{program.icon}</div>
                <div>
                  <h3 className={styles.programTitle}>{program.level}</h3>
                  <div className={styles.programDuration}>{program.duration}</div>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.programDesc}>{program.description}</p>
                <div className={styles.curriculumList}>
                  <h4>Key Focus Areas:</h4>
                  <ul>
                    {program.curriculum.map((item, i) => (
                      <li key={i}>
                        <CheckCircle size={16} className={styles.checkIcon} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <h2>Begin Your Journey</h2>
          <p>We are currently accepting new enrollments for the upcoming academic year. Limited spots available.</p>
          <div className={styles.ctaButtons}>
            <Link href="/admissions" className="btn btn-primary btn-large">Apply for Admission</Link>
            <Link href="/contact" className="btn btn-outline btn-large">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
