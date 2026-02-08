# Hackathon Upgrade Strategy: Cloud Imaginator 2.0

Based on the **Gemini 3 Hackathon Rules**, this document tracks the transformation of "Cloud Imaginator" from a static utility into a high-impact experience.

## 1. Current App Status (Post-Audit)
*   **Strengths:** Successfully integrated Multi-modal reasoning (Vision + Audio + Image).
*   **Implemented:** Real-time observation (Sky Lens), automated segment detection, and audio storytelling (Atmospheric Narrator).
*   **Current Model Stack:**
    *   **Live Observation:** `gemini-2.5-flash-native-audio-preview-12-2025` (Implemented)
    *   **Segmentation & Logic:** `gemini-3-pro-preview` (Implemented)
    *   **Narration (TTS):** `gemini-2.5-flash-preview-tts` (Implemented)
    *   **Image Generation:** `gemini-2.5-flash-image` (In use - Upgrade Pending)

## 2. Core Innovations (Implemented)

### A. The "Sky Lens" (Live API Integration) - ✅ DONE
*   **Status:** Fully functional. 
*   **Behavior:** Streams video frames and audio to Gemini 2.5 Flash Native Audio. The AI acts as an enthusiastic co-pilot, narrating shapes in real-time.
*   **Innovation:** Bridging the gap between a "static photo app" and a "live companion."

### B. "Atmospheric Narrator" (TTS & Gemini 3 Pro) - ✅ DONE
*   **Status:** Fully functional.
*   **Behavior:** Uses `gemini-3-pro-preview` to weave ancient sky-lore based on the generated subject. Uses `gemini-2.5-flash-preview-tts` for warm, storytelling narration.
*   **Innovation:** Adds emotional depth and "lore" to the creative output.

### C. Intelligent Object Extraction & Rationale - ✅ DONE
*   **Status:** Fully functional.
*   **Behavior:** Uses `gemini-3-pro-preview`'s spatial reasoning to detect bounding boxes for distinct clouds. Users can select specific "inhabitants" to reimagine.
*   **Innovation:** Interactive discovery vs. simple full-image filtering.

## 3. Pending Upgrade: Gemini 3 Pro Image

To achieve the "Grand Prize" level of quality, we aim to migrate the generation core to **`gemini-3-pro-image-preview`**.

### Why Gemini 3 Pro Image?
1.  **Spatial Precision:** Superior prompt adherence for complex masks.
2.  **High-Resolution Output:** Support for 1K/2K/4K exports.
3.  **Strict Compliance Requirement:** Must implement the **API Key Selection Flow** (`openSelectKey`) as this model is restricted to paid billing projects.

## 4. Final Technical Roadmap
1.  **[COMPLETE]** Metadata Update: Camera and microphone permissions active.
2.  **[IN PROGRESS]** API Migration: Transition `generateTransformedCloud` to Gemini 3 Pro Image.
3.  **[PENDING]** Key Management: Implement `window.aistudio.openSelectKey()` UI to handle Pro model billing requirements.
4.  **[COMPLETE]** Live Loop: Finalized AudioContext and MediaStream logic.

## 5. Scoring Alignment
*   **Technical Execution (40%):** Deep integration of Live API, TTS, and Pro-series vision reasoning.
*   **Potential Impact (20%):** A magical tool for childhood wonder, nature connection, and digital art.
*   **Innovation (30%):** First-of-its-kind "Augmented Imagination" tool that speaks to you.
*   **Presentation (10%):** Polished glassmorphic UI with cinematic narration.