import React from 'react';

interface MobileCardViewProps<T> {
    data: T[];
    renderCard: (item: T, index: number) => React.ReactNode;
    emptyState?: React.ReactNode;
}

export function MobileCardView<T>({
    data,
    renderCard,
    emptyState
}: MobileCardViewProps<T>) {
    if (data.length === 0) {
        return emptyState || (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No data found
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {data.map((item, index) => renderCard(item, index))}
        </div>
    );
}
