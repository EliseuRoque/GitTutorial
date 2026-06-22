export type Priority='Baixa'|'Média'|'Alta';
export type Category={id:string;name:string;color:string;icon:string;custom:boolean};
export type Draft={id:string;title?:string;content:string;createdAt:string;updatedAt:string};
export type Activity={id:string;title:string;description:string;categoryId:string;date:string;start:string;end:string;priority:Priority;important:boolean;completed:boolean;updatedAt:string};
export type Settings={slotMinutes:15|30|60;theme:'light'|'dark';localBackups:boolean};
export type Alert={id:string;message:string;activityId?:string;createdAt:string;read:boolean};
