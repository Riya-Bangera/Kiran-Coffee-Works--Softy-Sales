import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteDailyEntry } from '@/db/api';
import type { DailyEntry } from '@/types/types';
import { Pencil, Trash2 } from 'lucide-react';

interface DailyEntriesTableProps {
  entries: DailyEntry[];
  onEdit?: (entry: DailyEntry) => void;
  onDelete?: () => void;
}

export default function DailyEntriesTable({ entries, onEdit, onDelete }: DailyEntriesTableProps) {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await deleteDailyEntry(deleteId);
      toast({
        title: 'Success',
        description: 'Entry deleted successfully',
      });
      setDeleteId(null);
      onDelete?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete entry',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No entries found. Add your first daily entry to get started.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary">
              <TableHead className="text-primary-foreground font-semibold">Date</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Milk (L)</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Premix (Pkt)</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Coffee (L)</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Cups</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Spoons</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Cups Sold</TableHead>
              <TableHead className="text-primary-foreground font-semibold text-right">Total Cost</TableHead>
              <TableHead className="text-primary-foreground font-semibold text-right">Revenue</TableHead>
              <TableHead className="text-primary-foreground font-semibold text-right">Profit/Loss</TableHead>
              <TableHead className="text-primary-foreground font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                <TableCell className="font-medium">{formatDate(entry.entry_date)}</TableCell>
                <TableCell>
                  {entry.milk_liters}
                  <div className="text-xs text-muted-foreground">{formatCurrency(entry.milk_total_cost || 0)}</div>
                </TableCell>
                <TableCell>
                  {entry.premix_packets}
                  <div className="text-xs text-muted-foreground">{formatCurrency(entry.premix_total_cost || 0)}</div>
                </TableCell>
                <TableCell>
                  {entry.coffee_liters}
                  <div className="text-xs text-muted-foreground">{formatCurrency(entry.coffee_total_cost || 0)}</div>
                </TableCell>
                <TableCell>
                  {entry.cups_used}
                  <div className="text-xs text-muted-foreground">{formatCurrency(entry.cups_total_cost || 0)}</div>
                </TableCell>
                <TableCell>
                  {entry.spoons_used}
                  <div className="text-xs text-muted-foreground">{formatCurrency(entry.spoons_total_cost || 0)}</div>
                </TableCell>
                <TableCell className="font-medium">{entry.cups_sold}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(entry.total_cost || 0)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(entry.total_revenue || 0)}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-bold ${
                      (entry.profit_loss || 0) >= 0 ? 'text-success' : 'text-error'
                    }`}
                  >
                    {(entry.profit_loss || 0) >= 0 ? '+' : ''}
                    {formatCurrency(entry.profit_loss || 0)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-2 justify-center">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(entry)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
