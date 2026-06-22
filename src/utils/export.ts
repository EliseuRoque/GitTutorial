import * as XLSX from 'xlsx';
export function downloadCsv(name:string,rows:Record<string,unknown>[]){const ws=XLSX.utils.json_to_sheet(rows);const csv=XLSX.utils.sheet_to_csv(ws);download(name+'.csv',csv,'text/csv')}
export function downloadXlsx(name:string,sheets:Record<string,unknown[]>){const wb=XLSX.utils.book_new();Object.entries(sheets).forEach(([n,rows])=>XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),n));XLSX.writeFile(wb,name+'.xlsx')}
function download(name:string,content:string,type:string){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
