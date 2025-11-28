import React from 'react';

export function Section({ title, children }) {
    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                {title}
            </h2>
            {children}
        </div>
    );
}
