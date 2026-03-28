export interface MaintenanceRecord {
  id: string;
  date: string;
  comment: string;
}

export interface FireAlarmObject {
  id: string;
  customer: string;
  name: string;
  address: string;
  status: 'normal' | 'warning' | 'alarm' | 'maintenance';
  history: MaintenanceRecord[];
  contract?: string;
  notes?: string;
}
