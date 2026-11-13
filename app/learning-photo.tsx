type LearningPhotoProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function LearningPhoto({
  src,
  alt,
  className = '',
}: LearningPhotoProps) {
  return (
    <figure className={`learning-photo ${className}`.trim()}>
      <div className="learning-photo-media">
        {/* Native images keep the same static asset path in Pages and Worker. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={1536} height={1024} loading="lazy" decoding="async" />
      </div>
    </figure>
  );
}
