// Simple keyword-based categorization for now. 
// In a real app, this could use a more advanced NLP model or API.

const CATEGORIES = {
    expense: {
        inputs: ['fertilizer', 'seed', 'pesticide', 'herbicide', 'manure', 'feed', 'medicine', 'vaccine'],
        labor: ['wages', 'salary', 'casual', 'worker', 'harvesting', 'planting', 'weeding'],
        equipment: ['tractor', 'plough', 'repair', 'fuel', 'diesel', 'petrol', 'maintenance', 'tools'],
        utilities: ['water', 'electricity', 'internet', 'airtime'],
        transport: ['bus', 'truck', 'delivery', 'transport'],
        other: []
    },
    income: {
        sales: ['sold', 'sale', 'market', 'selling'],
        services: ['ploughing service', 'transport service'],
        other: []
    }
};

export const categorizeTransaction = (description: string): { type: 'income' | 'expense', category: string } => {
    const lowerDesc = description.toLowerCase();

    // Default to expense
    let type: 'income' | 'expense' = 'expense';
    let category = 'general';

    // Check for income keywords
    if (lowerDesc.includes('sold') || lowerDesc.includes('sale') || lowerDesc.includes('income') || lowerDesc.includes('received')) {
        type = 'income';
    }

    const categories = CATEGORIES[type];

    for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(k => lowerDesc.includes(k))) {
            category = cat;
            break;
        }
    }

    return { type, category };
};
