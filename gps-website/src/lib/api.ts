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
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | undefined>;
};

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(SESSION_TOKEN_KEY) || window.sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function setStoredToken(token: string, remember = true): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (remember) {
    window.localStorage.setItem(SESSION_TOKEN_KEY, token);
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
  } else {
    window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
  }
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_TOKEN_KEY);
  window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
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

/* ========================
   NEW API FUNCTIONS
   ======================== */

type ApiOptions2 = ApiOptions & { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' };

async function apiRequest2<T>(action: string, options: ApiOptions2 = {}): Promise<T> {
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

/* Admin Users List */
export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: string;
  phone: string;
  devices: number;
  revenue: string;
  avatar: string;
  joinDate: string;
  lastLogin: string;
}

export interface PaginationInfo {
  page: number;
  perPage: number;
  totalUsers?: number;
  totalPages: number;
  totalDevices?: number;
  totalEvents?: number;
  totalEntries?: number;
}

export async function getAdminUsers(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  plan?: string;
}): Promise<{ users: AdminUserListItem[]; pagination: PaginationInfo }> {
  return apiRequest<{ success: boolean; users: AdminUserListItem[]; pagination: PaginationInfo }>('admin_users', {
    query: {
      page: params?.page,
      per_page: params?.perPage,
      search: params?.search || undefined,
      status: params?.status || undefined,
      plan: params?.plan || undefined,
    },
  });
}

/* Admin Devices */
export interface AdminDevice {
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
  owner: string;
  ownerEmail: string;
}

export async function getAdminDevices(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
}): Promise<{
  devices: AdminDevice[];
  stats: { total: number; active: number; idle: number; maintenance: number };
  pagination: PaginationInfo;
}> {
  return apiRequest<{
    success: boolean;
    devices: AdminDevice[];
    stats: { total: number; active: number; idle: number; maintenance: number };
    pagination: PaginationInfo;
  }>('admin_devices', {
    query: {
      page: params?.page,
      per_page: params?.perPage,
      search: params?.search || undefined,
      status: params?.status || undefined,
    },
  });
}

/* Vehicle CRUD */
export async function createVehicle(input: {
  name: string;
  driver?: string;
  type?: string;
  location?: string;
  lat?: number;
  lng?: number;
}): Promise<Vehicle[]> {
  const response = await apiRequest<{ success: boolean; vehicles: Vehicle[] }>('vehicle', {
    method: 'POST',
    body: input,
  });
  return response.vehicles;
}

export async function updateVehicle(id: string, input: {
  name?: string;
  driver?: string;
  type?: string;
  status?: string;
  location?: string;
}): Promise<Vehicle[]> {
  const response = await apiRequest2<{ success: boolean; vehicles: Vehicle[] }>('vehicle', {
    method: 'PUT',
    query: { id },
    body: input,
  });
  return response.vehicles;
}

export async function deleteVehicle(id: string): Promise<void> {
  await apiRequest2<{ success: boolean }>('vehicle', {
    method: 'DELETE',
    query: { id },
  });
}

/* Geofence Update/Delete */
export async function updateGeofence(id: string, input: {
  name?: string;
  type?: string;
  status?: string;
  radiusMeters?: number;
  color?: string;
  latitude?: number;
  longitude?: number;
}): Promise<Geofence[]> {
  const response = await apiRequest2<{ success: boolean; geofences: Geofence[] }>('geofence', {
    method: 'PUT',
    query: { id },
    body: input,
  });
  return response.geofences;
}

export async function deleteGeofence(id: string): Promise<Geofence[]> {
  const response = await apiRequest2<{ success: boolean; geofences: Geofence[] }>('geofence', {
    method: 'DELETE',
    query: { id },
  });
  return response.geofences;
}

/* Notification preferences */
export interface NotificationPreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  speedAlerts: boolean;
  geofenceAlerts: boolean;
  maintenanceAlerts: boolean;
  fuelAlerts: boolean;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await apiRequest<{ success: boolean; preferences: NotificationPreferences }>('preferences');
  return response.preferences;
}

export async function updateNotificationPreferences(prefs: NotificationPreferences): Promise<void> {
  await apiRequest<{ success: boolean }>('preferences', {
    method: 'PUT',
    body: prefs,
  });
}

/* Export report */
export function getExportReportUrl(reportId: string, format: string = 'csv'): string {
  const token = getStoredToken();
  const url = new URL(apiEndpoint, window.location.origin);
  url.searchParams.set('action', 'export_report');
  url.searchParams.set('id', reportId);
  url.searchParams.set('format', format);
  if (token) {
    url.searchParams.set('token', token);
  }
  return url.toString();
}

/* Audit log with pagination */
export async function getAdminAuditLogDataPaginated(params?: {
  page?: number;
  perPage?: number;
}): Promise<{
  summary: {
    totalEvents: number;
    criticalEvents: number;
    adminActions: number;
    systemEvents: number;
  };
  entries: AdminAuditEntry[];
  pagination: PaginationInfo;
}> {
  return apiRequest<{
    success: boolean;
    summary: {
      totalEvents: number;
      criticalEvents: number;
      adminActions: number;
      systemEvents: number;
    };
    entries: AdminAuditEntry[];
    pagination: PaginationInfo;
  }>('admin_audit_log', {
    query: {
      page: params?.page,
      per_page: params?.perPage,
    },
  });
}
