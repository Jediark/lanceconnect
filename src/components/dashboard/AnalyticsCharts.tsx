import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const areaData = [
  { name: "Mon", leads: 40 },
  { name: "Tue", leads: 30 },
  { name: "Wed", leads: 120 },
  { name: "Thu", leads: 80 },
  { name: "Fri", leads: 150 },
  { name: "Sat", leads: 200 },
  { name: "Sun", leads: 310 },
];

const funnelData = [
  { name: "New", value: 310, color: "#2563EB" },
  { name: "Contacted", value: 240, color: "#F59E0B" },
  { name: "Interested", value: 120, color: "#8B5CF6" },
  { name: "Proposal", value: 45, color: "#EC4899" },
  { name: "Won", value: 22, color: "#10B981" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-md bg-slate-950/80 dark:bg-black/70 border border-slate-200/20 dark:border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mb-1">{label}</p>
        <p className="text-sm text-blue-400 dark:text-blue-400 font-bold">
          {payload[0].value} {payload[0].value === 1 ? "Lead" : "Leads"}
        </p>
      </div>
    );
  }
  return null;
};

export function LeadsOverTimeChart({ data, className }: { data?: { name: string; leads: number }[]; className?: string }) {
  const [timeRange, setTimeRange] = useState<"1D" | "5D" | "1M" | "6M">("1M");
  
  const baseData = data && data.length > 0 ? data : areaData;
  const avgLeads = baseData.reduce((acc, curr) => acc + curr.leads, 0) / baseData.length;

  const getLast6Months = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = [];
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
      const temp = new Date(d.getFullYear(), d.getMonth() - i, 1);
      result.push(months[temp.getMonth()]);
    }
    return result;
  };

  const getChartData = () => {
    switch (timeRange) {
      case "1D":
        return [
          { name: "00:00", leads: Math.max(0, Math.round(avgLeads * 0.2)) },
          { name: "04:00", leads: Math.max(0, Math.round(avgLeads * 0.1)) },
          { name: "08:00", leads: Math.max(0, Math.round(avgLeads * 0.6)) },
          { name: "12:00", leads: Math.max(0, Math.round(avgLeads * 1.2)) },
          { name: "16:00", leads: Math.max(0, Math.round(avgLeads * 0.9)) },
          { name: "20:00", leads: Math.max(0, Math.round(avgLeads * 0.5)) },
        ];
      case "5D":
        return baseData.slice(-5);
      case "1M":
        return [
          { name: "Week 1", leads: Math.round(avgLeads * 5.2) },
          { name: "Week 2", leads: Math.round(avgLeads * 6.8) },
          { name: "Week 3", leads: Math.round(avgLeads * 4.9) },
          { name: "Week 4", leads: Math.round(avgLeads * 7.5) },
        ];
      case "6M":
        const months = getLast6Months();
        const multipliers = [22, 25, 28, 31, 27, 35];
        return months.map((m, idx) => ({
          name: m,
          leads: Math.round(avgLeads * multipliers[idx]),
        }));
      default:
        return baseData;
    }
  };

  const chartData = getChartData();

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Leads Discovered</h3>
        <div className="flex items-center rounded-lg bg-slate-100/50 p-1 dark:bg-white/[0.03] border border-slate-200/10 dark:border-white/5">
          {["1D", "5D", "1M", "6M"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
                timeRange === range
                  ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200/20 dark:border-white/5"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeOpacity={0.1} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorLeads)"
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2, fill: "#FFFFFF" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PipelineFunnelChart({ data, className }: { data?: { name: string; value: number; color: string }[]; className?: string }) {
  const chartData = data && data.length > 0 ? data : funnelData;
  return (
    <div className={cn("h-64 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--color-foreground)", fontWeight: 600 }}
            width={80}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
