"use client";
import { academyConfig } from "@/config/academy";
import PremiumImage from "@/components/ui/PremiumImage";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Contact.module.css';
import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <PremiumImage src="/images/hero/texture.jpg" alt="Contact Background" fill overlay="maroon" containerClassName={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <ScrollReveal direction="up">
            <h1 className={styles.heroTitle}>Contact Us</h1>
            <p className={styles.heroSubtitle}>Reach out to {academyConfig.name} for inquiries, admissions, or collaborations.</p>
          </ScrollReveal>
        </div>
      </div>

      <div className="container">
        <div className={styles.contactGrid}>
          <ScrollReveal direction="right">
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Get in Touch</h2>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}><MapPin size={24} /></div>
                  <div className={styles.itemContent}>
                    <h4>Location</h4>
                    <p>{academyConfig.contact.address}</p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}><Phone size={24} /></div>
                  <div className={styles.itemContent}>
                    <h4>Phone</h4>
                    <p>{academyConfig.contact.phone}</p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}><Mail size={24} /></div>
                  <div className={styles.itemContent}>
                    <h4>Email</h4>
                    <p>{academyConfig.contact.email}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}><Clock size={24} /></div>
                  <div className={styles.itemContent}>
                    <h4>Hours</h4>
                    <p>Mon-Fri: 4:00 PM - 8:00 PM<br/>Sat-Sun: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="left">
            <div className={styles.formCard}>
              {status === "success" ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <h3 style={{ color: 'var(--color-maroon)', fontSize: '1.8rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Message Sent</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. We will get back to you shortly.</p>
                  <button className="btn btn-outline" onClick={() => setStatus("idle")} style={{ marginTop: '2rem' }}>Send Another</button>
                </div>
              ) : (
                <>
                  <h2 className={styles.formTitle}>Send a Message</h2>
                  <form className={styles.contactForm} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                      <label>Name</label>
                      <input type="text" required placeholder="Your full name" />
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <label>Email</label>
                      <input type="email" required placeholder="Your email address" />
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <label>Subject</label>
                      <input type="text" required placeholder="What is this regarding?" />
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <label>Message</label>
                      <textarea required placeholder="How can we help you?"></textarea>
                    </div>
                    
                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={status === "submitting"}>
                      {status === "submitting" ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
