
import { 
  User, WorkQuantity, Material, PurchaseOrder, 
  MaterialReception, MaterialDelivery, Activity, DailyExecution 
} from './types';

// Mock users with different roles
export const mockUsers: User[] = [
  { id: '1', name: 'Ana Gómez', email: 'ana@solenium.co', role: 'Diseñador', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Carlos Ruiz', email: 'carlos@solenium.co', role: 'Suministro', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '3', name: 'Elena Díaz', email: 'elena@solenium.co', role: 'Almacenista', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '4', name: 'Miguel Torres', email: 'miguel@solenium.co', role: 'Residente', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '5', name: 'Laura Sánchez', email: 'laura@solenium.co', role: 'Supervisor', avatar: 'https://i.pravatar.cc/150?img=9' },
];

// Work quantities for design section
export const mockWorkQuantities: WorkQuantity[] = [
  { id: '1', description: 'Excavación para cimentación', unit: 'm³', quantity: 85 },
  { id: '2', description: 'Montaje de estructura metálica', unit: 'kg', quantity: 2500 },
  { id: '3', description: 'Instalación de paneles solares', unit: 'unidad', quantity: 100 },
  { id: '4', description: 'Cableado eléctrico', unit: 'm', quantity: 1200 },
  { id: '5', description: 'Instalación de inversores', unit: 'unidad', quantity: 5 },
];

// Materials for design and inventory sections
export const mockMaterials: Material[] = [
  { id: '1', name: 'Panel solar 450W', unit: 'unidad', estimatedQuantity: 100, receivedQuantity: 80, usedQuantity: 60 },
  { id: '2', name: 'Estructura de soporte', unit: 'kg', estimatedQuantity: 2500, receivedQuantity: 2000, usedQuantity: 1800 },
  { id: '3', name: 'Cable solar 6mm²', unit: 'm', estimatedQuantity: 1200, receivedQuantity: 1200, usedQuantity: 900 },
  { id: '4', name: 'Inversor 60kW', unit: 'unidad', estimatedQuantity: 5, receivedQuantity: 3, usedQuantity: 3 },
  { id: '5', name: 'Conectores MC4', unit: 'par', estimatedQuantity: 200, receivedQuantity: 200, usedQuantity: 150 },
];

// Purchase orders for supply section
export const mockPurchaseOrders: PurchaseOrder[] = [
  { 
    id: '1', 
    materials: [
      { id: '1-1', materialId: '1', materialName: 'Panel solar 450W', quantity: 100 }
    ],
    supplier: 'SolarTech Inc', 
    estimatedDeliveryDate: '2024-05-15', 
    actualDeliveryDate: '2024-05-17',
    status: 'Recibido Total', 
    createdAt: '2024-04-01' 
  },
  { 
    id: '2', 
    materials: [
      { id: '2-1', materialId: '2', materialName: 'Estructura de soporte', quantity: 2500 }
    ],
    supplier: 'MetalWorks SA', 
    estimatedDeliveryDate: '2024-05-10', 
    actualDeliveryDate: '2024-05-10',
    status: 'Recibido Parcial', 
    createdAt: '2024-04-05' 
  },
  { 
    id: '3', 
    materials: [
      { id: '3-1', materialId: '3', materialName: 'Cable solar 6mm²', quantity: 1200 },
      { id: '3-2', materialId: '5', materialName: 'Conectores MC4', quantity: 200 }
    ],
    supplier: 'ElectroSolar Ltda', 
    estimatedDeliveryDate: '2024-04-25', 
    actualDeliveryDate: '2024-04-25',
    status: 'Recibido Total', 
    createdAt: '2024-04-10' 
  },
  { 
    id: '4', 
    materials: [
      { id: '4-1', materialId: '4', materialName: 'Inversor 60kW', quantity: 5 }
    ],
    supplier: 'PowerInverters Co', 
    estimatedDeliveryDate: '2024-05-30', 
    status: 'En Tránsito', 
    createdAt: '2024-04-15' 
  },
];

// Material receptions for inventory section
export const mockMaterialReceptions: MaterialReception[] = [
  { 
    id: '1', 
    orderId: '1', 
    materialId: '1', 
    materialName: 'Panel solar 450W', 
    quantity: 80, 
    status: 'Bueno', 
    date: '2024-05-17', 
    observation: 'Recepción parcial, 20 unidades pendientes por entrega' 
  },
  { 
    id: '2', 
    orderId: '2', 
    materialId: '2', 
    materialName: 'Estructura de soporte', 
    quantity: 2000, 
    status: 'Bueno', 
    date: '2024-05-10', 
    observation: 'Faltan 500kg por entregar' 
  },
  { 
    id: '3', 
    orderId: '3', 
    materialId: '3', 
    materialName: 'Cable solar 6mm²', 
    quantity: 1200, 
    status: 'Bueno', 
    date: '2024-04-25', 
    observation: 'Entrega completa' 
  },
  { 
    id: '4', 
    orderId: '3', 
    materialId: '5', 
    materialName: 'Conectores MC4', 
    quantity: 200, 
    status: 'Bueno', 
    date: '2024-04-25', 
    observation: 'Entrega completa' 
  },
  { 
    id: '5', 
    orderId: '4', 
    materialId: '4', 
    materialName: 'Inversor 60kW', 
    quantity: 3, 
    status: 'Regular', 
    date: '2024-05-25', 
    observation: 'Un inversor presenta abolladuras en la carcasa' 
  },
];

// Material deliveries for inventory section
export const mockMaterialDeliveries: MaterialDelivery[] = [
  { 
    id: '1', 
    materialId: '1', 
    materialName: 'Panel solar 450W', 
    receivedBy: 'Miguel Torres', 
    quantity: 60, 
    date: '2024-05-20' 
  },
  { 
    id: '2', 
    materialId: '2', 
    materialName: 'Estructura de soporte', 
    receivedBy: 'Miguel Torres', 
    quantity: 1800, 
    date: '2024-05-12' 
  },
  { 
    id: '3', 
    materialId: '3', 
    materialName: 'Cable solar 6mm²', 
    receivedBy: 'Miguel Torres', 
    quantity: 900, 
    date: '2024-04-28' 
  },
  { 
    id: '4', 
    materialId: '4', 
    materialName: 'Inversor 60kW', 
    receivedBy: 'Miguel Torres', 
    quantity: 3, 
    date: '2024-05-26' 
  },
  { 
    id: '5', 
    materialId: '5', 
    materialName: 'Conectores MC4', 
    receivedBy: 'Miguel Torres', 
    quantity: 150, 
    date: '2024-04-28' 
  },
];

// Activities for construction section
export const mockActivities: Activity[] = [
  { 
    id: '1', 
    name: 'Excavación para cimentación', 
    contractor: 'Constructora ABC', 
    estimatedQuantity: 85, 
    executedQuantity: 70, 
    unit: 'm³', 
    date: '2024-05-01', 
    progress: 82 
  },
  { 
    id: '2', 
    name: 'Montaje de estructura metálica', 
    contractor: 'Estructuras XYZ', 
    estimatedQuantity: 2500, 
    executedQuantity: 1800, 
    unit: 'kg', 
    date: '2024-05-15', 
    progress: 72 
  },
  { 
    id: '3', 
    name: 'Instalación de paneles solares', 
    contractor: 'SolarMount SA', 
    estimatedQuantity: 100, 
    executedQuantity: 60, 
    unit: 'unidad', 
    date: '2024-05-25', 
    progress: 60 
  },
  { 
    id: '4', 
    name: 'Cableado eléctrico', 
    contractor: 'ElectroCable Ltda', 
    estimatedQuantity: 1200, 
    executedQuantity: 900, 
    unit: 'm', 
    date: '2024-05-20', 
    progress: 75 
  },
  { 
    id: '5', 
    name: 'Instalación de inversores', 
    contractor: 'PowerSystems Co', 
    estimatedQuantity: 5, 
    executedQuantity: 3, 
    unit: 'unidad', 
    date: '2024-06-01', 
    progress: 60 
  },
];

// Daily executions for construction section
export const mockDailyExecutions: DailyExecution[] = [
  { 
    id: '1', 
    activityId: '1', 
    activityName: 'Excavación para cimentación', 
    executedQuantity: 20, 
    date: '2024-05-01', 
    notes: 'Terreno rocoso, avance más lento de lo esperado' 
  },
  { 
    id: '2', 
    activityId: '1', 
    activityName: 'Excavación para cimentación', 
    executedQuantity: 25, 
    date: '2024-05-02', 
    notes: 'Se incorporó maquinaria adicional' 
  },
  { 
    id: '3', 
    activityId: '1', 
    activityName: 'Excavación para cimentación', 
    executedQuantity: 25, 
    date: '2024-05-03', 
    notes: 'Finalización de la excavación principal' 
  },
  { 
    id: '4', 
    activityId: '2', 
    activityName: 'Montaje de estructura metálica', 
    executedQuantity: 600, 
    date: '2024-05-15', 
    notes: 'Inicio del montaje de estructuras' 
  },
  { 
    id: '5', 
    activityId: '2', 
    activityName: 'Montaje de estructura metálica', 
    executedQuantity: 650, 
    date: '2024-05-16', 
    notes: 'Avance según lo planeado' 
  },
  { 
    id: '6', 
    activityId: '2', 
    activityName: 'Montaje de estructura metálica', 
    executedQuantity: 550, 
    date: '2024-05-17', 
    notes: 'Retraso por condiciones climáticas' 
  },
  { 
    id: '7', 
    activityId: '3', 
    activityName: 'Instalación de paneles solares', 
    executedQuantity: 30, 
    date: '2024-05-25', 
    notes: 'Inicio de instalación de paneles' 
  },
  { 
    id: '8', 
    activityId: '3', 
    activityName: 'Instalación de paneles solares', 
    executedQuantity: 30, 
    date: '2024-05-26', 
    notes: 'Continúa instalación según cronograma' 
  },
  { 
    id: '9', 
    activityId: '4', 
    activityName: 'Cableado eléctrico', 
    executedQuantity: 450, 
    date: '2024-05-20', 
    notes: 'Inicio de cableado troncal' 
  },
  { 
    id: '10', 
    activityId: '4', 
    activityName: 'Cableado eléctrico', 
    executedQuantity: 450, 
    date: '2024-05-21', 
    notes: 'Continuación del cableado' 
  },
  { 
    id: '11', 
    activityId: '5', 
    activityName: 'Instalación de inversores', 
    executedQuantity: 3, 
    date: '2024-06-01', 
    notes: 'Instalación de los primeros tres inversores' 
  },
];

export const currentUser: User = mockUsers[4]; // Default to Supervisor role
