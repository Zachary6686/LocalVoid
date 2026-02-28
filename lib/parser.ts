import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface ParseResult {
  data: any[];
  fileName: string;
}

export const processFileToJSON = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const extension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      const data = e.target?.result;
      try {
        if (extension === 'csv') {
          const text = new TextDecoder().decode(data as ArrayBuffer);
          const results = Papa.parse(text, { header: true, skipEmptyLines: true });
          resolve({ data: results.data, fileName: file.name });
        } else {
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          resolve({ data: json, fileName: file.name });
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};
