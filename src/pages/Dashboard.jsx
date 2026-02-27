import { useState, useEffect } from "react";
import axios from "axios";
import {
  Activity,
  Clock,
  Target,
  Calendar,
} from "lucide-react";

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
              "http://localhost:5000/api/sessions/stats",
            ),
            axios.get(
              "http://localhost:5000/api/sessions",
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

  if (loading)
    return (
      <div className="text-center mt-20">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
        Your Progress
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-4 bg-primary/20 rounded-2xl text-primary">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              Total Sessions
            </p>
            <p className="text-2xl font-bold">
              {stats?.totalSessions || 0}
            </p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-4 bg-secondary/20 rounded-2xl text-secondary">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              Best Hold Time
            </p>
            <p className="text-2xl font-bold">
              {stats?.bestHoldTime || 0}s
            </p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-500">
            <Target size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              Avg. Accuracy
            </p>
            <p className="text-2xl font-bold">
              {stats?.averageAccuracy || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">
            Recent Sessions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4">
                  Pose
                </th>
                <th className="px-6 py-4">
                  Duration
                </th>
                <th className="px-6 py-4">
                  Accuracy
                </th>
                <th className="px-6 py-4">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-sm">
              {sessions.length > 0 ?
                sessions.map((session) => (
                  <tr
                    key={session._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-sans font-medium">
                      {session.poseName}
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {session.holdTimeSeconds}s
                    </td>
                    <td className="px-6 py-4 text-primary">
                      {session.accuracyScore}%
                    </td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                      <Calendar size={14} />{" "}
                      {new Date(
                        session.createdAt,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              : <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500 italic"
                  >
                    No sessions yet. Start your
                    first yoga pose!
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
