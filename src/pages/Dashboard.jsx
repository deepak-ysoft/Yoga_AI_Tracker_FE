import { useState, useEffect } from "react";
import axios from "axios";
import {
  Activity,
  Clock,
  Target,
  Calendar,
} from "lucide-react";

import { motion } from "framer-motion";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sessionsRes] =
          await Promise.all([
            axios.get(
              `${import.meta.env.VITE_API_URL}/sessions/stats`,
            ),
            axios.get(
              `${import.meta.env.VITE_API_URL}/sessions`,
            ),
          ]);
        setStats(statsRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        console.error(
          "Failed to fetch dashboard data",
          err,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Activity
          className="text-primary animate-pulse"
          size={40}
        />
      </div>
    );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      <motion.div
        variants={item}
        className="flex justify-between items-end"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">
            Your Progress
          </h1>
          <p className="text-gray-400">
            Keep up the great work, you're doing
            amazing!
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <motion.div
          variants={item}
          className="glass-card p-8 flex items-center gap-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
          <div className="p-5 bg-primary/10 rounded-2xl text-primary soft-glow-primary">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Total Sessions
            </p>
            <p className="text-4xl font-bold mt-1">
              {stats?.totalSessions || 0}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="glass-card p-8 flex items-center gap-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors" />
          <div className="p-5 bg-secondary/10 rounded-2xl text-secondary soft-glow-secondary">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Best Hold Time
            </p>
            <p className="text-4xl font-bold mt-1">
              {stats?.bestHoldTime || 0}s
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="glass-card p-8 flex items-center gap-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors" />
          <div className="p-5 bg-orange-500/10 rounded-2xl text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            <Target size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Avg. Accuracy
            </p>
            <p className="text-4xl font-bold mt-1">
              {stats?.averageAccuracy || 0}%
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div
        variants={item}
        className="glass-card overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <Calendar
              className="text-primary"
              size={20}
            />
            Recent Activity
          </h2>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-white/[0.02] text-gray-500 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5 font-semibold">
                  Pose Name
                </th>
                <th className="px-8 py-5 font-semibold">
                  Hold Duration
                </th>
                <th className="px-8 py-5 font-semibold text-center">
                  Accuracy Score
                </th>
                <th className="px-8 py-5 font-semibold text-right">
                  Completion Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {sessions.length > 0 ?
                sessions.map((session, i) => (
                  <motion.tr
                    key={session._id}
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.05 + 0.5,
                    }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <span className="font-semibold text-white group-hover:text-primary transition-colors capitalize">
                        {session.poseName.replace(
                          "-",
                          " ",
                        )}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-300">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-secondary">
                          {
                            session.holdTimeSeconds
                          }
                        </span>
                        <span className="text-gray-500 text-xs">
                          seconds
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          (
                            session.accuracyScore >
                            80
                          ) ?
                            "bg-secondary/10 text-secondary"
                          : "bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {session.accuracyScore}%
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-400 text-right font-mono text-xs">
                      {new Date(
                        session.createdAt,
                      ).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </td>
                  </motion.tr>
                ))
              : <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-20 text-center"
                  >
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Activity size={48} />
                      <p className="italic text-lg">
                        No sessions recorded yet.
                      </p>
                      <p className="text-sm">
                        Start your practice and
                        see your journey here!
                      </p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
