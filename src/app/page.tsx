export const revalidate = 3600; // Revalidate every hour
import Hero from '@/components/Hero';
import Introduction from '@/components/Introduction';
import Features from '@/components/Features';
import Achievements from '@/components/Achievements';
import Rankings from '@/components/Rankings';
import SectionDivider from '@/components/motion/SectionDivider';
import ParallaxSection from '@/components/motion/ParallaxSection';
import PremiumImage from '@/components/ui/PremiumImage';
import { calculateStudentRankings } from "@/lib/rankingEngine";

export default async function Home() {
  const dynamicRankings = await calculateStudentRankings();
  const top3Rankings = dynamicRankings.slice(0, 3).map(r => ({
    rank: r.rank,
    trend: r.trend,
    name: r.displayName,
    level: r.level,
    points: r.points,
    stats: { gold: r.goldCount, silver: r.silverCount, performances: r.performancesCount }
  }));

  return (
    <>
      <Hero />
      <SectionDivider variant="gold" />
      
      <ParallaxSection 
        backgroundImage={<PremiumImage src="/images/about/temple.jpg" alt="Temple Background" fill overlay="ivory-fade" />}
      >
        <Introduction />
      </ParallaxSection>

      <SectionDivider variant="subtle" />
      
      <ParallaxSection 
        backgroundImage={<PremiumImage src="/images/training/ghungroo.jpg" alt="Ghungroo Background" fill overlay="dark" />}
      >
        <Features />
      </ParallaxSection>

      <SectionDivider variant="gold" />
      
      <ParallaxSection 
        backgroundImage={<PremiumImage src="/images/textures/stone.jpg" alt="Stone Texture" fill overlay="maroon" />}
      >
        <Achievements />
      </ParallaxSection>

      <SectionDivider variant="subtle" />
      
      <ParallaxSection 
        backgroundImage={<PremiumImage src="/images/students/silhouette.jpg" alt="Students Background" fill overlay="vignette" />}
      >
        <Rankings rankings={top3Rankings} />
      </ParallaxSection>

      <SectionDivider variant="gold" />
      
      {/* Final CTA */}
      <ParallaxSection 
        backgroundImage={<PremiumImage src="/images/performances/stage.jpg" alt="Stage Background" fill overlay="dark" />}
      >
        <section className="section" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <h2 className="heading-secondary" style={{ marginBottom: '1rem', color: '#fff' }}>Begin Your Journey in Bharatanatyam</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Whether you are taking your first steps or preparing for the stage, there is a place for you here.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/admissions" className="btn btn-primary">Apply for Admission</a>
              <a href="/contact" className="btn btn-outline" style={{ color: '#fff', borderColor: '#fff' }}>Contact Academy</a>
            </div>
          </div>
        </section>
      </ParallaxSection>
    </>
  );
}
