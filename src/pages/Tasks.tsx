import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { Calendar as CalendarIcon, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import clsx from 'clsx';

export const Tasks: React.FC = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [newTaskCategory, setNewTaskCategory] = useState<'crop' | 'livestock' | 'general'>('general');

    const tasks = useLiveQuery(() =>
        db.tasks.orderBy('dueDate').toArray()
    );

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        await db.tasks.add({
            title: newTaskTitle,
            dueDate: new Date(newTaskDate),
            category: newTaskCategory,
            completed: false,
            createdAt: new Date()
        });

        setNewTaskTitle('');
        setIsAdding(false);
    };

    const toggleTask = async (id: number, currentStatus: boolean) => {
        await db.tasks.update(id, { completed: !currentStatus });
    };

    const deleteTask = async (id: number) => {
        await db.tasks.delete(id);
    };

    const getRelativeDate = (date: Date) => {
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM d');
    };

    return (
        <div className="p-4 pb-24 space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your farm activities</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95"
                >
                    <Plus size={24} />
                </button>
            </header>

            {isAdding && (
                <form onSubmit={handleAddTask} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 animate-in slide-in-from-top-4 fade-in duration-200">
                    <div>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="date"
                            value={newTaskDate}
                            onChange={(e) => setNewTaskDate(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                        <select
                            value={newTaskCategory}
                            onChange={(e) => setNewTaskCategory(e.target.value as any)}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        >
                            <option value="general">General</option>
                            <option value="crop">Crops</option>
                            <option value="livestock">Livestock</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!newTaskTitle.trim()}
                            className="bg-primary-600 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {tasks?.map((task) => (
                    <div
                        key={task.id}
                        className={clsx(
                            "group bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 transition-all",
                            task.completed && "opacity-60 bg-gray-50 dark:bg-gray-800/50"
                        )}
                    >
                        <button
                            onClick={() => toggleTask(task.id!, task.completed)}
                            className={clsx(
                                "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                task.completed
                                    ? "bg-primary-500 border-primary-500 text-white"
                                    : "border-gray-300 dark:border-gray-600 hover:border-primary-500"
                            )}
                        >
                            {task.completed && <CheckCircle2 size={16} />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <p className={clsx(
                                "font-medium text-gray-900 dark:text-white truncate transition-all",
                                task.completed && "line-through text-gray-500"
                            )}>
                                {task.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span className={clsx(
                                    "flex items-center gap-1",
                                    isPast(task.dueDate) && !isToday(task.dueDate) && !task.completed && "text-red-500 font-medium"
                                )}>
                                    <CalendarIcon size={12} />
                                    {getRelativeDate(task.dueDate)}
                                </span>
                                <span>•</span>
                                <span className="capitalize">{task.category}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => deleteTask(task.id!)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {tasks?.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No tasks yet.</p>
                        <p className="text-sm text-gray-400">Keep track of your farm work here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
