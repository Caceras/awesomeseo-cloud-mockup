"use client"

import { memo } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { issueMix } from "@/lib/mock-data"

// See `health-trend-chart.tsx` — memoised for the same reason.
export const IssueMixChart = memo(function IssueMixChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={issueMix} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="category"
            stroke="var(--color-muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--color-muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--color-popover-foreground)",
            }}
            cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "var(--color-muted-foreground)" }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="critical" stackId="a" fill="var(--color-chart-4)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="warning" stackId="a" fill="var(--color-chart-3)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="notice" stackId="a" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})
