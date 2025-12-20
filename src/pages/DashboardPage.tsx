import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DailyEntryForm from '@/components/sales/DailyEntryForm';
import DailyEntriesTable from '@/components/sales/DailyEntriesTable';
import { getDailyEntries } from '@/db/api';
import type { DailyEntry } from '@/types/types';
import { Plus, X } from 'lucide-react';

export default function DashboardPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<DailyEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await getDailyEntries(30);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditEntry(null);
    loadEntries();
  };

  const handleEdit = (entry: DailyEntry) => {
    setEditEntry(entry);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditEntry(null);
  };

  const calculateSummary = () => {
    const totalRevenue = entries.reduce((sum, entry) => sum + (entry.total_revenue || 0), 0);
    const totalCost = entries.reduce((sum, entry) => sum + (entry.total_cost || 0), 0);
    const profitLoss = totalRevenue - totalCost;

    return { totalRevenue, totalCost, profitLoss };
  };

  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 xl:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold text-foreground">Kiran Coffee Works</h1>
            <p className="text-muted-foreground mt-1">Daily Sales Tracker</p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Daily Entry
            </Button>
          )}
          {showForm && (
            <Button onClick={handleCancel} variant="outline" size="lg">
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{summary.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{summary.totalCost.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit/Loss (Last 30 Days)</CardTitle>
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

        {/* Form */}
        {showForm && (
          <DailyEntryForm
            onSuccess={handleSuccess}
            editEntry={editEntry}
            onCancel={handleCancel}
          />
        )}

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : (
              <DailyEntriesTable
                entries={entries}
                onEdit={handleEdit}
                onDelete={loadEntries}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
