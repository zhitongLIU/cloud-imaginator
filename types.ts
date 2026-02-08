export interface CloudInterpretation {
  description: string;
  objectName: string;
  silhouetteAnalysis: string;
  geometricDescriptors: string[]; // e.g., ["large rounded top", "jagged bottom edge", "wispy tail"]
}

export interface CloudSegment {
  id: string;
  label: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
}

export interface ProcessingState {
  status: 'idle' | 'detecting' | 'interpreting' | 'scanning' | 'generating' | 'completed' | 'error';
  message?: string;
}