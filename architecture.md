# Cloud Imaginator 2.0 - System Architecture

Cloud Imaginator is an "Augmented Imagination" platform that bridges the gap between the natural world and digital creativity. It uses a multi-modal pipeline of Gemini models to interpret, narrate, and reimagine the sky.

## 1. High-Level Flow

1.  **Capture**: User provides a sky image via Live View (Sky Lens), Upload, URL, or Paste.
2.  **Deconstruction**: The system identifies distinct cloud "inhabitants" using spatial reasoning.
3.  **Masking**: A custom Computer Vision engine extracts solid binary silhouettes.
4.  **Interpretation**: Gemini analyzes the silhouette to find a whimsical "hidden shape."
5.  **Creative Synthesis**:
    *   **Visual**: A diffusion-based model renders a physical entity into the cloud stencil.
    *   **Narrative**: A story model weaves ancient sky-lore based on the result.
    *   **Auditory**: A TTS model narrates the lore to the user.

## 2. The Multi-Modal Brain (Gemini Stack)

| Model Component | Gemini Model | Role |
| :--- | :--- | :--- |
| **Sky Lens (Live)** | `gemini-2.5-flash-native-audio` | Processes real-time video/audio streams. Acts as a co-pilot that talks to the user while they point their camera at the sky. |
| **Object Detection** | `gemini-3-pro-preview` | Extracts normalized [ymin, xmin, ymax, xmax] coordinates for distinct cloud segments in a static frame. |
| **Conceptualizer** | `gemini-3-flash-preview` | Performs visual reasoning on silhouettes. Maps "Cat Mode" or user prompts to the cloud geometry. |
| **Lore Architect** | `gemini-3-pro-preview` | Generates high-quality, 50-80 word ancient myths about the generated subject. |
| **Vocalist (TTS)** | `gemini-2.5-flash-preview-tts` | Transforms text legends into warm, storytelling audio (24kHz PCM). |
| **Image Engine** | `gemini-2.5-flash-image` | Performs the final image-to-image transformation using the original sky and a solid stencil mask. |

## 3. Technical Implementation Details

### A. Solid Mask Engine (`utils/cv.ts`)
Standard edge detection is too noisy for clouds. We implement an **Adaptive Saliency Thresholding** algorithm:
- Calculates a "Cloud Saliency Score" based on high luminance and low saturation.
- Applies morphological closing/opening to create solid regions.
- Ensures the AI sees a "stencil" rather than just a fuzzy edge, leading to better prompt adherence.

### B. Live API Feedback Loop (`hooks/useSkyLens.ts`)
- **Visual Input**: JPEG frames are sampled at ~1fps and sent via `session.sendRealtimeInput`.
- **Audio Input**: 16kHz PCM audio from the mic is streamed for voice-interactivity.
- **Audio Output**: 24kHz PCM data is received from the model and queued in a custom `AudioContext` buffer management system for gapless playback.
- **Transcription**: Captures both AI and User turns to build a "Contextual Prompt" when the user hits 'Capture'.

### C. Prompt Engineering Strategy
The `generateTransformedCloud` service uses a **Staging Prompt**:
1.  **Input 1**: Background Sky Plate (Reference for lighting).
2.  **Input 2**: Pixel-Perfect Stencil (Constraint for geometry).
3.  **Instruction**: Strict rules about "Zero Bleed" and "Material Substitution" to ensure the cloud actually transforms into a solid object (metal, fur, stone) while staying within the original bounds.

## 4. Tech Stack
- **Framework**: React 19 (Hooks, Context, Refs).
- **Styling**: Tailwind CSS (Glassmorphism, custom animations).
- **API**: `@google/genai` (SDK for Pro, Flash, Live, and TTS).
- **Utilities**: Browser `Canvas API` for image processing and `Web Audio API` for PCM stream handling.