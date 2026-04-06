import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface GalleryCategory {
  id: string;
  title: string;
  prefix: string;
  count: number;
}

const galleries: GalleryCategory[] = [
  { id: "peoples", title: "Peoples", prefix: "p", count: 8 },
  { id: "fashion", title: "Fashion", prefix: "f", count: 16 },
  { id: "events", title: "Events", prefix: "e", count: 10 },
  { id: "landscape", title: "Landscape", prefix: "l", count: 14 },
  { id: "wedding", title: "Wedding", prefix: "w", count: 12 },
];

const GallerySection = ({ gallery, index }: { gallery: GalleryCategory; index: number }) => {
  const titleRef = useScrollReveal<HTMLHeadingElement>(index % 2 === 0 ? "left" : "right");
  const gridRef = useScrollReveal<HTMLDivElement>();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const images = Array.from({ length: gallery.count }, (_, i) => `/gallery/${gallery.prefix}${i + 1}.jpg`);

  return (
    <div className="mb-16">
      <h2
        ref={titleRef}
        className={`font-recoleta text-3xl md:text-4xl font-light mb-6 ${index % 2 === 0 ? "text-left" : "text-right"}`}
      >
        {gallery.title}
      </h2>

      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="cursor-pointer overflow-hidden rounded-sm group"
            onClick={() => setLightboxImg(src)}
          >
            <img
              src={src}
              alt={`${gallery.title} ${i + 1}`}
              loading="lazy"
              className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[200] bg-background/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-content-center text-xl">
            ✕
          </button>
          <img src={lightboxImg} alt="" className="max-w-full max-h-[90vh] object-contain rounded-sm" />
        </div>
      )}
    </div>
  );
};

const Gallery = () => {
  const subtitleRef = useScrollReveal<HTMLParagraphElement>();

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          <p ref={subtitleRef} className="text-foreground/25 text-xl uppercase tracking-[3.5px] mb-12">
            Gallery
          </p>

          {galleries.map((g, i) => (
            <GallerySection key={g.id} gallery={g} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Gallery;
