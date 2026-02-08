# ☁️ Cloud Imaginator

**Cloud Imaginator** is an "Augmented Imagination" platform that bridges the gap between the natural world and digital creativity. It uses a sophisticated multi-modal pipeline powered by the **Google Gemini API** to interpret, narrate, and reimagine the sky.

Whether you're looking at a live sky through your camera or uploading a cherished photo of a sunset, Cloud Imaginator finds the hidden creatures, objects, and myths within the clouds.

#### Try it with: https://ai.studio/apps/drive/1x2NwQWmWlrrb0KHhQbkhNXWs-tis06Zr?fullscreenApplet=true
---

## ✨ Key Features

### 🔭 Sky Lens (Live Observation)
Experience the sky in real-time. Launch the **Sky Lens** to stream your camera feed and audio directly to **Gemini 2.5 Flash Native Audio**. The AI acts as an enthusiastic co-pilot, conversing with you about the shapes it sees, responding to your sightings, and building a shared creative context.

### 🧩 Intelligent Segmentation
Using **Gemini 3 Pro’s** advanced spatial reasoning, the app automatically detects and labels distinct "inhabitants" of the sky. Instead of transforming the whole image, you can select specific cloud segments to reimagine into art.

### 🎨 Solid Mask Engine
Our custom Computer Vision engine (Adaptive Saliency Thresholding) extracts high-contrast silhouettes from the sky. This "stencil" is passed to **Gemini 2.5 Flash Image**, ensuring the AI strictly adheres to the natural geometry of the clouds while replacing "vapor" with solid materials like fur, metal, or stone.

### 📜 Atmospheric Narrator
Every creation has a history. **Gemini 3 Pro** weaves an "Ancient Sky Lore" (50-80 word myth) based on the generated art, which is then narrated by a warm, storytelling voice via **Gemini 2.5 Flash TTS**.

### 🐱 Cat Mode
A specialized toggle that nudges the AI's "Pareidolia" (the tendency to see patterns) toward felines. When active, every cloud becomes a cosmic kitten or a sky-striding lion.

---

## 🛠️ Technology Stack

- **Framework:** React 19 (ES6+ Modules)
- **Styling:** Tailwind CSS (Glassmorphism & Custom Animations)
- **AI Models:**
  - `gemini-2.5-flash-native-audio-preview-12-2025`: Live conversational AI.
  - `gemini-3-pro-preview`: Spatial reasoning, object detection, and lore generation.
  - `gemini-3-flash-preview`: Fast visual interpretation and geometric analysis.
  - `gemini-2.5-flash-preview-tts`: High-fidelity text-to-speech narration.
  - `gemini-2.5-flash-image`: Image-to-image generation with stencil constraints.
- **APIs:** Browser Canvas API (CV), Web Audio API (PCM Processing).

---

## 🚀 Getting Started

### Prerequisites
- A Google Gemini API Key.
- A modern web browser with Camera and Microphone access.

### Environment Setup
The application expects the API key to be available via an environment variable:
```bash
process.env.API_KEY = "YOUR_GEMINI_API_KEY"
```

---

## 🏗️ Architecture Summary

The app follows a **Multi-Modal Pipeline**:
1. **Input:** Live Stream (Sky Lens) or Image Upload.
2. **Analysis:** `gemini-3-pro` identifies bounding boxes for clouds.
3. **Geometry:** `utils/cv.ts` generates a solid binary mask from selected ROIs.
4. **Logic:** `gemini-3-flash` interprets the mask based on user guidance or "Cat Mode."
5. **Synthesis:** `gemini-2.5-flash-image` renders the final artwork using the original sky as a lighting reference.
6. **Delivery:** Audio narration and an interactive "Magic Intensity" slider comparison.

---

## 🏆 Hackathon Strategy
This project was built for the **Gemini 3 Hackathon**, focusing on:
- **Innovation:** Moving beyond static filters to "Live Co-piloting."
- **Technical Execution:** Sophisticated handling of PCM audio streams and pixel-perfect stencil adherence.
- **Experience:** A polished, "magical" UI that evokes wonder and nature connection.

---

*“Look up. What do you see today?”*
