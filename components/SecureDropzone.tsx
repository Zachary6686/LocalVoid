"use client";
import React, { useState } from 'react';
import { processFileToJSON } from '../lib/parser';
import { generateAndDownloadPDF } from '../lib/pdf-generator';

export default function SecureDropzone() {
  const [loading, setLoading] = useState(false);
  const [watermark, setWatermark] = useState('机密数据');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // 1. 本地解析 (File -> JSON)
      const result = await processFileToJSON(file);
      
      if (!result.data || result.data.length === 0) {
        throw new Error("文件内容为空或格式无法识别");
      }

      // 2. 本地渲染 (JSON -> PDF)
      await generateAndDownloadPDF(result.data, watermark);
      
    } catch (err: any) {
      console.error("LocalVoid Trace:", err);
      alert(`转换中断: ${err.message || "未知错误"}`);
    } finally {
      setLoading(false);
      // 清空 input 允许重复上传同一文件
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] shadow-2xl">
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">PDF Watermark</label>
        <input 
          type="text" 
          maxLength={15}
          placeholder="输入水印 (例如: INTERNAL)" 
          className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-mono"
          onChange={(e) => setWatermark(e.target.value)}
        />
      </div>
      
      <label className="flex flex-col items-center justify-center cursor-pointer group py-8 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-transform group-hover:scale-105 ${
          loading ? 'bg-slate-400 animate-spin' : 'bg-blue-600'
        }`}>
          <span className="text-2xl text-white">{loading ? "⚙️" : "＋"}</span>
        </div>
        <p className="text-slate-600 font-semibold italic">
          {loading ? "正在执行本地加密转换..." : "选择 XLSX / CSV 数据文件"}
        </p>
        <input type="file" className="hidden" onChange={handleFile} accept=".xlsx,.xls,.csv" />
      </label>
      
      <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
        <span>✓ 零服务器通信</span>
        <span>✓ 内存即时销毁</span>
        <span>✓ 军工级本地解析</span>
      </div>
    </div>
  );
}


