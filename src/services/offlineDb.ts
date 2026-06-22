import { openDB } from 'idb';import type { Activity, Category, Draft, ReadingLog, Project } from '../types';
export const dbPromise=openDB('planner-360',1,{upgrade(db){['activities','categories','drafts','reading_logs','projects','sync_queue'].forEach(s=>db.createObjectStore(s,{keyPath:'id'}))}});
export async function putOffline(store:'activities'|'categories'|'drafts'|'reading_logs'|'projects',value:Activity|Category|Draft|ReadingLog|Project){const db=await dbPromise;await db.put(store,value);await db.put('sync_queue',{id:crypto.randomUUID(),store,op:'upsert',value,createdAt:new Date().toISOString()})}
export async function listOffline<T>(store:string){return (await dbPromise).getAll(store) as Promise<T[]>}
export async function flushQueue(sync:(item:unknown)=>Promise<void>){const db=await dbPromise;const q=await db.getAll('sync_queue');for(const item of q){await sync(item);await db.delete('sync_queue',(item as {id:string}).id)}}
