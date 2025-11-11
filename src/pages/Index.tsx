import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type Vehicle = {
  id: string;
  number: string;
  model: string;
  status: 'active' | 'maintenance' | 'idle';
};

type Driver = {
  id: string;
  name: string;
  license: string;
  vehicle: string;
  status: 'available' | 'on_route' | 'off_duty';
};

type Request = {
  id: string;
  date: string;
  from: string;
  to: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
};

type Route = {
  id: string;
  vehicle: string;
  driver: string;
  distance: string;
  fuel: string;
  status: 'planned' | 'active' | 'completed';
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles] = useState<Vehicle[]>([
    { id: '1', number: 'А123БВ777', model: 'Mercedes Sprinter', status: 'active' },
    { id: '2', number: 'К456ЕР199', model: 'КАМАЗ 5320', status: 'maintenance' },
    { id: '3', number: 'Т789УС116', model: 'ГАЗель Next', status: 'active' },
    { id: '4', number: 'М321НО197', model: 'Iveco Daily', status: 'idle' },
  ]);

  const [drivers] = useState<Driver[]>([
    { id: '1', name: 'Иванов Иван Иванович', license: 'BC', vehicle: 'А123БВ777', status: 'on_route' },
    { id: '2', name: 'Петров Петр Петрович', license: 'BCE', vehicle: 'К456ЕР199', status: 'off_duty' },
    { id: '3', name: 'Сидоров Сергей Сергеевич', license: 'BC', vehicle: 'Т789УС116', status: 'on_route' },
    { id: '4', name: 'Козлов Андрей Владимирович', license: 'BC', vehicle: '-', status: 'available' },
  ]);

  const [requests] = useState<Request[]>([
    { id: '1', date: '11.11.2025', from: 'Москва, Тверская 10', to: 'Тула, Ленина 5', status: 'approved', priority: 'high' },
    { id: '2', date: '11.11.2025', from: 'СПб, Невский 25', to: 'Москва, Садовая 12', status: 'in_progress', priority: 'medium' },
    { id: '3', date: '12.11.2025', from: 'Казань, Баумана 3', to: 'Н.Новгород, Горького 8', status: 'pending', priority: 'low' },
    { id: '4', date: '12.11.2025', from: 'Екатеринбург, Ленина 20', to: 'Челябинск, Труда 15', status: 'approved', priority: 'high' },
  ]);

  const [routes] = useState<Route[]>([
    { id: '1', vehicle: 'А123БВ777', driver: 'Иванов И.И.', distance: '342 км', fuel: '48 л', status: 'active' },
    { id: '2', vehicle: 'Т789УС116', driver: 'Сидоров С.С.', distance: '125 км', fuel: '18 л', status: 'active' },
    { id: '3', vehicle: 'М321НО197', driver: 'Козлов А.В.', distance: '280 км', fuel: '38 л', status: 'planned' },
    { id: '4', vehicle: 'К456ЕР199', driver: 'Петров П.П.', distance: '520 км', fuel: '85 л', status: 'completed' },
  ]);

  const getStatusBadge = (status: string, type: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', text: string }> = {
      vehicle: {
        active: { variant: 'default', text: 'Активен' },
        maintenance: { variant: 'destructive', text: 'Ремонт' },
        idle: { variant: 'secondary', text: 'Простой' },
      },
      driver: {
        available: { variant: 'default', text: 'Доступен' },
        on_route: { variant: 'outline', text: 'В рейсе' },
        off_duty: { variant: 'secondary', text: 'Не на смене' },
      },
      request: {
        pending: { variant: 'secondary', text: 'Ожидает' },
        approved: { variant: 'default', text: 'Утверждена' },
        in_progress: { variant: 'outline', text: 'В работе' },
        completed: { variant: 'secondary', text: 'Завершена' },
      },
      route: {
        planned: { variant: 'secondary', text: 'Запланирован' },
        active: { variant: 'default', text: 'Активен' },
        completed: { variant: 'outline', text: 'Завершён' },
      },
      priority: {
        low: { variant: 'secondary', text: 'Низкий' },
        medium: { variant: 'outline', text: 'Средний' },
        high: { variant: 'destructive', text: 'Высокий' },
      },
    };

    const config = variants[type]?.[status];
    return config ? <Badge variant={config.variant}>{config.text}</Badge> : <Badge>{status}</Badge>;
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r">
        <div className="p-6 border-b border-sidebar-accent">
          <div className="flex items-center gap-2">
            <Icon name="Truck" size={28} className="text-primary" />
            <h1 className="text-xl font-bold">FleetPro</h1>
          </div>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Управление автопарком</p>
        </div>
        <nav className="p-4 space-y-1">
          {[
            { id: 'dashboard', icon: 'LayoutDashboard', label: 'Дашборд' },
            { id: 'requests', icon: 'FileText', label: 'Заявки' },
            { id: 'routes', icon: 'Route', label: 'Рейсы' },
            { id: 'drivers', icon: 'UserCircle', label: 'Водители' },
            { id: 'reports', icon: 'BarChart3', label: 'Отчеты' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                activeTab === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Дашборд</h2>
              <p className="text-muted-foreground">Обзор ключевых показателей автопарка</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Активные ТС</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">3</div>
                    <Icon name="Truck" size={32} className="text-primary opacity-20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">из 4 транспортных средств</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Рейсы сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">2</div>
                    <Icon name="Route" size={32} className="text-primary opacity-20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">в процессе выполнения</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Заявки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">4</div>
                    <Icon name="FileText" size={32} className="text-primary opacity-20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">1 ожидает утверждения</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Расход топлива</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">189 л</div>
                    <Icon name="Fuel" size={32} className="text-primary opacity-20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">за последние сутки</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Активные рейсы</CardTitle>
                  <CardDescription>Транспорт в пути</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {routes
                    .filter((r) => r.status === 'active')
                    .map((route) => (
                      <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{route.vehicle}</p>
                          <p className="text-sm text-muted-foreground">{route.driver}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{route.distance}</p>
                          <p className="text-xs text-muted-foreground">{route.fuel}</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Статус водителей</CardTitle>
                  <CardDescription>Текущая занятость</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {drivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="User" size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{driver.name}</p>
                          <p className="text-xs text-muted-foreground">{driver.vehicle}</p>
                        </div>
                      </div>
                      {getStatusBadge(driver.status, 'driver')}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Заявки</h2>
                <p className="text-muted-foreground">Управление заявками на перевозки</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Новая заявка
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Создание заявки</DialogTitle>
                    <DialogDescription>Заполните данные для новой заявки на перевозку</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Дата</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from">Откуда</Label>
                      <Input id="from" placeholder="Адрес отправления" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to">Куда</Label>
                      <Input id="to" placeholder="Адрес назначения" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Приоритет</Label>
                      <Select>
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Выберите приоритет" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкий</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="high">Высокий</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Создать заявку</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Откуда</TableHead>
                      <TableHead>Куда</TableHead>
                      <TableHead>Приоритет</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>{request.from}</TableCell>
                        <TableCell>{request.to}</TableCell>
                        <TableCell>{getStatusBadge(request.priority, 'priority')}</TableCell>
                        <TableCell>{getStatusBadge(request.status, 'request')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Рейсы</h2>
                <p className="text-muted-foreground">Планирование и учёт маршрутов</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Новый рейс
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Планирование рейса</DialogTitle>
                    <DialogDescription>Назначьте ТС и водителя для маршрута</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle">Транспортное средство</Label>
                      <Select>
                        <SelectTrigger id="vehicle">
                          <SelectValue placeholder="Выберите ТС" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.number} — {v.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driver">Водитель</Label>
                      <Select>
                        <SelectTrigger id="driver">
                          <SelectValue placeholder="Выберите водителя" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distance">Расстояние (км)</Label>
                      <Input id="distance" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuel">Топливо (л)</Label>
                      <Input id="fuel" type="number" placeholder="0" />
                    </div>
                    <Button className="w-full">Создать рейс</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№</TableHead>
                      <TableHead>Транспорт</TableHead>
                      <TableHead>Водитель</TableHead>
                      <TableHead>Расстояние</TableHead>
                      <TableHead>Топливо</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.id}</TableCell>
                        <TableCell>{route.vehicle}</TableCell>
                        <TableCell>{route.driver}</TableCell>
                        <TableCell>{route.distance}</TableCell>
                        <TableCell>{route.fuel}</TableCell>
                        <TableCell>{getStatusBadge(route.status, 'route')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Водители</h2>
                <p className="text-muted-foreground">Учёт персонала и закрепление ТС</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить водителя
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Новый водитель</DialogTitle>
                    <DialogDescription>Внесите данные водителя в систему</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">ФИО</Label>
                      <Input id="name" placeholder="Иванов Иван Иванович" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">Категория прав</Label>
                      <Select>
                        <SelectTrigger id="license">
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="BC">BC</SelectItem>
                          <SelectItem value="BCE">BCE</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="CE">CE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assigned-vehicle">Закрепленное ТС</Label>
                      <Select>
                        <SelectTrigger id="assigned-vehicle">
                          <SelectValue placeholder="Выберите ТС" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((v) => (
                            <SelectItem key={v.id} value={v.number}>
                              {v.number} — {v.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ФИО</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Закрепленное ТС</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.license}</TableCell>
                        <TableCell>{driver.vehicle}</TableCell>
                        <TableCell>{getStatusBadge(driver.status, 'driver')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Отчеты</h2>
              <p className="text-muted-foreground">Аналитика и показатели эффективности</p>
            </div>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Сводка</TabsTrigger>
                <TabsTrigger value="expenses">Расходы</TabsTrigger>
                <TabsTrigger value="efficiency">Эффективность</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Пробег за месяц</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12,480 км</div>
                      <p className="text-xs text-muted-foreground mt-1">+8% к предыдущему месяцу</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Выполнено рейсов</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87</div>
                      <p className="text-xs text-muted-foreground mt-1">средняя длина 143 км</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Коэффициент использования</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">82%</div>
                      <p className="text-xs text-muted-foreground mt-1">загрузка автопарка</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Статистика по транспорту</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ТС</TableHead>
                          <TableHead>Рейсов</TableHead>
                          <TableHead>Пробег</TableHead>
                          <TableHead>Топливо</TableHead>
                          <TableHead>Расход (л/100км)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">А123БВ777</TableCell>
                          <TableCell>24</TableCell>
                          <TableCell>3,420 км</TableCell>
                          <TableCell>512 л</TableCell>
                          <TableCell>15.0</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">К456ЕР199</TableCell>
                          <TableCell>18</TableCell>
                          <TableCell>4,230 км</TableCell>
                          <TableCell>1,185 л</TableCell>
                          <TableCell>28.0</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Т789УС116</TableCell>
                          <TableCell>28</TableCell>
                          <TableCell>2,890 км</TableCell>
                          <TableCell>347 л</TableCell>
                          <TableCell>12.0</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">М321НО197</TableCell>
                          <TableCell>17</TableCell>
                          <TableCell>1,940 км</TableCell>
                          <TableCell>291 л</TableCell>
                          <TableCell>15.0</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Топливо</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">142,680 ₽</div>
                      <p className="text-xs text-muted-foreground mt-1">2,335 л × 61.10 ₽/л</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Обслуживание</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">38,200 ₽</div>
                      <p className="text-xs text-muted-foreground mt-1">ТО и мелкий ремонт</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Страхование</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24,500 ₽</div>
                      <p className="text-xs text-muted-foreground mt-1">ОСАГО, КАСКО</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Итого за месяц</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">205,380 ₽</div>
                      <p className="text-xs text-muted-foreground mt-1">себестоимость 1 км: 16.46 ₽</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="efficiency" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>KPI автопарка</CardTitle>
                    <CardDescription>Ключевые показатели эффективности</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Коэффициент использования</span>
                        <span className="font-medium">82%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '82%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Выполнение заявок</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '94%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Средняя скорость обработки заявки</span>
                        <span className="font-medium">2.3 ч</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: '76%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Простои по ТО/ремонту</span>
                        <span className="font-medium">4.2%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="bg-destructive h-full" style={{ width: '4.2%' }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Рейтинг водителей</CardTitle>
                    <CardDescription>По количеству выполненных рейсов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Сидоров С.С.', routes: 28, distance: 2890 },
                        { name: 'Иванов И.И.', routes: 24, distance: 3420 },
                        { name: 'Петров П.П.', routes: 18, distance: 4230 },
                        { name: 'Козлов А.В.', routes: 17, distance: 1940 },
                      ].map((driver, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-xs text-muted-foreground">{driver.distance.toLocaleString()} км</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{driver.routes}</p>
                            <p className="text-xs text-muted-foreground">рейсов</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
