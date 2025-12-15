import { useState, useRef, useCallback } from "react";

export type RecordingState = "idle" | "recording" | "processing";

interface UseAudioRecorderOptions {
  maxDuration?: number; // in seconds
  onError?: (error: string) => void;
}

interface UseAudioRecorderReturn {
  state: RecordingState;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  cancelRecording: () => void;
}

export const useAudioRecorder = (
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn => {
  const { maxDuration = 120, onError } = options;
  
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resolveRef = useRef<((value: string | null) => void) | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setDuration(0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove the data URL prefix to get just the base64 data
          const base64Data = base64.split(",")[1];
          if (resolveRef.current) {
            resolveRef.current(base64Data);
            resolveRef.current = null;
          }
        };
        reader.readAsDataURL(audioBlob);
        
        cleanup();
        setState("idle");
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setState("recording");

      // Start duration timer
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setDuration(elapsed);
        
        if (elapsed >= maxDuration) {
          stopRecording();
        }
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
      cleanup();
      setState("idle");
      
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          onError?.("Permissão de microfone negada. Por favor, permita o acesso ao microfone.");
        } else if (error.name === "NotFoundError") {
          onError?.("Nenhum microfone encontrado. Verifique seu dispositivo.");
        } else {
          onError?.("Erro ao acessar o microfone. Tente novamente.");
        }
      } else {
        onError?.("Erro ao iniciar gravação. Tente novamente.");
      }
    }
  }, [cleanup, maxDuration, onError]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || state !== "recording") {
        resolve(null);
        return;
      }

      setState("processing");
      resolveRef.current = resolve;
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      mediaRecorderRef.current.stop();
    });
  }, [state]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
    }
    cleanup();
    setState("idle");
  }, [cleanup, state]);

  return {
    state,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};

// Format duration as MM:SS
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
