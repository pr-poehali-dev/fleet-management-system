import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/391df338-eff3-4e68-bf62-5d942dedd678', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка авторизации');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_role', data.user.role);
      localStorage.setItem('user_name', data.user.full_name);

      toast({
        title: 'Успешно',
        description: `Добро пожаловать, ${data.user.full_name}!`
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Неверный логин или пароль',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Icon name="Truck" className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">FleetPro</CardTitle>
          <CardDescription>Система управления автопарком</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-1">Тестовые учётные записи:</p>
            <p>Диспетчер: dispatcher / admin</p>
            <p>Водитель: driver1 / admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;