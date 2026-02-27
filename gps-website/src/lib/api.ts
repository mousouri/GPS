const configuredBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');
const apiBase = configuredBase && configuredBase.length > 0
  ? configuredBase
  : 'http://localhost/gps-website/backend';

const apiEndpoint = apiBase.endsWith('.php') ? apiBase : `${apiBase}/api.php`;

export const SESSION_TOKEN_KEY = 'crestech_session_token';

export interface ApiUser {
  id: string;
  numericId: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  company: string;
  plan: string;
  phone: string;
  timezone: string;
  status: string;
  joinDate: string;
  lastLoginAt: string | null;
}

export interface Vehicle {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance';
  speed: number;
  fuel: number;
  battery: number;
  driver: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
  lastPingAt: string;
}

export interface AlertItem {
  type: 'info' | 'warning' | 'danger';
  message: string;
  time: string;
}

export interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon' | 'rectangle';
  status: 'active' | 'inactive';
  alerts: number;
  radius: number;
  color: string;
  vehicles: number;
  lat: number;
  lng: number;
}

export interface ReportItem {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  status: 'ready' | 'generating';
  tripCount: number;
  distance: number;
  fuel: number;
  avgSpeed: number;
  activeHours: number;
}

export interface AdminRecentUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  devices: number;
  status: string;
  revenue: string;
  joinDate: string;
  avatar: string;
}

export interface AdminAuditEntry {
  id: number;
  admin: string;
  action: string;
  target: string;
  category: string;
  severity: string;
  timestamp: string;
  ip: string;
  details: string;
}

export interface AdminTransaction {
  id: string;
  customer: string;
  plan: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

export interface AdminUserDetail {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    plan: string;
    role: string;
    status: string;
    joinDate: string;
    lastLogin: string;
    avatar: string;
    devices: number;
    monthlySpend: string;
    totalSpent: string;
  };
  devices: Array<{
    id: string;
    name: string;
    vehicle: string;
    status: 'online' | 'offline';
    lastPing: string;
    battery: number;
  }>;
  activity: Array<{
    action: string;
    time: string;
    type: string;
    details: string;
  }>;
  invoices: Array<{
    id: string;
    date: string;
    amount: string;
    status: string;
  }>;
}

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | undefined>;
};

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(SESSION_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}

async function apiRequest<T>(action: string, options: ApiOptions = {}): Promise<T> {
  const url = new URL(apiEndpoint, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  url.searchParams.set('action', action);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const token = options.token ?? getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  let data: { error?: string } = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Request failed.');
  }

  return data as T;
}

type SessionResponse = {
  success: boolean;
  token: string;
  user: ApiUser;
};

export async function loginRequest(email: string, password: string, role: 'user' | 'admin'): Promise<SessionResponse> {
  return apiRequest<SessionResponse>('login', {
    method: 'POST',
    body: { email, password, role },
    token: null,
  });
}

export async function registerRequest(input: {
  name: string;
  email: string;
  password: string;
  company: string;
  plan: string;
}): Promise<SessionResponse> {
  return apiRequest<SessionResponse>('register', {
    method: 'POST',
    body: input,
    token: null,
  });
}

export async function getCurrentUser(): Promise<ApiUser> {
  const response = await apiRequest<{ success: boolean; user: ApiUser }>('me');
  return response.user;
}

export async function logoutRequest(): Promise<void> {
  await apiRequest<{ success: boolean }>('logout', {
    method: 'POST',
  });
}

export async function requestPasswordReset(email: string): Promise<{ message: string; debugResetToken?: string | null; resetLink?: string | null }> {
  const response = await apiRequest<{
    success: boolean;
    message: string;
    debugResetToken?: string | null;
    resetLink?: string | null;
  }>('forgot_password', {
    method: 'POST',
    body: { email },
    token: null,
  });

  return {
    message: response.message,
    debugResetToken: response.debugResetToken ?? null,
    resetLink: response.resetLink ?? null,
  };
}

export async function resetPasswordRequest(token: string, password: string): Promise<void> {
  await apiRequest<{ success: boolean }>('reset_password', {
    method: 'POST',
    body: { token, password },
    token: null,
  });
}

export async function getDashboardData(): Promise<{
  stats: {
    totalVehicles: number;
    activeVehicles: number;
    idleVehicles: number;
    maintenanceVehicles: number;
  };
  vehicles: Vehicle[];
  alerts: AlertItem[];
}> {
  const response = await apiRequest<{
    success: boolean;
    stats: {
      totalVehicles: number;
      activeVehicles: number;
      idleVehicles: number;
      maintenanceVehicles: number;
    };
    vehicles: Vehicle[];
    alerts: AlertItem[];
  }>('dashboard');

  return {
    stats: response.stats,
    vehicles: response.vehicles,
    alerts: response.alerts,
  };
}

export async function getVehicles(userId?: number): Promise<Vehicle[]> {
  const response = await apiRequest<{ success: boolean; vehicles: Vehicle[] }>('vehicles', {
    query: { user_id: userId },
  });
  return response.vehicles;
}

export async function getGeofences(): Promise<Geofence[]> {
  const response = await apiRequest<{ success: boolean; geofences: Geofence[] }>('geofences');
  return response.geofences;
}

