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

export function LeadsOverTimeChart({ className }: { className?: string }) {
  return (
    <div className={cn("h-64 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
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
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            itemStyle={{ color: "#2563EB" }}
          />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#2563EB"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorLeads)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PipelineFunnelChart({ className }: { className?: string }) {
  return (
    <div className={cn("h-64 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={funnelData}
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
            {funnelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
