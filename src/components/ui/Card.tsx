import { HTMLAttributes } from 'react';import { cn } from '../../utils/style';
export function Card({className,...props}:HTMLAttributes<HTMLDivElement>){return <div className={cn('rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur dark:bg-slate-900/80',className)} {...props}/>}
