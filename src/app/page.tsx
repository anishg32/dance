export const revalidate = 3600; // Revalidate every hour
import Hero from '@/components/Hero';
import Introduction from '@/components/Introduction';
import Features from '@/components/Features';
import Achievements from '@/components/Achievements';
import Rankings from '@/components/Rankings';
import SectionDivider from '@/components/motion/SectionDivider';
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
      <Introduction />
      <SectionDivider variant="subtle" />
      <Features />
      <SectionDivider variant="gold" />
      <Achievements />
      <SectionDivider variant="subtle" />
      <Rankings rankings={top3Rankings} />
      <SectionDivider variant="gold" />
      
      {/* Final CTA */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="heading-secondary" style={{ marginBottom: '1rem' }}>Begin Your Journey in Bharatanatyam</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Whether you are taking your first steps or preparing for the stage, there is a place for you here.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/admissions" className="btn btn-primary">Apply for Admission</a>
            <a href="/contact" className="btn btn-outline">Contact Academy</a>
          </div>
        </div>
      </section>
    </>
  );
}
