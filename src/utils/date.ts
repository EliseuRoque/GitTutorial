import { addDays, format, parseISO, startOfWeek } from 'date-fns';
export const uid=()=>crypto.randomUUID();
export const today=()=>format(new Date(),'yyyy-MM-dd');
export const weekStart=(date=new Date())=>startOfWeek(date,{weekStartsOn:1});
export const weekDays=(date=new Date())=>Array.from({length:7},(_,i)=>addDays(weekStart(date),i));
export const hoursBetween=(start:string,end:string)=>{const [sh,sm]=start.split(':').map(Number),[eh,em]=end.split(':').map(Number);return Math.max(0,(eh*60+em-sh*60-sm)/60)};
export const daysSince=(iso:string)=>Math.floor((Date.now()-parseISO(iso).getTime())/86400000);
