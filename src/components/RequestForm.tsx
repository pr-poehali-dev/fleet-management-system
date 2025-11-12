import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '@/components/ui/dialog';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    from_address: '',
    to_address: '',
    priority: 'medium',
    cargo_type: '',
    cargo_weight_kg: '',
    passengers_count: '',
    required_vehicle_type: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createRequest = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('https://functions.poehali.dev/afa79f4a-120a-4f80-9fc8-950ee685fd2c?entity=requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          cargo_weight_kg: data.cargo_weight_kg ? parseInt(data.cargo_weight_kg) : null,
          passengers_count: data.passengers_count ? parseInt(data.passengers_count) : null,
        })
      });
      if (!response.ok) throw new Error('Ошибка создания заявки');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({
        title: 'Успешно',
        description: 'Заявка создана'
      });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        from_address: '',
        to_address: '',
        priority: 'medium',
        cargo_type: '',
        cargo_weight_kg: '',
        passengers_count: '',
        required_vehicle_type: ''
      });
    },
    onError: () => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заявку',
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.from_address || !formData.to_address) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }
    createRequest.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="date">Дата *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="from">Откуда *</Label>
        <Input
          id="from"
          placeholder="Адрес отправки"
          value={formData.from_address}
          onChange={(e) => setFormData({ ...formData, from_address: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="to">Куда *</Label>
        <Input
          id="to"
          placeholder="Адрес доставки"
          value={formData.to_address}
          onChange={(e) => setFormData({ ...formData, to_address: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Приоритет</Label>
          <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Низкий</SelectItem>
              <SelectItem value="medium">Средний</SelectItem>
              <SelectItem value="high">Высокий</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle-type">Тип ТС</Label>
          <Select value={formData.required_vehicle_type} onValueChange={(v) => setFormData({ ...formData, required_vehicle_type: v })}>
            <SelectTrigger id="vehicle-type">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Грузовик">Грузовик</SelectItem>
              <SelectItem value="Фургон">Фургон</SelectItem>
              <SelectItem value="Микроавтобус">Микроавтобус</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cargo">Тип груза</Label>
        <Input
          id="cargo"
          placeholder="Например: строительные материалы"
          value={formData.cargo_type}
          onChange={(e) => setFormData({ ...formData, cargo_type: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Вес груза (кг)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="0"
            value={formData.cargo_weight_kg}
            onChange={(e) => setFormData({ ...formData, cargo_weight_kg: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passengers">Пассажиры</Label>
          <Input
            id="passengers"
            type="number"
            placeholder="0"
            value={formData.passengers_count}
            onChange={(e) => setFormData({ ...formData, passengers_count: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" disabled={createRequest.isPending}>
          {createRequest.isPending ? 'Создание...' : 'Создать заявку'}
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="outline">Отмена</Button>
        </DialogClose>
      </div>
    </form>
  );
};

export default RequestForm;