import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Play,
} from "lucide-react";

const POSES = [
  {
    id: "tree",
    name: "Tree Pose",
    level: "Beginner",
    points: 100,
    description:
      "Improve your balance and focus while strengthening your core and legs.",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&h=400&auto=format&fit=crop",
    color: "primary",
  },
  {
    id: "warrior",
    name: "Warrior Pose",
    level: "Intermediate",
    points: 250,
    description:
      "Build strength and endurance in your legs while opening your hips and chest.",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&h=400&auto=format&fit=crop",
    color: "secondary",
  },
];

const PoseSelection = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div
        variants={item}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
          <Sparkles size={14} />
          Choose Your Path
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Select Your{" "}
          <span className="text-gradient-primary">
            Practice
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Embark on a guided journey. Our AI
          monitors every movement to ensure
          perfect form, safety, and maximum
          benefit.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        {POSES.map((pose) => (
          <motion.div
            key={pose.id}
            variants={item}
            whileHover={{ y: -8 }}
            className="glass-card group flex flex-col h-full overflow-hidden border-white/5 hover:border-white/10"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src={pose.image}
                alt={pose.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />

              <div className="absolute top-6 left-6 flex gap-2">
                <div className="bg-dark/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${pose.id === "tree" ? "bg-primary" : "bg-secondary"} animate-pulse`}
                  />
                  {pose.level}
                </div>
              </div>

              <div className="absolute bottom-6 right-6">
                <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2">
                  <Trophy
                    size={16}
                    className="text-orange-400"
                  />
                  <span className="text-white font-bold">
                    {pose.points} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="p-10 flex flex-col flex-grow space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors">
                  {pose.name}
                </h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  {pose.description}
                </p>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    Difficulty
                  </span>
                  <span className="text-white font-medium">
                    {pose.difficulty}
                  </span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    Focus
                  </span>
                  <span className="text-white font-medium">
                    Balance
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/camera/${pose.id}`)
                }
                className={`w-full mt-auto py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-3 ${
                  pose.id === "tree" ?
                    "bg-primary hover:bg-primary-light soft-glow-primary"
                  : "bg-secondary hover:bg-secondary-light soft-glow-secondary"
                } hover:scale-[1.02] active:scale-[0.98]`}
              >
                <Play
                  size={20}
                  fill="currentColor"
                />
                Begin Session
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PoseSelection;
