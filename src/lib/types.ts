
export type UserRole = 'Diseñador' | 'Suministro' | 'Almacenista' | 'Residente' | 'Supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface WorkQuantity {
  id: string;
  description: string;
  unit: string;
  quantity: number;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  estimatedQuantity: number;
  receivedQuantity: number;
  usedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  materials: {
    id: string;
    materialId: string;
    materialName: string;
    quantity: number;
  }[];
  supplier: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'Pendiente' | 'En Tránsito' | 'Recibido Parcial' | 'Recibido Total';
  createdAt: string;
}

export interface MaterialReception {
  id: string;
  orderId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  status: 'Bueno' | 'Regular' | 'Defectuoso';
  date: string;
  observation: string;
}

export interface MaterialDelivery {
  id: string;
  materialId: string;
  materialName: string;
  receivedBy: string;
  quantity: number;
  date: string;
}

export interface Activity {
  id: string;
  name: string;
  contractor: string;
  estimatedQuantity: number;
  executedQuantity: number;
  unit: string;
  date: string;
  notes?: string;
  progress: number;
}

export interface DailyExecution {
  id: string;
  activityId: string;
  activityName: string;
  executedQuantity: number;
  date: string;
  notes?: string;
}
