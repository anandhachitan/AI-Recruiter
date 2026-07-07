import React from 'react';

function StatsCard({ title, value, trend, trendType = 'up', badgeText }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h2>
                {badgeText && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[10px] font-bold rounded-full uppercase">
                        {badgeText}
                    </span>
                )}
            </div>

            <div className="flex items-end justify-between">
                <h2 className="text-3xl font-extrabold text-gray-800">{value}</h2>
                {trend && (
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${trendType === 'up' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                        }`}>
                        {trend}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatsCard;
