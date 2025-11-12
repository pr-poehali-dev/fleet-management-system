import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import { fetchVehicles, fetchDrivers, fetchRequests, fetchRoutes, fetchStats } from '@/lib/api';
import RequestForm from '@/components/RequestForm';
import RouteForm from '@/components/RouteForm';

type Vehicle = {
  id: number;
  number: string;
  model: string;
  status: 'active' | 'maintenance' | 'idle';
};

type Driver = {
  id: number;
  name: string;
  license: string;
  vehicle_number: string | null;
  status: 'available' | 'on_route' | 'off_duty';
};

type Request = {
  id: number;
  date: string;
  from_address: string;
  to_address: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
};

type Route = {
  id: number;
  vehicle_number: string;
  driver_name: string;
  distance_km: number;
  fuel_liters: number;
  status: 'planned' | 'active' | 'completed';
};

type Stats = {
  active_vehicles: number;
  active_routes: number;
  pending_requests: number;
  total_fuel: number;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Пользователь';
  const userRole = localStorage.getItem('user_role') || 'driver';

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login');
  };
  
  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
  });

  const { data: requests = [] } = useQuery<Request[]>({
    queryKey: ['requests'],
    queryFn: fetchRequests,
  });

  const { data: routes = [] } = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: fetchRoutes,
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

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
            { id: 'dashboard', icon: 'LayoutDashboard', label: 'Дашборд', roles: ['dispatcher', 'driver'] },
            { id: 'requests', icon: 'FileText', label: 'Заявки', roles: ['dispatcher'] },
            { id: 'routes', icon: 'Route', label: 'Рейсы', roles: ['dispatcher'] },
            { id: 'drivers', icon: 'UserCircle', label: 'Водители', roles: ['dispatcher'] },
            { id: 'waybills', icon: 'FileCheck', label: 'Путевые листы', roles: ['dispatcher', 'driver'] },
            { id: 'reports', icon: 'BarChart3', label: 'Отчеты', roles: ['dispatcher'] },
          ].filter(item => item.roles.includes(userRole)).map((item) => (
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
        <div className="p-4 border-t border-sidebar-accent mt-auto">
          <div className="flex items-center gap-3 mb-3 p-2 bg-sidebar-accent/30 rounded-md">
            <Icon name="User" size={20} className="text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60">{userRole === 'dispatcher' ? 'Диспетчер' : 'Водитель'}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <Icon name="LogOut" size={16} className="mr-2" />
            Выход
          </Button>
        </div>
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
                    <div className="text-3xl font-bold">{stats?.active_vehicles || 0}</div>
                    <Icon name="Truck" size={32} className="text-primary opacity-20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">из {vehicles.length} транспортных средств</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Рейсы сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{stats?.active_routes || 0}</div>
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
                    <div className="text-3xl font-bold">{requests.length}</div>
                    <Icon name="FileText" size={32} className="text-primary opacity-20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{stats?.pending_requests || 0} ожидает утверждения</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Расход топлива</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{stats?.total_fuel || 0} л</div>
                    <Icon name="Fuel" size={32} className="text-primary opacity-20" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">активные рейсы</p>
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
                          <p className="font-medium">{route.vehicle_number}</p>
                          <p className="text-sm text-muted-foreground">{route.driver_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{route.distance_km} км</p>
                          <p className="text-xs text-muted-foreground">{route.fuel_liters} л</p>
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
                          <p className="text-xs text-muted-foreground">{driver.vehicle_number || '-'}</p>
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
                  <RequestForm />
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
                        <TableCell>{new Date(request.date).toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>{request.from_address}</TableCell>
                        <TableCell>{request.to_address}</TableCell>
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
                  <RouteForm />
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
                        <TableCell>{route.vehicle_number}</TableCell>
                        <TableCell>{route.driver_name}</TableCell>
                        <TableCell>{route.distance_km} км</TableCell>
                        <TableCell>{route.fuel_liters} л</TableCell>
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
                        <TableCell>{driver.vehicle_number || '-'}</TableCell>
                        <TableCell>{getStatusBadge(driver.status, 'driver')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'waybills' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Путевые листы</h2>
                <p className="text-muted-foreground">Управление путевыми листами</p>
              </div>
              {userRole === 'dispatcher' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Выписать путевой лист
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Создание путевого листа</DialogTitle>
                      <DialogDescription>Выберите транспорт и водителя</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Номер путевого листа</Label>
                        <Input placeholder="Будет сгенерирован автоматически" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wb-vehicle">Транспорт</Label>
                        <Select>
                          <SelectTrigger id="wb-vehicle">
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
                      <div className="space-y-2">
                        <Label htmlFor="wb-driver">Водитель</Label>
                        <Select>
                          <SelectTrigger id="wb-driver">
                            <SelectValue placeholder="Выберите водителя" />
                          </SelectTrigger>
                          <SelectContent>
                            {drivers.map((d) => (
                              <SelectItem key={d.id} value={d.name}>
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="wb-mileage">Пробег нач. (км)</Label>
                          <Input id="wb-mileage" type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wb-fuel">Топливо нач. (л)</Label>
                          <Input id="wb-fuel" type="number" placeholder="0" />
                        </div>
                      </div>
                      <Button className="w-full">Выписать путевой лист</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№ Путевого листа</TableHead>
                      <TableHead>Транспорт</TableHead>
                      <TableHead>Водитель</TableHead>
                      <TableHead>Дата выдачи</TableHead>
                      <TableHead>Пробег</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">ПЛ-20241112-001</TableCell>
                      <TableCell>А123БВ777</TableCell>
                      <TableCell>Иванов И.И.</TableCell>
                      <TableCell>12.11.2024</TableCell>
                      <TableCell>120 км</TableCell>
                      <TableCell><Badge>Выдан</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ПЛ-20241112-002</TableCell>
                      <TableCell>К456ЕР199</TableCell>
                      <TableCell>Петров П.П.</TableCell>
                      <TableCell>12.11.2024</TableCell>
                      <TableCell>85 км</TableCell>
                      <TableCell><Badge variant="outline">Закрыт</Badge></TableCell>
                    </TableRow>
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
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;