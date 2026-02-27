import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-converter";

// Initialize the detector
let detector = null;

export const initDetector = async () => {
  if (detector) return detector;

  try {
    if (!tf) {
      console.error(
        "TensorFlow.js core not loaded correctly",
      );
      throw new Error("TFCoreLoadError");
    }

    // Initialize backend
    try {
      const backend =
        tf.findBackend("webgl") ? "webgl" : "cpu";
      console.log(
        `Setting pose detection backend to: ${backend}`,
      );
      await tf.setBackend(backend);
      await tf.ready();
    } catch (backendError) {
      console.warn(
        "Backend initialization failed, falling back to CPU",
        backendError,
      );
      await tf.setBackend("cpu");
    }

    const model =
      poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
      modelType:
        poseDetection.movenet.modelType
          .SINGLEPOSE_LIGHTNING,
      enableSmoothing: true,
    };

    detector = await poseDetection.createDetector(
      model,
      detectorConfig,
    );
    if (!detector)
      throw new Error("DetectorCreationFailed");

    return detector;
  } catch (error) {
    console.error(
      "Pose Detector Init Error:",
      error,
    );
    // Ultimate fallback to CPU if anything fails during init
    try {
      await tf.setBackend("cpu");
      const model =
        poseDetection.SupportedModels.MoveNet;
      detector =
        await poseDetection.createDetector(
          model,
          {
            modelType:
              poseDetection.movenet.modelType
                .SINGLEPOSE_LIGHTNING,
          },
        );
      return detector;
    } catch (innerError) {
      console.error(
        "Critical: All AI fallbacks failed",
        innerError,
      );
      throw innerError;
    }
  }
};

// Calculate angle between three points (A, B, C) with B as vertex
export const calculateAngle = (A, B, C) => {
  const radians =
    Math.atan2(C.y - B.y, C.x - B.x) -
    Math.atan2(A.y - B.y, A.x - B.x);
  let angle = Math.abs(
    (radians * 180.0) / Math.PI,
  );

  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

// Pose validation logic
export const validatePose = (
  keypoints,
  poseType,
) => {
  if (!keypoints || keypoints.length === 0)
    return {
      isCorrect: false,
      message: "Body not detected",
    };

  const kp = {};
  keypoints.forEach((k) => {
    if (k.score > 0.2) kp[k.name] = k;
  });

  if (poseType === "tree") {
    // Check if essential points for Tree Pose are detected
    const required = [
      "left_hip",
      "right_hip",
      "left_knee",
      "right_knee",
      "left_ankle",
      "right_ankle",
    ];
    const missing = required.filter(
      (name) => !kp[name],
    );

    if (missing.length > 0)
      return {
        isCorrect: false,
        message: "Please show your full body",
      };

    // Simple Tree Pose logic: One knee should be bent (angle < 90)
    const leftKneeAngle = calculateAngle(
      kp.left_hip,
      kp.left_knee,
      kp.left_ankle,
    );
    const rightKneeAngle = calculateAngle(
      kp.right_hip,
      kp.right_knee,
      kp.right_ankle,
    );

    if (
      leftKneeAngle < 90 ||
      rightKneeAngle < 90
    ) {
      return {
        isCorrect: true,
        message: "Pose Correct!",
        accuracy: 100,
      };
    }
    return {
      isCorrect: false,
      message:
        "Bend your knee and place foot on thigh",
    };
  }

  if (poseType === "warrior") {
    const required = [
      "left_shoulder",
      "right_shoulder",
      "left_elbow",
      "right_elbow",
    ];
    const missing = required.filter(
      (name) => !kp[name],
    );

    if (missing.length > 0)
      return {
        isCorrect: false,
        message: "Show your arms clearly",
      };

    // Simple Warrior logic: Arms should be relatively horizontal (angle with torso ~90)
    const leftArmAngle = calculateAngle(
      kp.left_hip,
      kp.left_shoulder,
      kp.left_elbow,
    );
    const rightArmAngle = calculateAngle(
      kp.right_hip,
      kp.right_shoulder,
      kp.right_elbow,
    );

    if (
      leftArmAngle > 70 &&
      leftArmAngle < 110 &&
      rightArmAngle > 70 &&
      rightArmAngle < 110
    ) {
      return {
        isCorrect: true,
        message: "Pose Correct!",
        accuracy: 100,
      };
    }
    return {
      isCorrect: false,
      message: "Extend arms parallel to floor",
    };
  }

  return {
    isCorrect: false,
    message: "Analyzing...",
  };
};
