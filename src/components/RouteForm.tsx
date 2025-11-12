import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '@/components/ui/dialog';
import { fetchVehicles, fetchDrivers } from '@/lib/api';

const RouteForm = () => {
  const [formData, setFormData] = useState({
    vehicle_number: '',
    driver_name: '',
    distance_km: '',
    fuel_liters: '',
    waybill_number: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers
  });

  const createRoute = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('https://functions.poehali.dev/afa79f4a-120a-4f80-9fc8-950ee685fd2c?entity=routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          distance_km: data.distance_km ? parseInt(data.distance_km) : 0,
          fuel_liters: data.fuel_liters ? parseInt(data.fuel_liters) : 0,
        })
      });
      if (!response.ok) throw new Error('Ошибка создания рейса');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: 'Успешно',
        description: 'Рейс создан'
      });
      setFormData({
        vehicle_number: '',
        driver_name: '',
        distance_km: '',
        fuel_liters: '',
        waybill_number: ''
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать рейс',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicle_number || !formData.driver_name) {
      toast({
        title: 'Ошибка',
        description: 'Выберите транспорт и водителя',
        variant: 'destructive'
      });
      return;
    }
    createRoute.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="vehicle">Транспорт *</Label>
        <Select value={formData.vehicle_number} onValueChange={(v) => setFormData({ ...formData, vehicle_number: v })}>
          <SelectTrigger id="vehicle">
            <SelectValue placeholder="Выберите ТС" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((v: any) => (
              <SelectItem key={v.id} value={v.number}>
                {v.number} — {v.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="driver">Водитель *</Label>
        <Select value={formData.driver_name} onValueChange={(v) => setFormData({ ...formData, driver_name: v })}>
          <SelectTrigger id="driver">
            <SelectValue placeholder="Выберите водителя" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map((d: any) => (
              <SelectItem key={d.id} value={d.name}>
                {d.name} ({d.license})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="waybill">Путевой лист №</Label>
        <Input
          id="waybill"
          placeholder="Например: ПЛ-2024-001"
          value={formData.waybill_number}
          onChange={(e) => setFormData({ ...formData, waybill_number: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="distance">Расстояние (км)</Label>
          <Input
            id="distance"
            type="number"
            placeholder="0"
            value={formData.distance_km}
            onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel">Топливо (л)</Label>
          <Input
            id="fuel"
            type="number"
            placeholder="0"
            value={formData.fuel_liters}
            onChange={(e) => setFormData({ ...formData, fuel_liters: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" disabled={createRoute.isPending}>
          {createRoute.isPending ? 'Создание...' : 'Создать рейс'}
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="outline">Отмена</Button>
        </DialogClose>
      </div>
    </form>
  );
};

export default RouteForm;