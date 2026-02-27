import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const POSES = [
  {
    id: "tree",
    name: "Tree Pose",
    description:
      "Balance on one leg, with the other foot against your thigh. Hands in prayer position.",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&h=300&auto=format&fit=crop",
  },
  {
    id: "warrior",
    name: "Warrior Pose",
    description:
      "Lunge forward with one leg, keeping back leg straight. Raise arms up parallel to ground.",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&h=300&auto=format&fit=crop",
  },
];

const PoseSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Choose Your Pose
        </h1>
        <p className="text-gray-400">
          Select a pose to begin your AI-guided
          practice. Our system will track your
          form and hold time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {POSES.map((pose) => (
          <div
            key={pose.id}
            className="glass-card group flex flex-col h-full overflow-hidden"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={pose.image}
                alt={pose.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
                {pose.difficulty}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold mb-2">
                {pose.name}
              </h3>
              <p className="text-gray-400 mb-6 flex-grow">
                {pose.description}
              </p>
              <button
                onClick={() =>
                  navigate(`/camera/${pose.id}`)
                }
                className="btn-primary w-full justify-center"
              >
                <Play
                  size={20}
                  fill="currentColor"
                />{" "}
                Start Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoseSelection;
