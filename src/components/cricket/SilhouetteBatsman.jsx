/**
 * SilhouetteBatsman - Professional SVG silhouette of a right-handed batsman.
 *
 * Renders a cricket batsman in batting stance using cubic bezier path curves.
 * The figure depicts: bat at ~45° backlift, knees bent (front knee ~140°),
 * head over front knee, with cricket equipment outlines (bat blade, batting
 * pads, helmet with grille/peak).
 *
 * All body contours use cubic bezier (C/c) commands — no circle, rect, or
 * polygon elements. Single solid fill, no gradients or interior line detail.
 *
 * Decorative element — includes aria-hidden="true".
 *
 * @param {object} props
 * @param {string} [props.className] - Additional CSS class names
 * @param {React.CSSProperties} [props.style] - Inline styles
 */
export default function SilhouetteBatsman({ className, style, ...props }) {
  return (
    <g
      aria-hidden="true"
      className={className}
      style={style}
      {...props}
    >
      {/* Helmet with peak and grille */}
      <path
        d="M 44,4 C 40,2 38,6 38,10 C 38,14 40,18 44,19 C 44,19 46,20 50,20 C 54,20 56,19 56,19 C 60,18 62,14 62,10 C 62,6 60,2 56,4 C 54,3 52,2.5 50,2.5 C 48,2.5 46,3 44,4 Z M 36,12 C 35,12 34,13 35,14 C 36,15 38,15 38,14 C 38,13 37,12 36,12 Z M 42,20 C 41,20.5 40,21 41,22 C 43,23 47,24 50,24 C 53,24 57,23 59,22 C 60,21 59,20.5 58,20 C 55,21 53,21.5 50,21.5 C 47,21.5 45,21 42,20 Z"
        fill="currentColor"
      />

      {/* Head/neck behind helmet */}
      <path
        d="M 46,22 C 45,23 45,25 46,26 C 47,27.5 49,28 50,28 C 51,28 53,27.5 54,26 C 55,25 55,23 54,22 C 53,22.5 51.5,23 50,23 C 48.5,23 47,22.5 46,22 Z"
        fill="currentColor"
      />

      {/* Torso - side-on batting stance, slight forward lean */}
      <path
        d="M 42,28 C 39,29 37,32 37,36 C 37,40 38,44 39,48 C 40,51 41,53 43,54 C 45,55 48,55.5 50,55.5 C 52,55.5 55,55 57,54 C 59,53 60,51 61,48 C 62,44 63,40 63,36 C 63,32 61,29 58,28 C 55,27 53,27 50,27 C 47,27 45,27 42,28 Z"
        fill="currentColor"
      />

      {/* Front arm (bottom hand) reaching towards bat handle */}
      <path
        d="M 38,32 C 35,31 32,29 29,27 C 26,25 24,23 22,22 C 20,21 19,21.5 19,23 C 20,25 22,27 25,29 C 28,31 31,33 34,35 C 36,36 38,35 38,33 C 38,32.5 38,32.2 38,32 Z"
        fill="currentColor"
      />

      {/* Back arm (top hand) on bat, slightly higher grip */}
      <path
        d="M 40,30 C 37,28 34,26 31,24 C 28,22 26,20 24,18 C 22,16.5 21,17 21,18.5 C 22,20 24,22 27,24.5 C 30,27 33,29 36,31 C 38,32 40,31.5 40,30 Z"
        fill="currentColor"
      />

      {/* Front leg with batting pad - bent knee ~140° */}
      <path
        d="M 43,54 C 42,56 40,59 38,62 C 36,65 35,67 35,69 C 35,71 36,72 37,72 C 38,72 39,72 39,73 C 38,76 37,79 36,82 C 35,85 34,88 34,90 C 34,92 35,93 36,93 C 37,93 38,93 39,93 C 40,93 41,93 42,93 C 43,93 44,92 44,90 C 44,88 43,85 42,82 C 41,79 40,76 40,73 C 40,72 41,71 42,71 C 43,71 44,70 44,69 C 44,67 43,65 42,62 C 41,59 43,56 44,54 C 44,54 43.5,54 43,54 Z"
        fill="currentColor"
      />

      {/* Back leg with batting pad - planted, slight bend */}
      <path
        d="M 55,54 C 56,56 57,59 58,62 C 59,65 60,67 61,69 C 61,71 61,72 60,72 C 59,72 59,72.5 59,73 C 59,76 60,79 61,82 C 62,85 63,88 63,90 C 63,92 62,93 61,93 C 60,93 59,93 58,93 C 57,93 56,93 55,93 C 54,92 54,91 55,90 C 56,88 57,85 57,82 C 57,79 57,76 57,73 C 57,72 56,71.5 56,71 C 55,71 55,70 55,69 C 55,67 56,65 57,62 C 57,59 56,56 55,54 Z"
        fill="currentColor"
      />

      {/* Bat - handle and blade at ~45° backlift angle */}
      <path
        d="M 19,22 C 18,20 16,17 14,13 C 12,9 11,6 10,3 C 9,0 8,-3 8,-5 C 8,-6 8.5,-7 9.5,-7 C 10.5,-7 11,-6 11.5,-4.5 C 12,-2 13,1 14,4 C 15,7 16.5,10 18,14 C 19.5,18 20,20 20,22 C 20,22.5 19.5,22.5 19,22 Z M 8,-5 C 7.5,-6 7,-8 7,-10 C 7,-12 7,-14 7.5,-16 C 8,-17 8.5,-17.5 9.5,-17 C 10.5,-16.5 11,-15.5 11,-14 C 11,-12 10.5,-10 10,-8 C 9.5,-6 9,-5.5 8.5,-5 C 8.3,-4.8 8.1,-4.9 8,-5 Z"
        fill="currentColor"
      />

      {/* Feet/shoes */}
      <path
        d="M 33,91 C 32,92 31,93 31,94 C 31,95 32,95.5 34,95.5 C 36,95.5 38,95.5 40,95.5 C 42,95.5 43,95 43,94 C 43,93 42,92 41,91 C 39,91 37,91 35,91 C 34,91 33.5,91 33,91 Z M 54,91 C 53,92 53,93 53,94 C 53,95 54,95.5 56,95.5 C 58,95.5 60,95.5 62,95.5 C 64,95.5 65,95 65,94 C 65,93 64,92 63,91 C 61,91 59,91 57,91 C 56,91 55,91 54,91 Z"
        fill="currentColor"
      />
    </g>
  );
}
