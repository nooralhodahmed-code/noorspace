"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ["#8CAB46", "#E6C65D", "#A78BFA", "#1e293b"];

export default function CreatorChart({ data }: ChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Small delay to let the max-w-5xl layout stabilize
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) {
        return <div className="w-full h-[350px] bg-[#F8F9F5] rounded-[32px] animate-pulse" />;
    }

    return (
        <div className="w-full h-[350px] min-h-[350px]" dir="ltr">
            <ResponsiveContainer width="99%" height="100%" debounce={100}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                className="hover:opacity-80 transition-opacity outline-none"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: '20px',
                            border: 'none',
                            boxShadow: '0 10px 30px rgba(30,41,59,0.1)',
                            direction: 'rtl',
                            fontFamily: 'inherit',
                            fontWeight: 'bold'
                        }}
                    />
                    <Legend
                        iconType="circle"
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{ paddingRight: '20px', fontWeight: 'bold', fontSize: '12px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}