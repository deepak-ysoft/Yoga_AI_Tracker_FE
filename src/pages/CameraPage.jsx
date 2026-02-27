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
          message: "Analyzing pose...",
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
        "http://localhost:5000/api/sessions",
        {
          poseName:
            poseId === "tree" ? "Tree Pose" : (
              "Warrior Pose"
            ),
          holdTimeSeconds: holdTime,
          accuracyScore: 100, // Simplified for MVP
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

      // Draw keypoints
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
              5,
              0,
              2 * Math.PI,
            );
            ctx.fillStyle =
              validation.isCorrect ? "#10B981" : (
                "#8B5CF6"
              );
            ctx.fill();
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold capitalize">
          {poseId.replace("-", " ")}
        </h2>
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2 text-secondary font-mono">
            <Clock size={18} /> {holdTime}s
          </div>
          <button
            onClick={() =>
              navigate("/pose-selection")
            }
            className="text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="relative glass-card overflow-hidden aspect-video bg-black flex items-center justify-center">
        {error ?
          <div className="text-center p-8 space-y-4">
            <AlertCircle
              size={48}
              className="text-red-500 mx-auto"
            />
            <p className="text-red-400">
              {error}
            </p>
            <button
              onClick={() =>
                window.location.reload()
              }
              className="btn-primary"
            >
              <RefreshCw size={18} /> Retry
            </button>
          </div>
        : <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
              <div
                className={`glass-card p-4 text-center border-2 transition-all duration-500 ${status.isCorrect ? "border-secondary bg-secondary/10" : "border-primary bg-primary/10"}`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {status.isCorrect ?
                    <CheckCircle
                      size={20}
                      className="text-secondary"
                    />
                  : <Activity
                      size={20}
                      className="text-primary"
                    />
                  }
                  <span className="font-bold">
                    {status.isCorrect ?
                      "PERFECT FORM"
                    : "POSE DETECTION"}
                  </span>
                </div>
                <p className="text-sm opacity-80">
                  {status.message}
                </p>
              </div>
            </div>
          </>
        }
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Target
            size={18}
            className="text-primary"
          />{" "}
          Instructions
        </h3>
        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
          <li>
            Stand approximately 2-3 meters away
            from the camera.
          </li>
          <li>
            Ensure your full body is visible in
            the frame.
          </li>
          <li>
            {poseId === "tree" ?
              "Place one foot on your inner thigh and keep your balance."
            : "Extend your arms straight and lunge forward."
            }
          </li>
          <li>
            The timer starts once your pose is
            correctly detected.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CameraPage;
