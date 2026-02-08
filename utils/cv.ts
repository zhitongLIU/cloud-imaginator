
/**
 * Advanced Computer Vision utilities for cloud silhouette extraction.
 * Produces a Solid Binary Mask and a matching Resized Original to ensure 
 * perfect pixel-to-pixel coordinate alignment for the AI.
 */

export interface GeometryResult {
  mask: string;
  resizedOriginal: string;
  width: number;
  height: number;
}

export const extractCloudGeometry = async (
  base64Image: string, 
  rois?: [number, number, number, number][] // Array of [ymin, xmin, ymax, xmax] 0-1000
): Promise<GeometryResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | null;
      if (!ctx) return reject('Could not create canvas context');

      // Preserve aspect ratio while resizing for efficient processing
      const MAX_DIM = 1024;
      let w = img.width;
      let h = img.height;
      const ratio = Math.min(MAX_DIM / w, MAX_DIM / h, 1);
      w = Math.floor(w * ratio);
      h = Math.floor(h * ratio);
      
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      // Store the resized original for the AI
      const resizedOriginal = canvas.toDataURL('image/jpeg', 0.9);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      
      /**
       * 1. CLOUD SALIENCY MAPPING
       */
      const saliency = new Float32Array(w * h);
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        
        // Saliency score: Clouds are bright (high lum) and neutral (low sat)
        const s = lum * (1.0 - Math.pow(sat, 0.5));
        saliency[i / 4] = s;
      }

      /**
       * 2. ADAPTIVE BINARIZATION (Solid Mask)
       * We use a threshold relative to the average saliency, but also respect multiple ROIs if provided.
       */
      const binaryMask = new Uint8ClampedArray(w * h);
      const avgSaliency = saliency.reduce((a, b) => a + b, 0) / saliency.length;
      const threshold = avgSaliency * 1.15; 
      
      for (let i = 0; i < saliency.length; i++) {
        const x = i % w;
        const y = Math.floor(i / w);

        // If ROIs are provided, check if pixel is inside ANY of them
        if (rois && rois.length > 0) {
          let insideAny = false;
          const pixelYNorm = (y / h) * 1000;
          const pixelXNorm = (x / w) * 1000;

          for (const [ymin, xmin, ymax, xmax] of rois) {
            if (pixelYNorm >= ymin && pixelYNorm <= ymax && pixelXNorm >= xmin && pixelXNorm <= xmax) {
              insideAny = true;
              break;
            }
          }

          if (!insideAny) {
            binaryMask[i] = 0;
            continue;
          }
        }

        binaryMask[i] = saliency[i] > threshold ? 255 : 0;
      }

      /**
       * 3. MORPHOLOGICAL CLEANUP
       */
      const cleaned = new Uint8ClampedArray(w * h);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          let neighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (binaryMask[(y + dy) * w + (x + dx)] === 255) neighbors++;
            }
          }
          cleaned[idx] = neighbors > 4 ? 255 : 0;
        }
      }

      const outputImageData = ctx.createImageData(w, h);
      for (let i = 0; i < cleaned.length; i++) {
        const val = cleaned[i];
        const outIdx = i * 4;
        outputImageData.data[outIdx] = val;     // R
        outputImageData.data[outIdx + 1] = val; // G
        outputImageData.data[outIdx + 2] = val; // B
        outputImageData.data[outIdx + 3] = 255; // A
      }
      
      ctx.putImageData(outputImageData, 0, 0);
      const mask = canvas.toDataURL('image/png');

      resolve({
        mask,
        resizedOriginal,
        width: w,
        height: h
      });
    };
    img.onerror = () => reject('Failed to load image for structural analysis.');
    img.src = base64Image;
  });
};
