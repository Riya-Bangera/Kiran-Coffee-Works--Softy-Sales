import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getDefaultCosts, updateDefaultCosts } from '@/db/api';
import type { DefaultCosts } from '@/types/types';

export default function DefaultCostsSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [costs, setCosts] = useState<Partial<DefaultCosts>>({
    milk_price_per_liter: 0,
    premix_price_per_packet: 0,
    coffee_price_per_liter: 0,
    cup_price: 0,
    spoon_price: 0,
    price_per_cup_sold: 0,
  });

  useEffect(() => {
    loadCosts();
  }, []);

  const loadCosts = async () => {
    try {
      const data = await getDefaultCosts();
      if (data) {
        setCosts({
          milk_price_per_liter: data.milk_price_per_liter,
          premix_price_per_packet: data.premix_price_per_packet,
          coffee_price_per_liter: data.coffee_price_per_liter,
          cup_price: data.cup_price,
          spoon_price: data.spoon_price,
          price_per_cup_sold: data.price_per_cup_sold,
        });
      }
    } catch (error) {
      console.error('Error loading costs:', error);
    }
  };

  const handleChange = (field: keyof DefaultCosts, value: string) => {
    setCosts((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDefaultCosts(costs);
      toast({
        title: 'Success',
        description: 'Default costs updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update costs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Unit Costs</CardTitle>
        <CardDescription>
          Set default prices that will auto-fill in the daily entry form. You can override these for specific days if needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="milk_price_per_liter">Milk Price per Liter (₹)</Label>
              <Input
                id="milk_price_per_liter"
                type="number"
                step="0.01"
                value={costs.milk_price_per_liter}
                onChange={(e) => handleChange('milk_price_per_liter', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="premix_price_per_packet">Softy Premix Price per Packet (₹)</Label>
              <Input
                id="premix_price_per_packet"
                type="number"
                step="0.01"
                value={costs.premix_price_per_packet}
                onChange={(e) => handleChange('premix_price_per_packet', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coffee_price_per_liter">Coffee Decoction Price per Liter (₹)</Label>
              <Input
                id="coffee_price_per_liter"
                type="number"
                step="0.01"
                value={costs.coffee_price_per_liter}
                onChange={(e) => handleChange('coffee_price_per_liter', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cup_price">Cup Price (₹)</Label>
              <Input
                id="cup_price"
                type="number"
                step="0.01"
                value={costs.cup_price}
                onChange={(e) => handleChange('cup_price', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spoon_price">Spoon Price (₹)</Label>
              <Input
                id="spoon_price"
                type="number"
                step="0.01"
                value={costs.spoon_price}
                onChange={(e) => handleChange('spoon_price', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_cup_sold">Selling Price per Cup (₹)</Label>
              <Input
                id="price_per_cup_sold"
                type="number"
                step="0.01"
                value={costs.price_per_cup_sold}
                onChange={(e) => handleChange('price_per_cup_sold', e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Default Costs'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
