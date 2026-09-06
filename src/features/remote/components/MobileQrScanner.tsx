import { useEffect, useRef, useState } from "react";
import { Camera, X, AlertCircle } from "lucide-react";

interface MobileQrScannerProps {
  onScan: (sessionId: string, salt: string) => void;
  onClose: () => void;
}

export function MobileQrScanner({ onScan, onClose }: MobileQrScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let active = true;
    let localStream: MediaStream | null = null;
    let detector: any = null;
    let animFrame: number;

    // Check BarcodeDetector support
    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      try {
        detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      } catch (e) {
        console.warn("BarcodeDetector init error", e);
      }
    }

    async function startCamera() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (!active) {
          localStream.getTracks().forEach((t) => t.stop());
          return;
        }

        setStream(localStream);
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
          await videoRef.current.play();
        }

        // Loop detection using native BarcodeDetector
        const checkFrame = async () => {
          if (!active || !videoRef.current) return;

          if (detector && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const rawValue = barcodes[0].rawValue;
                if (handleQrResult(rawValue)) {
                  return; // Scanned successfully
                }
              }
            } catch {
              // Frame dropped, continue
            }
          }
          animFrame = requestAnimationFrame(checkFrame);
        };

        animFrame = requestAnimationFrame(checkFrame);
      } catch (err: any) {
        console.error("Camera access error", err);
        setError(
          err?.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access or enter session ID manually."
            : "Could not access camera. Please enter session ID manually.",
        );
      }
    }

    function handleQrResult(urlOrText: string): boolean {
      try {
        let url: URL;
        if (urlOrText.startsWith("http://") || urlOrText.startsWith("https://")) {
          url = new URL(urlOrText);
        } else {
          url = new URL(`http://dummy.com/${urlOrText.startsWith("/") ? urlOrText.slice(1) : urlOrText}`);
        }

        const s = url.searchParams.get("s");
        const salt = url.searchParams.get("salt");
        if (s && salt) {
          onScan(s, salt);
          return true;
        }
      } catch {
        // Not a URL with params
      }
      return false;
    }

    void startCamera();

    return () => {
      active = false;
      cancelAnimationFrame(animFrame);
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-between p-4 select-none">
      {/* Header */}
      <div className="w-full flex items-center justify-between text-white pt-2">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Scan QR Code</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video Viewport & Scanning Overlay */}
      <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden border-2 border-white/20 my-auto bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Focus Target Border Box */}
        <div className="absolute inset-8 border-2 border-primary/80 rounded-xl pointer-events-none">
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />
        </div>

        {/* Scan line animation */}
        <div className="absolute inset-x-8 top-8 h-0.5 bg-primary/90 animate-bounce pointer-events-none" />
      </div>

      {/* Footer Instructions / Error */}
      <div className="w-full max-w-sm text-center pb-6 space-y-3">
        {error ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/20 border border-destructive/30 text-destructive-foreground text-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
            <span>{error}</span>
          </div>
        ) : (
          <p className="text-xs text-white/70">
            Point camera at the QR code displayed on the laptop screen.
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer"
        >
          Cancel & Enter Manually
        </button>
      </div>
    </div>
  );
}
