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
      const result = await processFileToJSON(file);
      await generateAndDownloadPDF(result.data, watermark);
    } catch (err) {
      alert(`解析失败: ${err.message || "未知错误"}`);
      console.error(err);
}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-12 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] shadow-2xl transition-all hover:border-blue-400">
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">自定义 PDF 水印</label>
        <input 
          type="text" 
          placeholder="例如：财务专用 / 内部传阅" 
          className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          onChange={(e) => setWatermark(e.target.value)}
        />
      </div>
      <label className="flex flex-col items-center justify-center cursor-pointer group py-10">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg transition-all group-hover:scale-110 ${
          loading ? 'bg-slate-400 animate-pulse' : 'bg-blue-600'
        }`}>
          <span className="text-3xl text-white font-bold">{loading ? "..." : "＋"}</span>
        </div>
        <p className="text-lg text-slate-600 font-medium">点击或拖拽文件到这里</p>
        <p className="text-sm text-slate-400 mt-2">支持 .xlsx, .xls, .csv</p>
        <input type="file" className="hidden" onChange={handleFile} accept=".xlsx,.xls,.csv" />
      </label>
    </div>
  );
}