export async function createGeofence(input: {
  name: string;
  type: 'circle' | 'polygon' | 'rectangle';
  radiusMeters: number;
  color: string;
  latitude: number;
  longitude: number;
}): Promise<Geofence[]> {
  const response = await apiRequest<{ success: boolean; geofences: Geofence[] }>('geofences', {
    method: 'POST',
    body: input,
  });
  return response.geofences;
}

export async function getReportsData(): Promise<{
  summary: {
    totalDistance: number;
    fuelUsed: number;
    avgSpeed: number;
    activeHours: number;
    totalTrips: number;
  };
  tripData: Array<{
    date: string;
    trips: number;
    distance: number;
    fuel: number;
    avgSpeed: number;
  }>;
  reports: ReportItem[];
}> {
  const response = await apiRequest<{
    success: boolean;
    summary: {
      totalDistance: number;
      fuelUsed: number;
      avgSpeed: number;
      activeHours: number;
      totalTrips: number;
    };
    tripData: Array<{
      date: string;
      trips: number;
      distance: number;
      fuel: number;
      avgSpeed: number;
    }>;
    reports: ReportItem[];
  }>('reports');

  return {
    summary: response.summary,
    tripData: response.tripData,
    reports: response.reports,
  };
}

export async function getAdminDashboardData(): Promise<{
  stats: {
    totalUsers: number;
    revenueMTD: string;
    activeDevices: number;
    newSignups: number;
  };
  recentUsers: AdminRecentUser[];
  systemHealth: Array<{ label: string; status: string; uptime: string }>;
  revenueData: Array<{ month: string; value: number }>;
}> {
  const response = await apiRequest<{
    success: boolean;
    stats: {
      totalUsers: number;
      revenueMTD: string;
      activeDevices: number;
      newSignups: number;
    };
    recentUsers: AdminRecentUser[];
    systemHealth: Array<{ label: string; status: string; uptime: string }>;
    revenueData: Array<{ month: string; value: number }>;
  }>('admin_dashboard');

  return response;
}

export async function getAdminBillingData(): Promise<{
  summary: {
    monthlyRevenue: string;
    activeSubscriptions: number;
    avgRevenuePerUser: string;
    failedPayments: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  planBreakdown: Array<{ plan: string; users: number; revenue: number; percent: number; color: string }>;
  transactions: AdminTransaction[];
}> {
  const response = await apiRequest<{
    success: boolean;
    summary: {
      monthlyRevenue: string;
      activeSubscriptions: number;
      avgRevenuePerUser: string;
      failedPayments: number;
    };
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    planBreakdown: Array<{ plan: string; users: number; revenue: number; percent: number; color: string }>;
    transactions: AdminTransaction[];
  }>('admin_billing');

  return response;
}

export async function getAdminAuditLogData(): Promise<{
  summary: {
    totalEvents: number;
    criticalEvents: number;
    adminActions: number;
    systemEvents: number;
  };
  entries: AdminAuditEntry[];
}> {
  const response = await apiRequest<{
    success: boolean;
    summary: {
      totalEvents: number;
      criticalEvents: number;
      adminActions: number;
      systemEvents: number;
    };
    entries: AdminAuditEntry[];
  }>('admin_audit_log');

  return response;
}

export async function getAdminUserData(identifier: string): Promise<AdminUserDetail> {
  const response = await apiRequest<{ success: boolean } & AdminUserDetail>('admin_user', {
    query: { id: identifier },
  });

  return {
    user: response.user,
    devices: response.devices,
    activity: response.activity,
    invoices: response.invoices,
  };
}

export async function updateAdminUserStatus(identifier: string, action: 'suspend' | 'reactivate'): Promise<AdminUserDetail> {
  const response = await apiRequest<{ success: boolean } & AdminUserDetail>('admin_user', {
    method: 'POST',
    query: { id: identifier },
    body: { action },
  });

  return {
    user: response.user,
    devices: response.devices,
    activity: response.activity,
    invoices: response.invoices,
  };
}

export async function getProfileData(): Promise<{
  user: ApiUser;
  preferences: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushAlerts: boolean;
    speedAlerts: boolean;
    geofenceAlerts: boolean;
    maintenanceAlerts: boolean;
    fuelAlerts: boolean;
  };
}> {
  const response = await apiRequest<{
    success: boolean;
    user: ApiUser;
    preferences: {
      emailAlerts: boolean;
      smsAlerts: boolean;
      pushAlerts: boolean;
      speedAlerts: boolean;
      geofenceAlerts: boolean;
      maintenanceAlerts: boolean;
      fuelAlerts: boolean;
    };
  }>('profile');

  return {
    user: response.user,
    preferences: response.preferences,
  };
}

export async function updateProfileRequest(input: {
  name: string;
  email: string;
  company: string;
  phone: string;
  timezone: string;
}): Promise<ApiUser> {
  const response = await apiRequest<{ success: boolean; user: ApiUser }>('profile', {
    method: 'PUT',
    body: input,
  });

  return response.user;
}

export async function changePasswordRequest(currentPassword: string, newPassword: string): Promise<void> {
  await apiRequest<{ success: boolean }>('profile', {
    method: 'POST',
    body: { currentPassword, newPassword },
  });
}

export function buildEmbeddedMapUrl(lat: number, lng: number): string {
  const padding = 0.35;
  const left = lng - padding;
  const right = lng + padding;
  const top = lat + padding;
  const bottom = lat - padding;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function buildOpenMapLink(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=10/${lat}/${lng}`;
}
