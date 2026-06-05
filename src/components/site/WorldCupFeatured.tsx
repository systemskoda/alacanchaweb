type WorldCupFeaturedProps = {
  title: string;
  description?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  youtubeUrl?: string | null;
};

function WorldCupFeatured({
  title,
  description,
  imageUrl,
  videoUrl,
  youtubeUrl,
}: WorldCupFeaturedProps) {
  const getYoutubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/
    );

    return match?.[1];
  };

  const youtubeId = youtubeUrl
    ? getYoutubeId(youtubeUrl)
    : null;

  return (
    <section
      id="mundial-fifa"
      className="bg-secondary px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="Cobertura Especial"
          title="Mundial FIFA 2026"
        />

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <Trophy className="h-3.5 w-3.5" />
            Mundial FIFA 2026
          </div>

          {/* Contenido */}
          <div className="mt-4 overflow-hidden rounded-xl bg-black/5">

            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="w-full object-contain"
              />
            )}

            {!imageUrl && videoUrl && (
              <video
                controls
                className="w-full"
              >
                <source src={videoUrl} />
              </video>
            )}

            {!imageUrl &&
              !videoUrl &&
              youtubeId && (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  className="aspect-video w-full"
                  allowFullScreen
                />
              )}
          </div>

          <h3 className="mt-4 font-display text-2xl font-bold text-primary">
            {title}
          </h3>

          {description && (
            <p className="mt-2 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}