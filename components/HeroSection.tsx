"use client";
import { motion } from 'framer-motion';

export default function HeroSection({ isOffline }: { isOffline: boolean }) {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wide uppercase rounded-full ${
          isOffline ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
        }`}
      >
        {isOffline ? "真空隔离模式已激活 🛡️" : "正在连接安全节点"}
      </motion.div>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600">
        LocalVoid
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        你的财报，只有 <span className="text-blue-600 font-bold">你能看</span>。
        <br />100% 本地解析，拒绝数据上云。
      </p>
    </div>
  );
}
