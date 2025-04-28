
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
  projectedProgress: number;
}

export interface WorkQuantity {
  id: string;
  projectId: string;
  description: string;
  unit: string;
  quantity: number;
  expectedExecutionDate?: string;
  materialIds?: string[];
  catalogId: string; // Required field for storing the selected catalog item id
}

export interface Material {
  id: string;
  projectId: string;
  name: string;
  unit: string;
  estimatedQuantity: number;
  receivedQuantity: number;
  usedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  projectIds: string[];
  projectNames?: string[];
  materials: {
    id: string;
    materialId: string;
    materialName: string;
    quantity: number;
    projectId: string;
  }[];
  supplier: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: 'Pendiente' | 'En Tránsito' | 'Recibido Parcial' | 'Recibido Total';
  createdAt: string;
}

export interface MaterialReception {
  id: string;
  projectId: string;
  orderId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  status: 'Bueno' | 'Regular' | 'Defectuoso';
  date: string;
  observation: string;
  photos?: string[];
}

export interface MaterialDelivery {
  id: string;
  projectId: string;
  materialId: string;
  materialName: string;
  receivedBy: string;
  quantity: number;
  date: string;
}

export interface Contractor {
  id: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Activity {
  id: string;
  projectId: string;
  workQuantityId: string;
  name: string;
  contractorId: string;
  contractorName?: string;
  estimatedQuantity: number;
  executedQuantity: number;
  unit: string;
  date: string;
  expectedExecutionDate?: string;
  notes?: string;
  progress: number;
  materialsRequired?: string[];
}

export interface DailyExecution {
  id: string;
  projectId: string;
  activityId: string;
  activityName: string;
  executedQuantity: number;
  date: string;
  notes?: string;
  issueCategory?: IssueCategory;
  issueOtherDescription?: string;
  photos?: string[]; // Added field for photos
}

export interface DailyProjection {
  id: string;
  projectId: string;
  date: string;
  activities: {
    activityId: string;
    contractorId: string;
    quantity: number;
    unit: string;
    name?: string;
    contractorName?: string;
  }[];
  isExecutionComplete: boolean;
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
  | 'Sin novedad'
  | 'Programación hincadora'
  | 'Otros';

export interface WorkQuantityCatalog {
  id: string;
  description: string;
  unit: string;
  category?: string;
}
