"use client";
import { academyConfig } from "@/config/academy";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import styles from './Admissions.module.css';

export default function AdmissionsPage() {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    age: '',
    phone: '',
    email: '',
    experience: 'None',
    preferredLevel: 'Beginner',
    preferredBatch: 'Weekend',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className={styles.admissionsContainer}>
      <div className={styles.headerBackground}></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className={styles.formWrapper}>
          <div className={styles.infoSection}>
            <h1 className={styles.title}>Begin Your Journey</h1>
            <p className={styles.description}>
              We welcome students of all ages who possess a genuine passion for classical dance. 
              Join {academyConfig.name} to discover the discipline, grace, and spiritual depth of Bharatanatyam.
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✦</div>
                <div>
                  <h3>Traditional Guru-Shishya Parampara</h3>
                  <p>Authentic training honoring the Tanjore style lineage.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✦</div>
                <div>
                  <h3>Performance Opportunities</h3>
                  <p>Regular stage exposure in prestigious cultural events.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✦</div>
                <div>
                  <h3>Structured Curriculum</h3>
                  <p>Comprehensive syllabus from Adavus to Arangetram.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            {success ? (
              <motion.div 
                className={styles.successMessage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle size={64} className={styles.successIcon} />
                <h2>Application Received!</h2>
                <p>Thank you for your interest in {academyConfig.name}. Our admissions team will review your enquiry and contact you within 48 hours to discuss the next steps.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ studentName: '', parentName: '', age: '', phone: '', email: '', experience: 'None', preferredLevel: 'Beginner', preferredBatch: 'Weekend', message: '' });
                  }}
                  style={{ marginTop: '2rem' }}
                >
                  Submit Another Enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.formTitle}>Admission Enquiry</h2>
                
                {error && <div className={styles.error}>{error}</div>}
                
                <div className={styles.grid2}>
                  <div className={styles.inputGroup}>
                    <label>Student Name *</label>
                    <input type="text" name="studentName" required value={formData.studentName} onChange={handleChange} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Age *</label>
                    <input type="number" name="age" min="4" max="60" required value={formData.age} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Parent / Guardian Name (if under 18)</label>
                  <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} />
                </div>

                <div className={styles.grid2}>
                  <div className={styles.inputGroup}>
                    <label>Phone Number *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className={styles.inputGroup}>
                    <label>Prior Experience</label>
                    <select name="experience" value={formData.experience} onChange={handleChange}>
                      <option value="None">None</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Preferred Batch</label>
                    <select name="preferredBatch" value={formData.preferredBatch} onChange={handleChange}>
                      <option value="Weekday Evenings">Weekday Evenings</option>
                      <option value="Weekend Mornings">Weekend Mornings</option>
                      <option value="Weekend Evenings">Weekend Evenings</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Additional Message</label>
                  <textarea name="message" rows={4} value={formData.message} onChange={handleChange}></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
