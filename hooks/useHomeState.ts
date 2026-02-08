
// Fix: Added React import to resolve "Cannot find namespace 'React'" error for React.ChangeEvent
import React, { useState, useRef, useCallback } from 'react';
import { interpretCloud, detectCloudSegments, generateBackstory, generateSpeech } from '../services/interpretationService';
import { generateTransformedCloud } from '../services/generationService';
import { extractCloudGeometry } from '../utils/cv';
import { decode, decodeAudioData } from '../utils/audio';
import { ProcessingState, CloudInterpretation, CloudSegment } from '../types';
import { SAMPLE_CLOUDS } from '../utils/samples';

export const useHomeState = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedOriginal, setResizedOriginal] = useState<string | null>(null);
  const [silhouetteMap, setSilhouetteMap] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<CloudInterpretation | null>(null);
  const [backstory, setBackstory] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [imageSize, setImageSize] = useState<{ w: number, h: number } | null>(null);
  const [state, setState] = useState<ProcessingState>({ status: 'idle' });
  const [userGuide, setUserGuide] = useState('');
  const [catMode, setCatMode] = useState(false);
  const [showSkyLens, setShowSkyLens] = useState(false);
  const [detectedSegments, setDetectedSegments] = useState<CloudSegment[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<CloudSegment[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const reset = useCallback(() => {
    setOriginalImage(null);
    setResizedOriginal(null);
    setGeneratedImage(null);
    setInterpretation(null);
    setBackstory(null);
    setIsNarrating(false);
    setSilhouetteMap(null);
    setImageSize(null);
    setDetectedSegments([]);
    setSelectedSegments([]);
    setHasScanned(false);
    setState({ status: 'idle' });
    setUserGuide('');
    setShowSkyLens(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (currentAudioSourceRef.current) {
      currentAudioSourceRef.current.stop();
    }
  }, []);

  const runDetection = useCallback(async () => {
    if (!originalImage) return;
    setState({ status: 'detecting', message: 'Detecting sky inhabitants...' });
    try {
      const segments = await detectCloudSegments(originalImage);
      setDetectedSegments(segments);
      setHasScanned(true);
      if (segments.length === 1) setSelectedSegments([segments[0]]);
      setState({ status: 'idle' });
    } catch (err) {
      console.warn('Detection failed.', err);
      setHasScanned(true);
      setState({ status: 'idle' });
    }
  }, [originalImage]);

  const toggleSegment = useCallback((seg: CloudSegment) => {
    setSelectedSegments(prev => {
      const exists = prev.find(s => s.id === seg.id);
      if (exists) {
        return prev.filter(s => s.id !== seg.id);
      }
      return [...prev, seg];
    });
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      setGeneratedImage(null);
      setInterpretation(null);
      setSilhouetteMap(null);
      setHasScanned(false);
      setDetectedSegments([]);
      setSelectedSegments([]);
    };
    reader.readAsDataURL(file);
  };

  const handlePasteImage = useCallback((base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null);
    setInterpretation(null);
    setSilhouetteMap(null);
    setHasScanned(false);
    setDetectedSegments([]);
    setSelectedSegments([]);
  }, []);

  const handleUrlSubmit = async (url: string) => {
    setState({ status: 'interpreting', message: 'Fetching from the stratosphere...' });
    
    try {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg&n=-1`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setOriginalImage(result);
        setGeneratedImage(null);
        setInterpretation(null);
        setSilhouetteMap(null);
        setHasScanned(false);
        setDetectedSegments([]);
        setSelectedSegments([]);
        setState({ status: 'idle' });
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      setState({ status: 'error', message: 'Cloud retrieval failed. Try another link!' });
    }
  };

  const loadSample = async () => {
    const randomSample = SAMPLE_CLOUDS[Math.floor(Math.random() * SAMPLE_CLOUDS.length)];
    await handleUrlSubmit(randomSample);
  };

  const processImage = useCallback(async (imageToProcess?: string, guideToUse?: string) => {
    const targetImage = imageToProcess || originalImage;
    if (!targetImage) return;

    try {
      setState({ status: 'scanning', message: 'Analyzing cloud structures...' });
      const rois = selectedSegments.length > 0 ? selectedSegments.map(s => s.box2d) : undefined;
      const geometry = await extractCloudGeometry(targetImage, rois);
      
      setSilhouetteMap(geometry.mask);
      setResizedOriginal(geometry.resizedOriginal);
      setImageSize({ w: geometry.width, h: geometry.height });
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      setState({ status: 'interpreting', message: 'Conceptualizing patterns...' });
      const base64Data = geometry.resizedOriginal.split(',')[1];
      const finalGuide = guideToUse !== undefined ? guideToUse : userGuide.trim() || undefined;
      const result = await interpretCloud(base64Data, finalGuide, catMode);
      setInterpretation(result);

      setState({ status: 'generating', message: `Sculpting ${result.objectName}...` });
      const newImage = await generateTransformedCloud(
        geometry.resizedOriginal, 
        geometry.mask, 
        result,
        geometry.width,
        geometry.height
      );
      setGeneratedImage(newImage);
      
      setState({ status: 'completed' });
    } catch (error) {
      console.error('Processing Error:', error);
      setState({ 
        status: 'error', 
        message: 'The silhouette logic failed to stabilize. Try a high-contrast cloud photo!' 
      });
    }
  }, [originalImage, userGuide, catMode, selectedSegments]);

  const narrateBackstory = useCallback(async () => {
    if (!interpretation || isNarrating) return;
    
    try {
      setIsNarrating(true);
      let currentBackstory = backstory;
      if (!currentBackstory) {
        currentBackstory = await generateBackstory(interpretation);
        setBackstory(currentBackstory);
      }
      const base64Audio = await generateSpeech(currentBackstory);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      if (currentAudioSourceRef.current) {
        currentAudioSourceRef.current.stop();
      }
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsNarrating(false);
      source.start();
      currentAudioSourceRef.current = source;
    } catch (err) {
      console.error('Narration error:', err);
      setIsNarrating(false);
    }
  }, [interpretation, isNarrating, backstory]);

  const handleSkyLensCapture = (image: string, aiPrompt: string) => {
    setShowSkyLens(false);
    setOriginalImage(image);
    setUserGuide(aiPrompt);
    setHasScanned(false);
    setDetectedSegments([]);
    setSelectedSegments([]);
    processImage(image, aiPrompt);
  };

  return {
    originalImage,
    resizedOriginal,
    silhouetteMap,
    generatedImage,
    interpretation,
    backstory,
    isNarrating,
    state,
    userGuide,
    catMode,
    showSkyLens,
    detectedSegments,
    selectedSegments,
    hasScanned,
    fileInputRef,
    setCatMode,
    setUserGuide,
    setShowSkyLens,
    toggleSegment,
    reset,
    handleFileUpload,
    handlePasteImage,
    handleUrlSubmit,
    loadSample,
    processImage,
    runDetection,
    handleSkyLensCapture,
    narrateBackstory
  };
};
