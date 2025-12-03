import Dexie, { Table } from 'dexie';

export interface Transaction {
    id?: number;
    date: Date;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    createdAt: Date;
}

export interface Task {
    id?: number;
    title: string;
    description?: string;
    dueDate: Date;
    completed: boolean;
    category: 'crop' | 'livestock' | 'general';
    createdAt: Date;
}

export interface UserSettings {
    id?: number;
    name: string;
    farmType: 'crop' | 'livestock' | 'mixed';
    location?: string; // For weather
    currency: string;
    onboardingCompleted: boolean;
}

export class FarmDatabase extends Dexie {
    transactions!: Table<Transaction>;
    tasks!: Table<Task>;
    settings!: Table<UserSettings>;

    constructor() {
        super('FarmSmartDB');
        this.version(1).stores({
            transactions: '++id, date, type, category',
            tasks: '++id, dueDate, completed, category',
            settings: '++id' // Singleton table really
        });
    }
}

export const db = new FarmDatabase();
