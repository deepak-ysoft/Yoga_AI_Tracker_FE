import {
  useRef,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import {
  Camera,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Target,
} from "lucide-react";
import {
  initDetector,
  validatePose,
} from "../utils/poseEngine";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

const CameraPage = () => {
  const { poseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [isCameraEnabled, setIsCameraEnabled] =
    useState(false);
  const [status, setStatus] = useState({
    isCorrect: false,
    message: "Waiting for camera...",
  });
  const [holdTime, setHoldTime] = useState(0);
  const [isHolding, setIsHolding] =
    useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isCameraEnabled) return;

    const setup = async () => {
      try {
        setStatus({
          isCorrect: false,
          message: "Requesting camera...",
        });
        const stream =
          await navigator.mediaDevices.getUserMedia(
            { video: true },
          );
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const det = await initDetector();
        setDetector(det);
        setStatus({
          isCorrect: false,
          message: "Step into the frame to begin",
        });
      } catch (err) {
        setError(
          "Camera access denied. Please enable camera permissions in your browser settings and try again.",
        );
      }
    };
    setup();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [isCameraEnabled]);

  useEffect(() => {
    let interval;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (holdTime > 0) {
        saveSession();
      }
    }
    return () => clearInterval(interval);
  }, [isHolding]);

  const saveSession = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/sessions`,
        {
          poseName:
            poseId === "tree" ? "Tree Pose" : (
              "Warrior Pose"
            ),
          holdTimeSeconds: holdTime,
          accuracyScore: 100,
        },
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(
        "Failed to save session",
        err,
      );
    }
  };

  const detect = async () => {
    if (
      detector &&
      videoRef.current &&
      videoRef.current.readyState === 4
    ) {
      const poses = await detector.estimatePoses(
        videoRef.current,
      );
      const validation = validatePose(
        poses[0]?.keypoints,
        poseId,
      );

      setStatus(validation);
      setIsHolding(validation.isCorrect);

      const ctx =
        canvasRef.current.getContext("2d");
      ctx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

      if (poses[0]?.keypoints) {
        poses[0].keypoints.forEach((kp) => {
          if (kp.score > 0.3) {
            ctx.beginPath();
            ctx.arc(
              kp.x,
              kp.y,
              6,
              0,
              2 * Math.PI,
            );
            ctx.fillStyle =
              validation.isCorrect ? "#10B981" : (
                "#8B5CF6"
              );
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      }
    }
    requestAnimationFrame(detect);
  };

  useEffect(() => {
    if (detector) {
      detect();
    }
  }, [detector]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary soft-glow-primary border border-primary/20">
            <Activity size={28} />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white capitalize tracking-tight">
              {poseId.replace("-", " ")}
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Maintain perfect form for max
              accuracy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="glass-card px-10 py-4 flex items-center gap-3 text-secondary-light font-mono text-2xl font-bold flex-1 md:flex-none justify-center soft-glow-secondary border-secondary/20 min-w-[160px]">
            <Clock
              size={28}
              className="animate-pulse"
            />
            <span>{holdTime}s</span>
          </div>
          <button
            onClick={() =>
              navigate("/pose-selection")
            }
            className="btn-secondary px-8 py-4 text-base font-bold"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 relative">
          {/* Main Camera View Container */}
          <div
            className={`relative glass-card overflow-hidden bg-gray-950 border-2 transition-all duration-700 aspect-[4/3] sm:aspect-video rounded-3xl ${
              status.isCorrect ?
                "border-secondary/50 soft-glow-secondary scale-[1.005]"
              : "border-white/5"
            }`}
          >
            {!isCameraEnabled ?
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8 bg-dark/40 backdrop-blur-sm">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary soft-glow-primary border border-primary/20">
                  <Camera size={48} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white">
                    Camera Access Required
                  </h3>
                  <p className="text-gray-400 max-w-sm mx-auto text-lg">
                    To track your yoga pose in
                    real-time, we need access to
                    your camera. No data is stored
                    or sent to any server.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setIsCameraEnabled(true)
                  }
                  className="btn-primary px-12 py-5 text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  Enable Camera
                </button>
              </div>
            : error ?
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-6 text-center z-50 bg-gray-950/90 backdrop-blur-md">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                  <AlertCircle size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-red-400 font-bold text-xl uppercase tracking-wider">
                    Access Denied
                  </p>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {error}
                  </p>
                </div>
                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="btn-primary bg-red-500 hover:bg-red-600 border-red-500/50 px-8 py-4"
                >
                  <RefreshCw
                    size={22}
                    className="mr-2"
                  />{" "}
                  Try Again
                </button>
              </div>
            : <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />

                {/* Status Overlay */}
                <div className="absolute bottom-10 left-0 right-0 z-20 px-4 sm:px-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={status.message}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -20,
                      }}
                      className={`glass-card p-8 flex items-center justify-between border-2 transition-all duration-500 rounded-3xl ${
                        status.isCorrect ?
                          "border-secondary bg-secondary/20 soft-glow-secondary shadow-2xl"
                        : "border-primary/40 bg-dark-soft/90 backdrop-blur-xl"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-500 ${status.isCorrect ? "bg-secondary text-white" : "bg-primary/20 text-primary"}`}
                        >
                          {status.isCorrect ?
                            <CheckCircle
                              size={32}
                            />
                          : <Activity
                              size={32}
                              className="animate-spin-slow"
                            />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-50 mb-1">
                            Current Status
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {status.message}
                          </p>
                        </div>
                      </div>

                      {status.isCorrect && (
                        <div className="hidden md:flex items-center gap-3 text-secondary font-black tracking-tighter text-xl">
                          <div className="w-4 h-4 rounded-full bg-secondary animate-ping" />
                          RECORDING SESSION
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Corner Decoration for correct pose */}
                {status.isCorrect && (
                  <div className="absolute inset-0 border-[16px] border-secondary/10 pointer-events-none animate-pulse z-0" />
                )}
              </>
            }
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-white">
              <Target
                size={22}
                className="text-primary"
              />
              Guidelines
            </h3>

            <div className="space-y-4">
              {[
                {
                  label: "Distance",
                  desc: "Stand 2-3 meters back",
                },
                {
                  label: "Visibility",
                  desc: "Full body must be clear",
                },
                {
                  label: "Lighting",
                  desc: "Well-lit environment",
                },
                {
                  label: "Stability",
                  desc: "Hold pose for detection",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-300">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>

            <div
              className={`p-5 rounded-2xl border transition-colors ${
                poseId === "tree" ?
                  "bg-primary/5 border-primary/20"
                : "bg-secondary/5 border-secondary/20"
              }`}
            >
              <p className="text-white font-bold mb-2">
                Pro Tip:
              </p>
              <p className="text-sm text-gray-400">
                {poseId === "tree" ?
                  "Focus on a fixed point in front of you to maintain better balance."
                : "Keep your back leg fully extended and core engaged for stability."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CameraPage;
