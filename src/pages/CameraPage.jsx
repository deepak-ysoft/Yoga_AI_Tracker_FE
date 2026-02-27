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
  const [status, setStatus] = useState({
    isCorrect: false,
    message: "Initialising camera...",
  });
  const [holdTime, setHoldTime] = useState(0);
  const [isHolding, setIsHolding] =
    useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const setup = async () => {
      try {
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
          "Camera access denied. Please enable camera permissions.",
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
  }, []);

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary soft-glow-primary">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white capitalize tracking-tight">
              {poseId.replace("-", " ")}
            </h2>
            <p className="text-gray-400 text-sm">
              Perfect your form in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="glass-card px-8 py-3 flex items-center gap-3 text-secondary-light font-mono text-xl font-bold flex-1 md:flex-none justify-center soft-glow-secondary border-secondary/20">
            <Clock
              size={24}
              className="animate-pulse"
            />
            <span>{holdTime}s</span>
          </div>
          <button
            onClick={() =>
              navigate("/pose-selection")
            }
            className="btn-secondary px-6"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative group">
          {/* Main Camera View */}
          <div
            className={`relative glass-card overflow-hidden aspect-video bg-gray-950 border-2 transition-all duration-700 ${
              status.isCorrect ?
                "border-secondary/50 soft-glow-secondary scale-[1.01]"
              : "border-white/5"
            }`}
          >
            {error ?
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-4 text-center">
                <AlertCircle
                  size={64}
                  className="text-red-500"
                />
                <p className="text-red-400 font-medium">
                  {error}
                </p>
                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="btn-primary"
                >
                  <RefreshCw size={20} /> Try
                  Again
                </button>
              </div>
            : <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale-[20%]"
                />
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />

                {/* Status Overlay */}
                <div className="absolute bottom-10 left-0 right-0 z-20 px-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={status.message}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -20,
                      }}
                      className={`glass-card p-6 flex items-center justify-between border-2 transition-colors duration-500 ${
                        status.isCorrect ?
                          "border-secondary bg-secondary/20"
                        : "border-primary/40 bg-dark-soft/80"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${status.isCorrect ? "bg-secondary text-white" : "bg-primary/20 text-primary"}`}
                        >
                          {status.isCorrect ?
                            <CheckCircle
                              size={24}
                            />
                          : <Activity
                              size={24}
                              className="animate-spin-slow"
                            />
                          }
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Status
                          </p>
                          <p className="text-lg font-bold text-white">
                            {status.message}
                          </p>
                        </div>
                      </div>

                      {status.isCorrect && (
                        <div className="hidden sm:flex items-center gap-2 text-secondary font-bold">
                          <CheckCircle
                            size={20}
                            className="animate-bounce"
                          />
                          RECORDING
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Validation Ring Decoration */}
                {status.isCorrect && (
                  <div className="absolute inset-0 border-[10px] border-secondary/20 pointer-events-none animate-pulse" />
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
