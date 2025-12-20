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
import DailyEntriesTable from '@/components/sales/DailyEntriesTable';
import ProfitLossChart from '@/components/sales/ProfitLossChart';
import { getDailyEntriesByMonth, getAvailableYears } from '@/db/api';
import type { DailyEntry } from '@/types/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MonthlyViewPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    loadEntries();
  }, [selectedYear, selectedMonth]);

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
      const data = await getDailyEntriesByMonth(selectedYear, selectedMonth);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    const totalRevenue = entries.reduce((sum, entry) => sum + (entry.total_revenue || 0), 0);
    const totalCost = entries.reduce((sum, entry) => sum + (entry.total_cost || 0), 0);
    const profitLoss = totalRevenue - totalCost;
    const entriesCount = entries.length;

    return { totalRevenue, totalCost, profitLoss, entriesCount };
  };

  const summary = calculateSummary();

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const selectedMonthName = months.find((m) => m.value === selectedMonth)?.label || '';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 xl:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl xl:text-4xl font-bold text-foreground">Monthly Sales Summary</h1>
          <p className="text-muted-foreground mt-1">View detailed monthly performance</p>
        </div>

        {/* Month/Year Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col xl:flex-row items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-4 flex-1 max-w-md">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
              </div>

              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.entriesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{summary.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{summary.totalCost.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  summary.profitLoss >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {summary.profitLoss >= 0 ? '+' : ''}₹{summary.profitLoss.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {!loading && entries.length > 0 && (
          <ProfitLossChart
            entries={entries}
            title={`${selectedMonthName} ${selectedYear} - Daily Profit/Loss`}
          />
        )}

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedMonthName} {selectedYear} Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : (
              <DailyEntriesTable entries={entries} onDelete={loadEntries} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
