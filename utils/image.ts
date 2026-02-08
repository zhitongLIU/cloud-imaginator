/**
 * Maps image dimensions to the closest supported Gemini aspect ratio
 */
export const getClosestAspectRatio = (width: number, height: number): "1:1" | "4:3" | "3:4" | "16:9" | "9:16" => {
  const ratio = width / height;
  if (ratio >= 1.5) return "16:9";    // ~1.77
  if (ratio >= 1.2) return "4:3";     // 1.33
  if (ratio <= 0.6) return "9:16";    // ~0.56
  if (ratio <= 0.8) return "3:4";     // 0.75
  return "1:1";
};
