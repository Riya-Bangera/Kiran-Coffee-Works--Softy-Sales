import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyEntry } from '@/types/types';

interface ProfitLossChartProps {
  entries: DailyEntry[];
  title?: string;
}

export default function ProfitLossChart({ entries, title = 'Profit/Loss Trend' }: ProfitLossChartProps) {
  const chartData = useMemo(() => {
    if (entries.length === 0) return { maxValue: 0, minValue: 0, data: [] };

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
    );

    const profitLossValues = sortedEntries.map((entry) => entry.profit_loss || 0);
    const maxValue = Math.max(...profitLossValues, 0);
    const minValue = Math.min(...profitLossValues, 0);
    const range = maxValue - minValue || 1;

    return {
      maxValue,
      minValue,
      range,
      data: sortedEntries.map((entry) => ({
        date: new Date(entry.entry_date).getDate(),
        value: entry.profit_loss || 0,
        heightPercent: (Math.abs(entry.profit_loss || 0) / range) * 100,
      })),
    };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            No data available for chart
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="relative h-64 border border-border rounded-md p-4 bg-muted/20">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-muted-foreground py-4">
              <div className="text-right pr-2">₹{chartData.maxValue.toFixed(0)}</div>
              <div className="text-right pr-2">₹0</div>
              <div className="text-right pr-2">₹{chartData.minValue.toFixed(0)}</div>
            </div>

            {/* Zero line */}
            <div className="absolute left-16 right-4 top-1/2 border-t border-border" />

            {/* Bars */}
            <div className="ml-16 mr-4 h-full flex items-end justify-around gap-1">
              {chartData.data.map((item, index) => {
                const isProfit = item.value >= 0;
                const height = Math.max((Math.abs(item.value) / chartData.range) * 100, 2);

                return (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="flex-1 flex items-end justify-center w-full">
                      {isProfit ? (
                        <div
                          className="w-full bg-success rounded-t transition-all hover:opacity-80 cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`Day ${item.date}: ₹${item.value.toFixed(2)}`}
                        />
                      ) : (
                        <div className="w-full flex items-end justify-center" style={{ height: '50%' }}>
                          <div
                            className="w-full bg-error rounded-b transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${(height / 50) * 100}%` }}
                            title={`Day ${item.date}: ₹${item.value.toFixed(2)}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute left-16 right-4 bottom-0 flex justify-around text-xs text-muted-foreground -mb-6">
              {chartData.data.map((item, index) => (
                <div key={index} className="flex-1 text-center">
                  {index % Math.ceil(chartData.data.length / 10) === 0 ? item.date : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded" />
              <span>Profit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-error rounded" />
              <span>Loss</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
