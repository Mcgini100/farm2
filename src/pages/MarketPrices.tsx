import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { TrendingUp, Plus, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

export const MarketPrices: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [isAdding, setIsAdding] = useState(searchParams.get('action') === 'add');
    const [newItem, setNewItem] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newUnit, setNewUnit] = useState('kg');

    const prices = useLiveQuery(() => db.prices.toArray());

    const handleAddPrice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem || !newPrice) return;

        await db.prices.add({
            item: newItem,
            price: parseFloat(newPrice),
            unit: newUnit,
            lastUpdated: new Date()
        });

        setNewItem('');
        setNewPrice('');
        setIsAdding(false);
    };

    const updatePrice = async (id: number, currentItem: string, currentUnit: string) => {
        const newPriceVal = prompt(`Enter new price for ${currentItem} (per ${currentUnit}):`);
        if (newPriceVal && !isNaN(parseFloat(newPriceVal))) {
            await db.prices.update(id, {
                price: parseFloat(newPriceVal),
                lastUpdated: new Date()
            });
        }
    };

    return (
        <div className="p-4 pb-24 space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Market Prices</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Track local market rates</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95"
                >
                    <Plus size={24} />
                </button>
            </header>

            {isAdding && (
                <form onSubmit={handleAddPrice} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 animate-in slide-in-from-top-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Item Name</label>
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="e.g. Maize, Goats, Tomatoes"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Price ($)</label>
                            <input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Unit</label>
                            <select
                                value={newUnit}
                                onChange={(e) => setNewUnit(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="kg">per kg</option>
                                <option value="ton">per ton</option>
                                <option value="bucket">per bucket</option>
                                <option value="head">per head</option>
                                <option value="crate">per crate</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium"
                    >
                        Save Price
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-3">
                {prices?.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => updatePrice(item.id!, item.item, item.unit)}
                        className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.item}</p>
                                <p className="text-xs text-gray-500">per {item.unit}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">
                                {format(item.lastUpdated, 'MMM d')}
                            </p>
                        </div>
                    </div>
                ))}

                {prices?.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <TrendingUp className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-gray-500 dark:text-gray-400">No prices tracked yet.</p>
                        <p className="text-sm text-gray-400">Add items to track their market value.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketPrices;
