import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ProfitLossChart from '@/components/sales/ProfitLossChart';
import { getDailyEntriesByYear, getAvailableYears } from '@/db/api';
import type { DailyEntry, MonthlySummary } from '@/types/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function YearlyViewPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    loadEntries();
  }, [selectedYear]);

  const loadYears = async () => {
    try {
      const years = await getAvailableYears();
      setAvailableYears(years);
    } catch (error) {
      console.error('Error loading years:', error);
    }
  };

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await getDailyEntriesByYear(selectedYear);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateYearlySummary = () => {
    const totalRevenue = entries.reduce((sum, entry) => sum + (entry.total_revenue || 0), 0);
    const totalCost = entries.reduce((sum, entry) => sum + (entry.total_cost || 0), 0);
    const profitLoss = totalRevenue - totalCost;
    const entriesCount = entries.length;

    return { totalRevenue, totalCost, profitLoss, entriesCount };
  };

  const calculateMonthlySummaries = (): MonthlySummary[] => {
    const summaries: MonthlySummary[] = [];

    for (let month = 1; month <= 12; month++) {
      const monthEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.entry_date);
        return entryDate.getMonth() + 1 === month;
      });

      const totalRevenue = monthEntries.reduce((sum, entry) => sum + (entry.total_revenue || 0), 0);
      const totalCost = monthEntries.reduce((sum, entry) => sum + (entry.total_cost || 0), 0);
      const profitLoss = totalRevenue - totalCost;

      summaries.push({
        month: months[month - 1],
        year: selectedYear,
        total_revenue: totalRevenue,
        total_cost: totalCost,
        profit_loss: profitLoss,
        entries_count: monthEntries.length,
      });
    }

    return summaries;
  };

  const yearlySummary = calculateYearlySummary();
  const monthlySummaries = calculateMonthlySummaries();

  // Create chart data with one entry per month (using average or total)
  const monthlyChartData: DailyEntry[] = monthlySummaries
    .filter((summary) => summary.entries_count > 0)
    .map((summary, index) => ({
      id: `month-${index}`,
      entry_date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-15`,
      milk_liters: 0,
      milk_price_per_liter: 0,
      premix_packets: 0,
      premix_price_per_packet: 0,
      coffee_liters: 0,
      coffee_price_per_liter: 0,
      cups_used: 0,
      cup_price: 0,
      spoons_used: 0,
      spoon_price: 0,
      cups_sold: 0,
      price_per_cup_sold: 0,
      total_revenue: summary.total_revenue,
      total_cost: summary.total_cost,
      profit_loss: summary.profit_loss,
    }));

  const handlePreviousYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 xl:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl xl:text-4xl font-bold text-foreground">Yearly Sales Summary</h1>
          <p className="text-muted-foreground mt-1">View annual performance and trends</p>
        </div>

        {/* Year Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePreviousYear}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={handleNextYear}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{yearlySummary.entriesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{yearlySummary.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{yearlySummary.totalCost.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  yearlySummary.profitLoss >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {yearlySummary.profitLoss >= 0 ? '+' : ''}₹{yearlySummary.profitLoss.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {!loading && monthlyChartData.length > 0 && (
          <ProfitLossChart
            entries={monthlyChartData}
            title={`${selectedYear} - Monthly Profit/Loss Trend`}
          />
        )}

        {/* Monthly Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : (
              <div className="rounded-md border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground font-semibold">Month</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-center">Entries</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-right">Revenue</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-right">Cost</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-right">Profit/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySummaries.map((summary, index) => (
                      <TableRow
                        key={summary.month}
                        className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                      >
                        <TableCell className="font-medium">{summary.month}</TableCell>
                        <TableCell className="text-center">{summary.entries_count}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(summary.total_revenue)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(summary.total_cost)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-bold ${
                              summary.profit_loss >= 0 ? 'text-success' : 'text-error'
                            }`}
                          >
                            {summary.profit_loss >= 0 ? '+' : ''}
                            {formatCurrency(summary.profit_loss)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Total Row */}
                    <TableRow className="bg-primary/10 font-bold border-t-2 border-primary">
                      <TableCell className="font-bold">TOTAL</TableCell>
                      <TableCell className="text-center font-bold">{yearlySummary.entriesCount}</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(yearlySummary.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(yearlySummary.totalCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-bold ${
                            yearlySummary.profitLoss >= 0 ? 'text-success' : 'text-error'
                          }`}
                        >
                          {yearlySummary.profitLoss >= 0 ? '+' : ''}
                          {formatCurrency(yearlySummary.profitLoss)}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
