"use client";
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';

// 🚨 方案：使用系统内置字体的后备逻辑，或确保字体注册不阻塞进程
Font.register({
  family: 'Noto Sans SC',
  src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/SubsetOTF/SC/NotoSansSC-Regular.otf',
});

const styles = StyleSheet.create({
  page: { fontFamily: 'Noto Sans SC', padding: 40, backgroundColor: '#ffffff' },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center', color: '#1e3a8a', fontWeight: 'bold' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingVertical: 8, alignItems: 'center' },
  cell: { fontSize: 9, flex: 1, paddingHorizontal: 2, overflow: 'hidden' },
  watermark: {
    position: 'absolute',
    top: '45%',
    left: '10%',
    fontSize: 50,
    color: 'rgba(200, 200, 200, 0.15)',
    transform: 'rotate(-45deg)',
    zIndex: -1,
  }
});

const MyDocument = ({ data, watermark }: { data: any[], watermark: string }) => (
  <Document title="LocalVoid Export">
    <Page size="A4" style={styles.page}>
      <Text style={styles.watermark}>{watermark || "CONFIDENTIAL"}</Text>
      <Text style={styles.header}>LocalVoid 数据报告</Text>
      
      {/* 表头预览 */}
      {data.length > 0 && (
        <View style={[styles.row, { backgroundColor: '#f9fafb', borderBottomColor: '#3b82f6' }]}>
          {Object.keys(data[0]).slice(0, 5).map((key, i) => (
            <Text key={i} style={[styles.cell, { fontWeight: 'bold' }]}>{key}</Text>
          ))}
        </View>
      )}

      {/* 数据行 */}
      {data.slice(0, 50).map((row, i) => (
        <View key={i} style={styles.row}>
          {Object.values(row).slice(0, 5).map((val: any, j) => (
            <Text key={j} style={styles.cell}>{String(val)}</Text>
          ))}
        </View>
      ))}
      
      <Text style={{ fontSize: 8, marginTop: 30, color: '#9ca3af', textAlign: 'center' }}>
        此文档由 LocalVoid (Secure Node) 本地生成。隐私等级：最高。
      </Text>
    </Page>
  </Document>
);

export const generateAndDownloadPDF = async (data: any[], watermark: string) => {
  try {
    // 关键：创建一个渲染实例
    const doc = <MyDocument data={data} watermark={watermark} />;
    const asBlob = await pdf(doc).toBlob();
    
    // 检查 Blob 是否有效
    if (!asBlob || asBlob.size === 0) throw new Error("PDF 数据流生成为空");

    const url = URL.createObjectURL(asBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LocalVoid_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // 清理内存
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

  } catch (err: any) {
    console.error("PDF Engine Crash:", err);
    throw new Error(err.message || "浏览器内核拒绝了渲染请求");
  }
};

