import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  Shield,
  Zap,
  Smartphone,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const Landing = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap size={16} />
              <span>Next Gen Yoga Assistant</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight text-white">
              Perfect Your Form with{" "}
              <span className="text-gradient-primary">
                AI Logic
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Real-time pose correction powered by
              advanced computer vision. Level up
              your practice with instant feedback
              and session tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started Free{" "}
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="btn-secondary"
              >
                View Demo
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-dark bg-gray-800"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Joined by{" "}
                <span className="text-white font-bold">
                  1,000+
                </span>{" "}
                yogis today
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="relative"
          >
            <div className="relative z-10 glass-card p-4 aspect-square max-w-md mx-auto animate-float soft-glow-primary overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              <div className="h-full w-full bg-gray-900 rounded-2xl flex items-center justify-center border border-white/5">
                <Activity
                  size={80}
                  className="text-primary animate-pulse"
                />
              </div>
            </div>
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <motion.div
            variants={item}
            className="glass-card p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">
              Privacy First
            </h3>
            <p className="text-gray-400">
              All pose detection happens on your
              device. We never store or stream
              your video feed.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="glass-card p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">
              Real-time Analysis
            </h3>
            <p className="text-gray-400">
              Instant feedback on your pose
              accuracy with sub-second latency
              using MoveNet.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="glass-card p-8 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-bold">
              PWA Support
            </h3>
            <p className="text-gray-400">
              Install it as an app on any device.
              Practice yoga at home, in the gym,
              or outdoors.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-last lg:order-first"
        >
          <div className="glass-card p-2 aspect-video overflow-hidden soft-glow-secondary">
            <div className="h-full w-full bg-gray-900 rounded-2xl flex items-center justify-center border border-white/5 relative">
              <Activity
                size={40}
                className="text-secondary opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/5" />
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <h2 className="text-4xl font-bold leading-tight">
            Why choose{" "}
            <span className="text-secondary">
              YogaPose AI?
            </span>
          </h2>
          <div className="space-y-4">
            {[
              "Automated hold timers for every pose",
              "Detailed session history & statistics",
              "Supports multiple core yoga poses",
              "Completely responsive and mobile friendly",
            ].map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-gray-300"
              >
                <CheckCircle2
                  className="text-secondary"
                  size={20}
                />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center space-y-8 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to{" "}
              <span className="text-gradient-primary">
                Transform
              </span>{" "}
              Your Practice?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto py-6">
              Join thousands of others improving
              their yoga journey with AI-powered
              guidance. Free to get started. No
              credit card required.
            </p>
            <Link
              to="/register"
              className="btn-primary mx-auto w-fit px-12 py-4"
            >
              Start Your Journey Now
            </Link>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-[80px]" />
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
