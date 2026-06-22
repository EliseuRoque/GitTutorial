import { ButtonHTMLAttributes } from 'react';import { cn } from '../../utils/style';
export function Button({className,...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={cn('rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50',className)} {...props}/>}
