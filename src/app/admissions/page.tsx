"use client";
import { academyConfig } from "@/config/academy";
import { useState, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, ArrowRight, BookOpen, Star, GraduationCap, MapPin, Phone, Mail } from 'lucide-react';
import ParallaxSection from '@/components/motion/ParallaxSection';
import ScrollReveal from '@/components/motion/ScrollReveal';
import TiltCard from '@/components/motion/TiltCard';
import SectionDivider from '@/components/motion/SectionDivider';
import PremiumImage from '@/components/ui/PremiumImage';
import Link from 'next/link';
import styles from './Admissions.module.css';

export default function AdmissionsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    age: '',
    phone: '',
    email: '',
    experience: 'None',
    preferredLevel: 'Beginner',
    preferredBatch: 'Weekday Evenings',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"]
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit');
      }

      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  const timelineSteps = [
    { num: '01', title: 'Submit Enquiry', desc: 'Fill out the initial application form.' },
    { num: '02', title: 'Academy Review', desc: 'Our team reviews your details.' },
    { num: '03', title: 'Interaction', desc: 'A brief meeting with the Guru.' },
    { num: '04', title: 'Select Level', desc: 'Placement into the appropriate batch.' },
    { num: '05', title: 'Begin Journey', desc: 'Start your traditional training.' }
  ];

  return (
    <div className={styles.admissionsContainer}>
      <ParallaxSection 
        className={styles.heroSection} 
        speed={0.5}
        backgroundImage={<PremiumImage src="/images/admissions/stage.jpg" alt="Admissions Stage" fill overlay="dark" />}
      >
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <ScrollReveal direction="up" delay={0.2}>
            <h1 className={styles.heroTitle}>Begin Your Journey</h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4}>
            <p className={styles.heroSubtitle}>
              Bharatanatyam is not simply learned. It is experienced through discipline, expression, rhythm, and tradition.
            </p>
          </ScrollReveal>
        </div>
      </ParallaxSection>

      {/* 2. Application Section (Left Info + Right Form) */}
      <section className={styles.applicationSection}>
        <div className={`container ${styles.appContainer}`}>
          
          {/* Left Panel: Theatre Stage Vibe */}
          <div className={styles.infoPanel}>
            <PremiumImage src="/images/training/dancer.jpg" alt="Training" fill overlay="maroon" containerClassName={styles.infoBg} />
            <ScrollReveal direction="right">
              <h2 className={styles.infoTitle}>Why Train With Us</h2>
              <p className={styles.infoDesc}>
                We welcome students of all ages who possess a genuine passion for classical dance. Join {academyConfig.name} to discover the discipline, grace, and spiritual depth of Bharatanatyam.
              </p>
            </ScrollReveal>
            
            <div className={styles.featuresList}>
              <ScrollReveal direction="up" delay={0.2}>
                <TiltCard className={styles.featureCard} maxRotation={5} scale={1.02}>
                  <BookOpen className={styles.featureIcon} size={24} />
                  <div>
                    <h3 className={styles.featureTitle}>Traditional Guru-Shishya Parampara</h3>
                    <p className={styles.featureDesc}>Authentic training honoring the Tanjore style lineage.</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={0.3}>
                <TiltCard className={styles.featureCard} maxRotation={5} scale={1.02}>
                  <Star className={styles.featureIcon} size={24} />
                  <div>
                    <h3 className={styles.featureTitle}>Performance Opportunities</h3>
                    <p className={styles.featureDesc}>Regular stage exposure in prestigious cultural events.</p>
                  </div>
                </TiltCard>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.4}>
                <TiltCard className={styles.featureCard} maxRotation={5} scale={1.02}>
                  <GraduationCap className={styles.featureIcon} size={24} />
                  <div>
                    <h3 className={styles.featureTitle}>Structured Curriculum</h3>
                    <p className={styles.featureDesc}>Comprehensive syllabus from Adavus to Arangetram.</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Panel: Premium Form */}
          <div className={styles.formPanel}>
            {success ? (
              <motion.div 
                className={styles.successMessage}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              >
                <div className={styles.successIconWrapper}>
                  <CheckCircle size={64} className={styles.successIcon} />
                </div>
                <h2 className={styles.successTitle}>Application Received</h2>
                <p className={styles.successDesc}>
                  Thank you for your interest in {academyConfig.name}. Our admissions team will review your enquiry and contact you within 48 hours to discuss the next steps.
                </p>
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ studentName: '', parentName: '', age: '', phone: '', email: '', experience: 'None', preferredLevel: 'Beginner', preferredBatch: 'Weekday Evenings', message: '' });
                  }}
                  style={{ marginTop: '2rem' }}
                >
                  Submit Another Enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Admission Application</h2>
                  <div className={styles.goldDivider} />
                </div>
                
                {error && <div className={styles.error}>{error}</div>}
                
                <div className={styles.formSection}>
                  <h3 className={styles.sectionLabel}>01. Student Information</h3>
                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <input type="text" name="studentName" required value={formData.studentName} onChange={handleChange} placeholder=" " />
                      <label>Student Name *</label>
                    </div>
                    <div className={styles.inputGroup}>
                      <input type="number" name="age" min="4" max="60" required value={formData.age} onChange={handleChange} placeholder=" " />
                      <label>Age *</label>
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionLabel}>02. Contact Details</h3>
                  <div className={styles.inputGroup}>
                    <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} placeholder=" " />
                    <label>Parent / Guardian Name (if under 18)</label>
                  </div>
                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder=" " />
                      <label>Phone Number *</label>
                    </div>
                    <div className={styles.inputGroup}>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder=" " />
                      <label>Email Address *</label>
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionLabel}>03. Training Preferences</h3>
                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <select name="experience" value={formData.experience} onChange={handleChange}>
                        <option value="None">None</option>
                        <option value="1-2 Years">1-2 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                      <label className={styles.staticLabel}>Prior Experience</label>
                    </div>
                    <div className={styles.inputGroup}>
                      <select name="preferredBatch" value={formData.preferredBatch} onChange={handleChange}>
                        <option value="Weekday Evenings">Weekday Evenings</option>
                        <option value="Weekend Mornings">Weekend Mornings</option>
                        <option value="Weekend Evenings">Weekend Evenings</option>
                      </select>
                      <label className={styles.staticLabel}>Preferred Batch</label>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <textarea name="message" rows={3} value={formData.message} onChange={handleChange} placeholder=" "></textarea>
                    <label>Additional Message</label>
                  </div>
                </div>

                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                  {!loading && <ArrowRight size={18} className={styles.submitIcon} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <SectionDivider variant="gold" />

      {/* 3. Admission Process Timeline */}
      <section className={styles.processSection} ref={timelineRef}>
        <div className="container">
          <ScrollReveal direction="up">
            <h2 className="heading-secondary" style={{ textAlign: 'center', marginBottom: '4rem' }}>The Admission Process</h2>
          </ScrollReveal>
          
          <div className={styles.timelineWrapper}>
            {/* Desktop Horizontal Line */}
            <div className={styles.timelineLineHorizontal}>
              <motion.div className={styles.timelineProgressHorizontal} style={{ width: lineWidth }} />
            </div>
            
            {/* Mobile Vertical Line */}
            <div className={styles.timelineLineVertical}>
              <motion.div className={styles.timelineProgressVertical} style={{ height: lineHeight }} />
            </div>

            <div className={styles.timelineSteps}>
              {timelineSteps.map((step, idx) => (
                <div key={idx} className={styles.timelineStep}>
                  <ScrollReveal direction="up" delay={idx * 0.15}>
                    <div className={styles.stepMarker}>
                      <span className={styles.stepNum}>{step.num}</span>
                    </div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="subtle" />

      {/* 4. Trust Section */}
      <section className={styles.trustSection}>
        <div className="container">
          <div className={styles.trustGrid}>
            <ScrollReveal direction="right">
              <div className={styles.trustImagePlaceholder}>
                <PremiumImage src="/images/about/temple.jpg" alt="Legacy" fill overlay="dark" />
              </div>
            </ScrollReveal>
            <div className={styles.trustContent}>
              <ScrollReveal direction="left">
                <h2 className="heading-secondary">A Legacy of Excellence</h2>
                <p className={styles.trustText}>
                  Under the guidance of {academyConfig.guru.name}, {academyConfig.guru.title}, {academyConfig.name} has cultivated a reputation for uncompromising artistic integrity and traditional rigor.
                </p>
                <div className={styles.trustStats}>
                  <div className={styles.trustStat}>
                    <span className={styles.statNum}>15+</span>
                    <span className={styles.statLabel}>Years of Tradition</span>
                  </div>
                  <div className={styles.trustStat}>
                    <span className={styles.statNum}>100+</span>
                    <span className={styles.statLabel}>Active Students</span>
                  </div>
                  <div className={styles.trustStat}>
                    <span className={styles.statNum}>50+</span>
                    <span className={styles.statLabel}>Stage Productions</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className={styles.ctaSection}>
        <PremiumImage src="/images/hero/nataraja.jpg" alt="Nataraja" fill overlay="maroon" containerClassName={styles.ctaBg} />
        <div className={styles.ctaOverlay} />
        <div className={`container ${styles.ctaContent}`}>
          <ScrollReveal direction="up">
            <h2 className={styles.ctaTitle}>Ready to Begin Your Journey?</h2>
            <p className={styles.ctaDesc}>Step into the world of rhythm, expression, and divine storytelling.</p>
            <div className={styles.ctaActions}>
              <button 
                className="btn btn-primary" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Apply for Admission
              </button>
              <Link href="/contact" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                Contact Academy
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
