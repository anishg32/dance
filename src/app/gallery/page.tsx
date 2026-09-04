import { academyConfig } from "@/config/academy";
import prisma from "@/lib/prisma";
import { Camera } from 'lucide-react';
import PremiumImage from "@/components/ui/PremiumImage";
import ParallaxSection from '@/components/motion/ParallaxSection';
import styles from './PublicGallery.module.css';



export const revalidate = 3600; // Revalidate every hour

export default async function PublicGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : '';

  const photos = await prisma.galleryItem.findMany({
    where: {
      published: true,
      ...(categoryFilter ? { category: categoryFilter } : {})
    },
    orderBy: { createdAt: 'desc' }
  });

  const categories = ["All", "Performances", "Awards", "Students", "Arangetram", "Events", "Workshops", "Academy"];

  return (
    <div className={styles.pageContainer}>
      <ParallaxSection 
        className={styles.heroSection} 
        speed={0.5}
        backgroundImage={<PremiumImage src="/images/textures/stone.jpg" alt="Gallery" fill overlay="dark" />}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className={styles.heroTitle}>Gallery</h1>
          <p className={styles.heroSubtitle}>Capturing moments of grace, discipline, and artistic excellence at {academyConfig.name}.</p>
        </div>
      </ParallaxSection>

      <div className="container">
        <div className={styles.filterNav}>
          {categories.map(cat => (
            <a 
              key={cat} 
              href={cat === "All" ? "/gallery" : `/gallery?category=${cat}`}
              className={`${styles.filterPill} ${(!categoryFilter && cat === "All") || categoryFilter === cat ? styles.filterPillActive : ''}`}
            >
              {cat}
            </a>
          ))}
        </div>

        {photos.length > 0 ? (
          <div className={styles.masonryGrid}>
            {photos.map((photo) => (
              <div key={photo.id} className={styles.masonryItem}>
                <div className={styles.imageWrapper}>
                  {photo.url ? (
                    <PremiumImage src={photo.url} alt={photo.title || 'Gallery Image'} fill />
                  ) : (
                    <div className={styles.placeholderImage}><Camera size={48} /></div>
                  )}
                  <div className={styles.imageOverlay}>
                    <div className={styles.imageContent}>
                      <span className={styles.imageCategory}>{photo.category}</span>
                      <h3 className={styles.imageTitle}>{photo.title}</h3>
                      {photo.year && <span className={styles.imageYear}>{photo.year}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Camera size={64} className={styles.emptyIcon} />
            <h3>No photos found</h3>
            <p>We are currently updating our gallery for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
