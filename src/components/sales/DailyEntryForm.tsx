import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getDefaultCosts, createDailyEntry, updateDailyEntry } from '@/db/api';
import type { DailyEntry, DailyEntryInput } from '@/types/types';

interface DailyEntryFormProps {
  onSuccess?: () => void;
  editEntry?: DailyEntry | null;
  onCancel?: () => void;
}

export default function DailyEntryForm({ onSuccess, editEntry, onCancel }: DailyEntryFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DailyEntryInput>({
    entry_date: new Date().toISOString().split('T')[0],
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
  });

  useEffect(() => {
    if (editEntry) {
      setFormData({
        entry_date: editEntry.entry_date,
        milk_liters: editEntry.milk_liters,
        milk_price_per_liter: editEntry.milk_price_per_liter,
        premix_packets: editEntry.premix_packets,
        premix_price_per_packet: editEntry.premix_price_per_packet,
        coffee_liters: editEntry.coffee_liters,
        coffee_price_per_liter: editEntry.coffee_price_per_liter,
        cups_used: editEntry.cups_used,
        cup_price: editEntry.cup_price,
        spoons_used: editEntry.spoons_used,
        spoon_price: editEntry.spoon_price,
        cups_sold: editEntry.cups_sold,
        price_per_cup_sold: editEntry.price_per_cup_sold,
      });
    } else {
      loadDefaultCosts();
    }
  }, [editEntry]);

  const loadDefaultCosts = async () => {
    try {
      const defaults = await getDefaultCosts();
      if (defaults) {
        setFormData((prev) => ({
          ...prev,
          milk_price_per_liter: defaults.milk_price_per_liter,
          premix_price_per_packet: defaults.premix_price_per_packet,
          coffee_price_per_liter: defaults.coffee_price_per_liter,
          cup_price: defaults.cup_price,
          spoon_price: defaults.spoon_price,
          price_per_cup_sold: defaults.price_per_cup_sold,
        }));
      }
    } catch (error) {
      console.error('Error loading default costs:', error);
    }
  };

  const handleChange = (field: keyof DailyEntryInput, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'entry_date' ? value : parseFloat(value) || 0,
    }));
  };

  const calculateTotals = () => {
    const milkTotal = formData.milk_liters * formData.milk_price_per_liter;
    const premixTotal = formData.premix_packets * formData.premix_price_per_packet;
    const coffeeTotal = formData.coffee_liters * formData.coffee_price_per_liter;
    const cupsTotal = formData.cups_used * formData.cup_price;
    const spoonsTotal = formData.spoons_used * formData.spoon_price;
    const totalCost = milkTotal + premixTotal + coffeeTotal + cupsTotal + spoonsTotal;
    const revenue = formData.cups_sold * formData.price_per_cup_sold;
    const profitLoss = revenue - totalCost;

    return {
      milkTotal,
      premixTotal,
      coffeeTotal,
      cupsTotal,
      spoonsTotal,
      totalCost,
      revenue,
      profitLoss,
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editEntry) {
        await updateDailyEntry(editEntry.id, formData);
        toast({
          title: 'Success',
          description: 'Daily entry updated successfully',
        });
      } else {
        await createDailyEntry(formData);
        toast({
          title: 'Success',
          description: 'Daily entry created successfully',
        });
      }
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save entry',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editEntry ? 'Edit Daily Entry' : 'Add Daily Entry'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="entry_date">Date</Label>
            <Input
              id="entry_date"
              type="date"
              value={formData.entry_date}
              onChange={(e) => handleChange('entry_date', e.target.value)}
              required
            />
          </div>

          {/* Milk */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 border border-border rounded-md">
            <div className="xl:col-span-3">
              <h3 className="font-medium text-foreground">Milk</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="milk_liters">Liters Used</Label>
              <Input
                id="milk_liters"
                type="number"
                step="0.01"
                value={formData.milk_liters}
                onChange={(e) => handleChange('milk_liters', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="milk_price_per_liter">Price per Liter (₹)</Label>
              <Input
                id="milk_price_per_liter"
                type="number"
                step="0.01"
                value={formData.milk_price_per_liter}
                onChange={(e) => handleChange('milk_price_per_liter', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Total Cost (₹)</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-medium">
                {totals.milkTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Softy Premix */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 border border-border rounded-md">
            <div className="xl:col-span-3">
              <h3 className="font-medium text-foreground">Softy Premix</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="premix_packets">Packets Used</Label>
              <Input
                id="premix_packets"
                type="number"
                value={formData.premix_packets}
                onChange={(e) => handleChange('premix_packets', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="premix_price_per_packet">Price per Packet (₹)</Label>
              <Input
                id="premix_price_per_packet"
                type="number"
                step="0.01"
                value={formData.premix_price_per_packet}
                onChange={(e) => handleChange('premix_price_per_packet', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Total Cost (₹)</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-medium">
                {totals.premixTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Coffee Decoction */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 border border-border rounded-md">
            <div className="xl:col-span-3">
              <h3 className="font-medium text-foreground">Coffee Decoction</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coffee_liters">Liters Used</Label>
              <Input
                id="coffee_liters"
                type="number"
                step="0.01"
                value={formData.coffee_liters}
                onChange={(e) => handleChange('coffee_liters', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coffee_price_per_liter">Price per Liter (₹)</Label>
              <Input
                id="coffee_price_per_liter"
                type="number"
                step="0.01"
                value={formData.coffee_price_per_liter}
                onChange={(e) => handleChange('coffee_price_per_liter', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Total Cost (₹)</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-medium">
                {totals.coffeeTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Cups */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 border border-border rounded-md">
            <div className="xl:col-span-3">
              <h3 className="font-medium text-foreground">Cups</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cups_used">Cups Used</Label>
              <Input
                id="cups_used"
                type="number"
                value={formData.cups_used}
                onChange={(e) => handleChange('cups_used', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cup_price">Price per Cup (₹)</Label>
              <Input
                id="cup_price"
                type="number"
                step="0.01"
                value={formData.cup_price}
                onChange={(e) => handleChange('cup_price', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Total Cost (₹)</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-medium">
                {totals.cupsTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Spoons */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 border border-border rounded-md">
            <div className="xl:col-span-3">
              <h3 className="font-medium text-foreground">Spoons</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spoons_used">Spoons Used</Label>
              <Input
                id="spoons_used"
                type="number"
                value={formData.spoons_used}
                onChange={(e) => handleChange('spoons_used', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spoon_price">Price per Spoon (₹)</Label>
              <Input
                id="spoon_price"
                type="number"
                step="0.01"
                value={formData.spoon_price}
                onChange={(e) => handleChange('spoon_price', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Total Cost (₹)</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-medium">
                {totals.spoonsTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Sales */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 border border-border rounded-md bg-accent">
            <div className="xl:col-span-3">
              <h3 className="font-medium text-foreground">Sales</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cups_sold">Cups Sold</Label>
              <Input
                id="cups_sold"
                type="number"
                value={formData.cups_sold}
                onChange={(e) => handleChange('cups_sold', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_per_cup_sold">Price per Cup (₹)</Label>
              <Input
                id="price_per_cup_sold"
                type="number"
                step="0.01"
                value={formData.price_per_cup_sold}
                onChange={(e) => handleChange('price_per_cup_sold', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Total Revenue (₹)</Label>
              <div className="h-10 px-3 py-2 bg-background rounded-md flex items-center font-medium">
                {totals.revenue.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 border-2 border-primary rounded-md bg-primary/5">
            <div className="space-y-2">
              <Label>Total Cost (₹)</Label>
              <div className="h-10 px-3 py-2 bg-background rounded-md flex items-center font-medium text-lg">
                {totals.totalCost.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total Revenue (₹)</Label>
              <div className="h-10 px-3 py-2 bg-background rounded-md flex items-center font-medium text-lg">
                {totals.revenue.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Profit/Loss (₹)</Label>
              <div
                className={`h-10 px-3 py-2 rounded-md flex items-center font-bold text-lg ${
                  totals.profitLoss >= 0
                    ? 'bg-success text-success-foreground'
                    : 'bg-error text-error-foreground'
                }`}
              >
                {totals.profitLoss >= 0 ? '+' : ''}
                {totals.profitLoss.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : editEntry ? 'Update Entry' : 'Add Entry'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
