import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, ImageOff } from 'lucide-react';
import PhotoModal from '../ui/PhotoModal';

/**
 * PhotoCollage Component
 * 
 * Displays travel photos in an interactive grid layout with hover effects.
 * When a photo is clicked, it opens in a lightbox modal for enlarged viewing.
 * Respects user's prefers-reduced-motion accessibility setting.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.photos - Array of photo objects with id, src, alt, location fields
 * @param {string} [props.className] - Additional CSS classes to apply
 * 
 * @validates Requirements 6.4, 10.6
 */
function PhotoCollage({ photos = [], className = '' }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  
  // Use Framer Motion's hook to detect user's prefers-reduced-motion setting
  const prefersReducedMotion = useReducedMotion();

  // Handle photo click to open modal
  const handlePhotoClick = (photo) => {
    // Don't open modal for failed images
    if (!failedImages.has(photo.id)) {
      setSelectedPhoto(photo);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  /**
   * Handle image load error - add to failed set for fallback display
   * Graceful degradation for failed image loads
   */
  const handleImageError = (photoId) => {
    setFailedImages(prev => new Set([...prev, photoId]));
  };

  // Animation variants for photos - respects reduced motion preference
  const photoVariants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: prefersReducedMotion ? 0 : index * 0.1,
        duration: prefersReducedMotion ? 0.1 : 0.3,
      },
    }),
  };

  // Hover animation variants - disabled when reduced motion is preferred
  const hoverVariants = prefersReducedMotion
    ? {}
    : {
        scale: 1.02,
        transition: { duration: 0.2 },
      };

  if (!photos || photos.length === 0) {
    return (
      <div className={`text-gray-400 text-center py-8 ${className}`}>
        No photos available
      </div>
    );
  }

  return (
    <>
      <div
        className={`
          grid
          grid-cols-2
          gap-3
          md:gap-4
          ${className}
        `.trim().replace(/\s+/g, ' ')}
      >
        {photos.map((photo, index) => (
          <motion.button
            key={photo.id}
            custom={index}
            variants={photoVariants}
            initial="hidden"
            animate="visible"
            whileHover={hoverVariants}
            onClick={() => handlePhotoClick(photo)}
            className="
              relative
              group
              aspect-square
              overflow-hidden
              rounded-xl
              bg-slate-900/40
              backdrop-blur-md
              border
              border-white/10
              shadow-lg
              cursor-pointer
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-400
              focus-visible:ring-offset-2
              focus-visible:ring-offset-slate-950
              transition-shadow
              duration-300
              hover:shadow-blue-500/10
              hover:border-white/20
            "
            aria-label={`View ${photo.alt || 'photo'} - ${photo.location || 'Unknown location'}. Press Enter to open enlarged view.`}
            type="button"
          >
            {/* Photo image with fallback */}
            {failedImages.has(photo.id) ? (
              /* Image fallback placeholder when load fails */
              <div 
                className="
                  w-full
                  h-full
                  bg-slate-800/50
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-2
                "
                aria-label="Image unavailable"
              >
                <ImageOff className="w-8 h-8 text-gray-500" aria-hidden="true" />
                <span className="text-xs text-gray-500">Image unavailable</span>
                {photo.location && (
                  <span className="text-xs text-gray-400">{photo.location}</span>
                )}
              </div>
            ) : (
              <img
                src={photo.src}
                alt={photo.alt || 'Photo'}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
                loading="lazy"
                onError={() => handleImageError(photo.id)}
              />
            )}

            {/* Overlay with location info - only show if image loaded */}
            {!failedImages.has(photo.id) && (
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-transparent
                  to-transparent
                  opacity-0
                  group-hover:opacity-100
                  group-focus:opacity-100
                  transition-opacity
                  duration-300
                "
              >
                {/* Location badge */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    p-3
                    flex
                    items-center
                    gap-1.5
                    text-white
                    text-sm
                    font-medium
                  "
                >
                  <MapPin size={14} className="text-blue-400 flex-shrink-0" />
                  <span className="truncate">{photo.location || 'Unknown location'}</span>
                </div>
              </div>
            )}

            {/* View indicator on hover - only show if image loaded */}
            {!failedImages.has(photo.id) && (
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  opacity-0
                  group-hover:opacity-100
                  group-focus:opacity-100
                  transition-opacity
                  duration-300
                  pointer-events-none
                "
              >
                <div
                  className="
                    bg-slate-900/60
                    backdrop-blur-sm
                    rounded-full
                    px-3
                    py-1.5
                    text-xs
                    text-white
                    font-medium
                    border
                    border-white/20
                  "
                >
                  Click to view
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={selectedPhoto !== null}
        onClose={handleCloseModal}
        imageSrc={selectedPhoto?.src || ''}
        imageAlt={selectedPhoto?.alt || ''}
      />
    </>
  );
}

export default PhotoCollage;
