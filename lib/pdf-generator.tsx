import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';

// 1. 注册字体 (使用网络静态 TTF，彻底解决 Unknown Format 问题)
Font.register({
  family: 'Noto Sans SC',
  src: 'https://fonts.gstatic.com/s/notosanssc/v26/k3kXo84MPtRZxe-I633xc77XPh1904o.ttf',
});

// 2. 样式定义 (仅此一份，严禁重复)
const styles = StyleSheet.create({
  page: { 
    fontFamily: 'Noto Sans SC', 
    padding: 40, 
    backgroundColor: '#ffffff' 
  },
  header: { 
    fontSize: 20, 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#1e3a8a' 
  },
  row: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb', 
    paddingVertical: 8 
  },
  cell: { 
    fontSize: 10, 
    flex: 1 
  },
  watermark: {
    position: 'absolute',
    top: '45%',
    left: '15%',
    fontSize: 60,
    color: 'rgba(200, 200, 200, 0.2)',
    transform: 'rotate(-45deg)',
    zIndex: -1,
  }
});

// 3. 文档结构
const MyDocument = ({ data, watermark }: { data: any[], watermark: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.watermark}>{watermark}</Text>
      <Text style={styles.header}>LocalVoid 安全转换报告</Text>
      {data.slice(0, 30).map((row, i) => (
        <View key={i} style={styles.row}>
          {Object.values(row).map((val: any, j) => (
            <Text key={j} style={styles.cell}>{String(val)}</Text>
          ))}
        </View>
      ))}
      <Text style={{ fontSize: 8, marginTop: 20, color: '#9ca3af', textAlign: 'center' }}>
        此文档由 LocalVoid 本地生成，未经云端处理。
      </Text>
    </Page>
  </Document>
);

// 4. 下载函数
export const generateAndDownloadPDF = async (data: any[], watermark: string) => {
  try {
    const blob = await pdf(<MyDocument data={data} watermark={watermark} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LocalVoid_Export_${Date.now()}.pdf`;
    link.click();
  } catch (err) {
    console.error("PDF Generation failed:", err);
    throw new Error("PDF 生成引擎初始化失败，请稍后重试");
  }
};

