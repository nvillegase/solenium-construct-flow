
export type UserRole = 'Diseñador' | 'Suministro' | 'Almacenista' | 'Residente' | 'Supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  projectIds: string[]; // Projects assigned to the user
}

export interface Project {
  id: string;
  name: string;
  location: string;
  startDate: string;
  expectedEndDate: string;
  status: 'Planificación' | 'En Ejecución' | 'Pausado' | 'Completado' | 'Cancelado';
  progress: number;
}

export interface WorkQuantity {
  id: string;
  projectId: string; // Project association
  description: string;
  unit: string;
  quantity: number;
  expectedExecutionDate?: string; // New field for expected execution date
  materialIds?: string[]; // Materials required for this work quantity
}

export interface Material {
  id: string;
  projectId: string; // Project association
  name: string;
  unit: string;
  estimatedQuantity: number;
  receivedQuantity: number;
  usedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  projectId: string; // Project association
  projectName?: string; // Project name for display
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
  projectId: string; // Project association
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
  projectId: string; // Project association
  materialId: string;
  materialName: string;
  receivedBy: string;
  quantity: number;
  date: string;
}

export interface Activity {
  id: string;
  projectId: string; // Project association
  workQuantityId: string; // Related work quantity
  name: string;
  contractor: string;
  estimatedQuantity: number;
  executedQuantity: number;
  unit: string;
  date: string;
  expectedExecutionDate?: string; // From WorkQuantity
  notes?: string;
  progress: number;
  materialsRequired?: string[]; // IDs of required materials
}

export interface DailyExecution {
  id: string;
  projectId: string; // Project association
  activityId: string;
  activityName: string;
  executedQuantity: number;
  date: string;
  notes?: string;
  issueCategory?: IssueCategory; // New field for issue categorization
  issueOtherDescription?: string; // For "Other" category description
}

export type IssueCategory = 
  | 'Lluvia moderada' 
  | 'Tormenta' 
  | 'Falta de suministro' 
  | 'Vandalismo' 
  | 'Delincuencia organizada'
  | 'Paros o manifestaciones en las vías'
  | 'Falta de especificaciones técnicas en los diseños'
  | 'RTB incompleto'
  | 'Daño de maquinaria o herramienta'
  | 'Otros';
