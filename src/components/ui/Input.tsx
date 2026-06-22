import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';import { cn } from '../../utils/style';
export const Input=(p:InputHTMLAttributes<HTMLInputElement>)=><input {...p} className={cn('w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary',p.className)}/>;
export const Textarea=(p:TextareaHTMLAttributes<HTMLTextAreaElement>)=><textarea {...p} className={cn('w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary',p.className)}/>;
