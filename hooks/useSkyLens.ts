
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audio';

export interface ZoomCapabilities {
  min: number;
  max: number;
  step: number;
}

export const useSkyLens = (onCaptureCallback: (image: string, prompt: string) => void) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const [transcriptionHistory, setTranscriptionHistory] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [zoomCapabilities, setZoomCapabilities] = useState<ZoomCapabilities | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const streamsRef = useRef<{ audio: MediaStream | null; video: MediaStream | null }>({ audio: null, video: null });
  const contextsRef = useRef<{ input: AudioContext | null; output: AudioContext | null }>({ input: null, output: null });
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number | null>(null);

  const stopAll = useCallback(() => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (sessionRef.current) sessionRef.current.close();
    
    streamsRef.current.audio?.getTracks().forEach(t => t.stop());
    streamsRef.current.video?.getTracks().forEach(t => t.stop());
    
    contextsRef.current.input?.close();
    contextsRef.current.output?.close();
    
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    
    setIsActive(false);
  }, []);

  const startLens = async () => {
    try {
      setError(null);
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          // @ts-ignore
          zoom: true 
        } 
      });
      
      streamsRef.current = { audio: audioStream, video: videoStream };
      if (videoRef.current) videoRef.current.srcObject = videoStream;

      const videoTrack = videoStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack as any).getCapabilities?.() || {};
        if (capabilities.zoom) {
          setZoomCapabilities({
            min: capabilities.zoom.min,
            max: capabilities.zoom.max,
            step: capabilities.zoom.step
          });
          setZoom(capabilities.zoom.min);
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      contextsRef.current = { input: inputCtx, output: outputCtx };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(audioStream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            frameIntervalRef.current = window.setInterval(() => {
              if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                
                canvas.width = video.videoWidth / 2;
                canvas.height = video.videoHeight / 2;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob(async (blob) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      sessionPromise.then(session => session.sendRealtimeInput({ 
                        media: { data: base64, mimeType: 'image/jpeg' } 
                      }));
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.6);
              }
            }, 1000);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && contextsRef.current.output) {
              const ctx = contextsRef.current.output;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            // Capture transcriptions from both the AI and the User
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => prev + ' ' + text);
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscription(prev => prev + ' ' + text);
            }

            if (message.serverContent?.turnComplete) {
              setTranscription(prev => {
                const full = prev.trim();
                if (full) {
                  setTranscriptionHistory(h => [...h, full].slice(-10)); // Keep last 10 parts of conversation
                }
                return '';
              });
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            setError('The sky lens encountered a visual disturbance.');
            stopAll();
          },
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are an energetic and imaginative observer pointing a camera at the sky. When the user mentions a sighting, confirm it with high energy and enthusiastic agreement. Describe the shapes you see as if they were solid, real objects, creatures, or characters, focusing on their distinct forms and silhouettes rather than their cloud-like texture. Avoid overusing words like "fluffy" or "vaporous." Keep your responses vivid, concise, and conversational. Focus on one clear shape at a time.',
          outputAudioTranscription: {},
          inputAudioTranscription: {}, // Capture what the user says too
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to access camera/microphone.');
    }
  };

  const handleZoomChange = async (value: number) => {
    setZoom(value);
    const videoTrack = streamsRef.current.video?.getVideoTracks()[0];
    if (videoTrack) {
      try {
        // @ts-ignore
        await videoTrack.applyConstraints({ advanced: [{ zoom: value }] });
      } catch (err) {
        console.error('Failed to apply zoom constraint:', err);
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      // Combine history and current partial transcription into a narrative summary
      const finalPromptParts = [...transcriptionHistory];
      if (transcription.trim()) finalPromptParts.push(transcription.trim());
      
      // Clean up the history for the AI prompt: remove pipe characters and ensure it flows
      const promptToUse = finalPromptParts.length > 0 
        ? `In the sky, we observed: ${finalPromptParts.join('. ')}` 
        : "A whimsical cloud creature";
      
      stopAll();
      onCaptureCallback(dataUrl, promptToUse);
    }
  };

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  return {
    isActive,
    error,
    transcription,
    lastFullTranscription: transcriptionHistory[transcriptionHistory.length - 1] || transcription,
    zoom,
    zoomCapabilities,
    videoRef,
    canvasRef,
    startLens,
    stopAll,
    handleZoomChange,
    handleCapture
  };
};
