const API_URL = 'https://functions.poehali.dev/afa79f4a-120a-4f80-9fc8-950ee685fd2c';

export const fetchVehicles = async () => {
  const response = await fetch(`${API_URL}?entity=vehicles`);
  return response.json();
};

export const fetchDrivers = async () => {
  const response = await fetch(`${API_URL}?entity=drivers`);
  return response.json();
};

export const fetchRequests = async () => {
  const response = await fetch(`${API_URL}?entity=requests`);
  return response.json();
};

export const fetchRoutes = async () => {
  const response = await fetch(`${API_URL}?entity=routes`);
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_URL}?entity=stats`);
  return response.json();
};

export const createRequest = async (data: {
  date: string;
  from_address: string;
  to_address: string;
  priority: string;
}) => {
  const response = await fetch(`${API_URL}?entity=requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const createRoute = async (data: {
  vehicle_number: string;
  driver_name: string;
  distance_km: number;
  fuel_liters: number;
}) => {
  const response = await fetch(`${API_URL}?entity=routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const createDriver = async (data: {
  name: string;
  license: string;
  vehicle_number?: string;
}) => {
  const response = await fetch(`${API_URL}?entity=drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
