import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { getPhoto, PORTFOLIO_DATA } from '../data/portfolio';
import type { GalleryItem, Photo } from '../data/types';
import { Section, SectionHeader } from '../components/ui';
import { TabFilter } from '../components/TabFilter';
import { ParallaxImage } from '../components/ParallaxImage';
import { useLightbox } from '../components/Lightbox';
import { cn } from '../lib/utils';

const SPAN: Record<GalleryItem['span'], string> = {
  big: 'col-span-2 row-span-2',
  wide: 'col-span-2',
  tall: 'row-span-2',
  normal: '',
};

export function Gallery() {
  const { gallery } = PORTFOLIO_DATA;
  const openLightbox = useLightbox();
  const [filter, setFilter] = useState('all');

  const all = useMemo(
    () =>
      gallery.items
        .map((item) => ({ item: item as GalleryItem, photo: getPhoto(item.photo) }))
        .filter((x): x is { item: GalleryItem; photo: Photo } => !!x.photo),
    [gallery.items],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    all.forEach(({ item }) => {
      c[item.category] = (c[item.category] ?? 0) + 1;
    });
    return c;
  }, [all]);
  const tabs = gallery.filters.filter((f) => f.id === 'all' || counts[f.id]);
  const visible = filter === 'all' ? all : all.filter(({ item }) => item.category === filter);
  const isAll = filter === 'all';
  const n = visible.length;

  const gridCols = isAll ? 'grid-cols-2 md:grid-cols-4' : n === 1 ? 'grid-cols-1' : n === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3';
  const gridRows = isAll
    ? 'auto-rows-[150px] sm:auto-rows-[190px] lg:auto-rows-[220px]'
    : 'auto-rows-[240px] sm:auto-rows-[320px] lg:auto-rows-[400px]';

  const lightboxItems = visible.map(({ photo }) => ({ src: photo.src, alt: photo.alt, caption: photo.caption }));
  const labelOf = (id: string) => gallery.filters.find((f) => f.id === id)?.label ?? id;

  return (
    <Section id="gallery">
      <SectionHeader
        eyebrow="Field & coaching action gallery"
        title="Moments from the field."
        lead="Conference days, race operations, pool sessions and prototype work. Select any photo to view it full size."
      />

      <div data-reveal className="mb-6">
        <TabFilter tabs={tabs} value={filter} onChange={setFilter} layoutId="gallery-pill" counts={counts} label="Filter gallery by activity" controls="gallery-grid" />
      </div>

      <motion.div id="gallery-grid" role="tabpanel" layout className={cn('relative grid grid-flow-row-dense gap-3 sm:gap-4', gridCols, gridRows)}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map(({ item, photo }, i) => (
            <motion.button
              layout
              key={item.photo}
              type="button"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              onClick={() => openLightbox(lightboxItems, i)}
              className={cn(
                'media-tile group/media relative overflow-hidden rounded-[22px] border border-line text-left shadow-soft',
                photo.fit === 'contain' ? 'bg-white' : 'bg-ink/5',
                isAll ? SPAN[item.span] : n === 3 && i === 0 ? 'col-span-2 md:col-span-1' : '',
              )}
              aria-label={`Enlarge photo: ${photo.caption}`}
            >
              <motion.div layout className="absolute inset-0">
                <ParallaxImage
                  src={photo.thumb ?? photo.src}
                  alt={photo.alt}
                  fit={photo.fit}
                  position={photo.position}
                  className="absolute inset-0"
                  imgClassName={cn('media-zoom', photo.fit === 'contain' && 'p-4')}
                  intensity={6}
                />
              </motion.div>
              <span className="media-caption">
                <span className="min-w-0">
                  <span className="mb-1 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/70">{labelOf(item.category)}</span>
                  <span className="line-clamp-2">{photo.caption}</span>
                </span>
                <Maximize2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
