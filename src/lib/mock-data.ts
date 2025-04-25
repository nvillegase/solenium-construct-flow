
import { 
  User, WorkQuantity, Material, PurchaseOrder, 
  MaterialReception, MaterialDelivery, Activity, DailyExecution, Project
} from './types';

// Mock projects based on feedback
export const mockProjects: Project[] = [
  { 
    id: 'project-1', 
    name: 'Vallenata', 
    location: 'Cesar', 
    startDate: '2024-01-15', 
    expectedEndDate: '2024-06-30', 
    status: 'En Ejecución', 
    progress: 65 
  },
  { 
    id: 'project-2', 
    name: 'El Son', 
    location: 'Bolívar', 
    startDate: '2024-02-10', 
    expectedEndDate: '2024-07-15', 
    status: 'En Ejecución', 
    progress: 40 
  },
  { 
    id: 'project-3', 
    name: 'Puya', 
    location: 'Atlántico', 
    startDate: '2024-03-05', 
    expectedEndDate: '2024-08-20', 
    status: 'Planificación', 
    progress: 15 
  },
  { 
    id: 'project-4', 
    name: 'Mapalé', 
    location: 'Magdalena', 
    startDate: '2023-11-10', 
    expectedEndDate: '2024-05-30', 
    status: 'En Ejecución', 
    progress: 85 
  }
];

// Mock users with different roles and project assignments
export const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Ana Gómez', 
    email: 'ana@solenium.co', 
    role: 'Diseñador', 
    avatar: 'https://i.pravatar.cc/150?img=1',
    projectIds: ['project-1', 'project-2', 'project-3']
  },
  { 
    id: '2', 
    name: 'Carlos Ruiz', 
    email: 'carlos@solenium.co', 
    role: 'Suministro', 
    avatar: 'https://i.pravatar.cc/150?img=3',
    projectIds: ['project-1', 'project-2', 'project-3', 'project-4']
  },
  { 
    id: '3', 
    name: 'Elena Díaz', 
    email: 'elena@solenium.co', 
    role: 'Almacenista', 
    avatar: 'https://i.pravatar.cc/150?img=5',
    projectIds: ['project-1'] // Almacenista solo asignada a un proyecto
  },
  { 
    id: '4', 
    name: 'Miguel Torres', 
    email: 'miguel@solenium.co', 
    role: 'Residente', 
    avatar: 'https://i.pravatar.cc/150?img=7',
    projectIds: ['project-1', 'project-2'] // Residente puede estar en varios proyectos
  },
  { 
    id: '5', 
    name: 'Laura Sánchez', 
    email: 'laura@solenium.co', 
    role: 'Supervisor', 
    avatar: 'https://i.pravatar.cc/150?img=9',
    projectIds: ['project-1', 'project-2', 'project-3', 'project-4'] // Supervisor accede a todos
  },
];

// Mock contractors
export const mockContractors = [
  'CONSTRUYENDO',
  'ELECTROMONTES',
  'OSPINAS',
  'ELÉCTRICOS DEL CESAR'
];

// Work quantities for design section
export const mockWorkQuantities: WorkQuantity[] = [
  { id: '1', projectId: 'project-1', description: 'Excavación para cimentación', unit: 'm³', quantity: 85, expectedExecutionDate: '2024-05-15' },
  { id: '2', projectId: 'project-1', description: 'Montaje de estructura metálica', unit: 'kg', quantity: 2500, expectedExecutionDate: '2024-05-20' },
  { id: '3', projectId: 'project-1', description: 'Instalación de paneles solares', unit: 'unidad', quantity: 100, expectedExecutionDate: '2024-05-25', materialIds: ['1', '5'] },
  { id: '4', projectId: 'project-1', description: 'Cableado eléctrico', unit: 'm', quantity: 1200, expectedExecutionDate: '2024-05-22', materialIds: ['3'] },
  { id: '5', projectId: 'project-1', description: 'Instalación de inversores', unit: 'unidad', quantity: 5, expectedExecutionDate: '2024-06-01', materialIds: ['4'] },
  { id: '6', projectId: 'project-2', description: 'Excavación para cimentación', unit: 'm³', quantity: 65, expectedExecutionDate: '2024-06-10' },
  { id: '7', projectId: 'project-2', description: 'Montaje de estructura metálica', unit: 'kg', quantity: 2000, expectedExecutionDate: '2024-06-15' },
  { id: '8', projectId: 'project-3', description: 'Diseño de Layout', unit: 'global', quantity: 1, expectedExecutionDate: '2024-04-20' },
  { id: '9', projectId: 'project-4', description: 'Instalación de paneles solares', unit: 'unidad', quantity: 150, expectedExecutionDate: '2024-04-10' },
  { id: '10', projectId: 'project-4', description: 'Pruebas finales', unit: 'global', quantity: 1, expectedExecutionDate: '2024-05-15' },
];

// Materials for design and inventory sections
export const mockMaterials: Material[] = [
  { id: '1', projectId: 'project-1', name: 'Panel solar 450W', unit: 'unidad', estimatedQuantity: 100, receivedQuantity: 80, usedQuantity: 60 },
  { id: '2', projectId: 'project-1', name: 'Estructura de soporte', unit: 'kg', estimatedQuantity: 2500, receivedQuantity: 2000, usedQuantity: 1800 },
  { id: '3', projectId: 'project-1', name: 'Cable solar 6mm²', unit: 'm', estimatedQuantity: 1200, receivedQuantity: 1200, usedQuantity: 900 },
  { id: '4', projectId: 'project-1', name: 'Inversor 60kW', unit: 'unidad', estimatedQuantity: 5, receivedQuantity: 3, usedQuantity: 3 },
  { id: '5', projectId: 'project-1', name: 'Conectores MC4', unit: 'par', estimatedQuantity: 200, receivedQuantity: 200, usedQuantity: 150 },
  { id: '6', projectId: 'project-2', name: 'Panel solar 500W', unit: 'unidad', estimatedQuantity: 80, receivedQuantity: 60, usedQuantity: 40 },
  { id: '7', projectId: 'project-2', name: 'Estructura de soporte', unit: 'kg', estimatedQuantity: 2000, receivedQuantity: 1500, usedQuantity: 1200 },
  { id: '8', projectId: 'project-3', name: 'Kit de diseño', unit: 'unidad', estimatedQuantity: 1, receivedQuantity: 1, usedQuantity: 0 },
  { id: '9', projectId: 'project-4', name: 'Panel solar 450W', unit: 'unidad', estimatedQuantity: 150, receivedQuantity: 150, usedQuantity: 150 },
  { id: '10', projectId: 'project-4', name: 'Kit de pruebas', unit: 'unidad', estimatedQuantity: 3, receivedQuantity: 3, usedQuantity: 2 },
];

// Purchase orders for supply section
export const mockPurchaseOrders: PurchaseOrder[] = [
  { 
    id: '1', 
    projectId: 'project-1', // Primary project
    projectName: 'Vallenata', 
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
    projectId: 'project-1', 
    projectName: 'Vallenata',
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
    projectId: 'project-1', 
    projectName: 'Vallenata',
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
    projectId: 'project-1', 
    projectName: 'Vallenata',
    materials: [
      { id: '4-1', materialId: '4', materialName: 'Inversor 60kW', quantity: 5 }
    ],
    supplier: 'PowerInverters Co', 
    estimatedDeliveryDate: '2024-05-30', 
    status: 'En Tránsito', 
    createdAt: '2024-04-15' 
  },
  { 
    id: '5', 
    projectId: 'project-2', 
    projectName: 'El Son',
    materials: [
      { id: '5-1', materialId: '6', materialName: 'Panel solar 500W', quantity: 80 },
      { id: '5-2', materialId: '7', materialName: 'Estructura de soporte', quantity: 2000 }
    ],
    supplier: 'SolarTech Inc', 
    estimatedDeliveryDate: '2024-06-05', 
    actualDeliveryDate: '2024-06-02',
    status: 'Recibido Parcial', 
    createdAt: '2024-05-01' 
  },
  // Una orden con materiales para múltiples proyectos
  { 
    id: '6', 
    projectId: 'project-3', // Primary project for the order
    projectName: 'Múltiples Proyectos',
    materials: [
      { id: '6-1', materialId: '8', materialName: 'Kit de diseño', quantity: 1, projectId: 'project-3' },
      { id: '6-2', materialId: '10', materialName: 'Kit de pruebas', quantity: 3, projectId: 'project-4' },
    ],
    supplier: 'EquiposSolares SAS', 
    estimatedDeliveryDate: '2024-04-15', 
    actualDeliveryDate: '2024-04-14',
    status: 'Recibido Total', 
    createdAt: '2024-03-20' 
  },
];

// Material receptions for inventory section
export const mockMaterialReceptions: MaterialReception[] = [
  { 
    id: '1', 
    projectId: 'project-1',
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
    projectId: 'project-1',
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
    projectId: 'project-1',
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
    projectId: 'project-1',
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
    projectId: 'project-1',
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
    projectId: 'project-1',
    materialId: '1', 
    materialName: 'Panel solar 450W', 
    receivedBy: 'Miguel Torres', 
    quantity: 60, 
    date: '2024-05-20' 
  },
  { 
    id: '2', 
    projectId: 'project-1',
    materialId: '2', 
    materialName: 'Estructura de soporte', 
    receivedBy: 'Miguel Torres', 
    quantity: 1800, 
    date: '2024-05-12' 
  },
  { 
    id: '3', 
    projectId: 'project-1',
    materialId: '3', 
    materialName: 'Cable solar 6mm²', 
    receivedBy: 'Miguel Torres', 
    quantity: 900, 
    date: '2024-04-28' 
  },
  { 
    id: '4', 
    projectId: 'project-1',
    materialId: '4', 
    materialName: 'Inversor 60kW', 
    receivedBy: 'Miguel Torres', 
    quantity: 3, 
    date: '2024-05-26' 
  },
  { 
    id: '5', 
    projectId: 'project-1',
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
    projectId: 'project-1',
    workQuantityId: '1', 
    name: 'Excavación para cimentación', 
    contractor: 'CONSTRUYENDO', 
    estimatedQuantity: 85, 
    executedQuantity: 70, 
    unit: 'm³', 
    date: '2024-05-01', 
    progress: 82,
    expectedExecutionDate: '2024-05-15'
  },
  { 
    id: '2', 
    projectId: 'project-1',
    workQuantityId: '2',
    name: 'Montaje de estructura metálica', 
    contractor: 'OSPINAS', 
    estimatedQuantity: 2500, 
    executedQuantity: 1800, 
    unit: 'kg', 
    date: '2024-05-15', 
    progress: 72,
    expectedExecutionDate: '2024-05-20'
  },
  { 
    id: '3', 
    projectId: 'project-1',
    workQuantityId: '3',
    name: 'Instalación de paneles solares', 
    contractor: 'ELECTROMONTES', 
    estimatedQuantity: 100, 
    executedQuantity: 60, 
    unit: 'unidad', 
    date: '2024-05-25', 
    progress: 60,
    expectedExecutionDate: '2024-05-25'
  },
  { 
    id: '4', 
    projectId: 'project-1',
    workQuantityId: '4',
    name: 'Cableado eléctrico', 
    contractor: 'ELÉCTRICOS DEL CESAR', 
    estimatedQuantity: 1200, 
    executedQuantity: 900, 
    unit: 'm', 
    date: '2024-05-20', 
    progress: 75,
    expectedExecutionDate: '2024-05-22'
  },
  { 
    id: '5', 
    projectId: 'project-1',
    workQuantityId: '5',
    name: 'Instalación de inversores', 
    contractor: 'ELÉCTRICOS DEL CESAR', 
    estimatedQuantity: 5, 
    executedQuantity: 3, 
    unit: 'unidad', 
    date: '2024-06-01', 
    progress: 60,
    expectedExecutionDate: '2024-06-01'
  },
];

// Daily executions for construction section
export const mockDailyExecutions: DailyExecution[] = [
  { 
    id: '1',
    projectId: 'project-1',
    activityId: '1', 
    activityName: 'Excavación para cimentación', 
    executedQuantity: 20, 
    date: '2024-05-01', 
    notes: 'Terreno rocoso, avance más lento de lo esperado' 
  },
  { 
    id: '2', 
    projectId: 'project-1',
    activityId: '1', 
    activityName: 'Excavación para cimentación', 
    executedQuantity: 25, 
    date: '2024-05-02', 
    notes: 'Se incorporó maquinaria adicional',
    issueCategory: 'Daño de maquinaria o herramienta'
  },
  { 
    id: '3', 
    projectId: 'project-1',
    activityId: '1', 
    activityName: 'Excavación para cimentación', 
    executedQuantity: 25, 
    date: '2024-05-03', 
    notes: 'Finalización de la excavación principal' 
  },
  { 
    id: '4', 
    projectId: 'project-1',
    activityId: '2', 
    activityName: 'Montaje de estructura metálica', 
    executedQuantity: 600, 
    date: '2024-05-15', 
    notes: 'Inicio del montaje de estructuras' 
  },
  { 
    id: '5', 
    projectId: 'project-1',
    activityId: '2', 
    activityName: 'Montaje de estructura metálica', 
    executedQuantity: 650, 
    date: '2024-05-16', 
    notes: 'Avance según lo planeado' 
  },
  { 
    id: '6', 
    projectId: 'project-1',
    activityId: '2', 
    activityName: 'Montaje de estructura metálica', 
    executedQuantity: 550, 
    date: '2024-05-17', 
    notes: 'Retraso por condiciones climáticas',
    issueCategory: 'Lluvia moderada'
  },
  { 
    id: '7', 
    projectId: 'project-1',
    activityId: '3', 
    activityName: 'Instalación de paneles solares', 
    executedQuantity: 30, 
    date: '2024-05-25', 
    notes: 'Inicio de instalación de paneles',
    issueCategory: 'Falta de suministro'
  },
  { 
    id: '8', 
    projectId: 'project-1',
    activityId: '3', 
    activityName: 'Instalación de paneles solares', 
    executedQuantity: 30, 
    date: '2024-05-26', 
    notes: 'Continúa instalación según cronograma' 
  },
  { 
    id: '9', 
    projectId: 'project-1',
    activityId: '4', 
    activityName: 'Cableado eléctrico', 
    executedQuantity: 450, 
    date: '2024-05-20', 
    notes: 'Inicio de cableado troncal' 
  },
  { 
    id: '10', 
    projectId: 'project-1',
    activityId: '4', 
    activityName: 'Cableado eléctrico', 
    executedQuantity: 450, 
    date: '2024-05-21', 
    notes: 'Continuación del cableado',
    issueCategory: 'Vandalismo'
  },
  { 
    id: '11', 
    projectId: 'project-1',
    activityId: '5', 
    activityName: 'Instalación de inversores', 
    executedQuantity: 3, 
    date: '2024-06-01', 
    notes: 'Instalación de los primeros tres inversores',
    issueCategory: 'Otros',
    issueOtherDescription: 'Falta de insumos complementarios'
  },
];

// Daily planning for construction section
export const mockDailyPlanning = [
  {
    id: '1',
    projectId: 'project-1',
    date: '2024-05-01',
    activities: [
      {
        id: '1-1',
        activityId: '1',
        activityName: 'Excavación para cimentación',
        contractor: 'CONSTRUYENDO',
        quantity: 20,
        unit: 'm³',
        executed: true
      }
    ]
  },
  {
    id: '2',
    projectId: 'project-1',
    date: '2024-05-02',
    activities: [
      {
        id: '2-1',
        activityId: '1',
        activityName: 'Excavación para cimentación',
        contractor: 'CONSTRUYENDO',
        quantity: 25,
        unit: 'm³',
        executed: true
      }
    ]
  },
  {
    id: '3',
    projectId: 'project-1',
    date: '2024-05-03',
    activities: [
      {
        id: '3-1',
        activityId: '1',
        activityName: 'Excavación para cimentación',
        contractor: 'CONSTRUYENDO',
        quantity: 25,
        unit: 'm³',
        executed: true
      }
    ]
  },
  {
    id: '4',
    projectId: 'project-1',
    date: '2024-05-15',
    activities: [
      {
        id: '4-1',
        activityId: '2',
        activityName: 'Montaje de estructura metálica',
        contractor: 'OSPINAS',
        quantity: 600,
        unit: 'kg',
        executed: true
      }
    ]
  },
  {
    id: '5',
    projectId: 'project-1',
    date: '2024-05-16',
    activities: [
      {
        id: '5-1',
        activityId: '2',
        activityName: 'Montaje de estructura metálica',
        contractor: 'OSPINAS',
        quantity: 650,
        unit: 'kg',
        executed: true
      }
    ]
  },
  {
    id: '6',
    projectId: 'project-1',
    date: '2024-05-17',
    activities: [
      {
        id: '6-1',
        activityId: '2',
        activityName: 'Montaje de estructura metálica',
        contractor: 'OSPINAS',
        quantity: 550,
        unit: 'kg',
        executed: true
      }
    ]
  },
  {
    id: '7',
    projectId: 'project-1',
    date: '2024-05-25',
    activities: [
      {
        id: '7-1',
        activityId: '3',
        activityName: 'Instalación de paneles solares',
        contractor: 'ELECTROMONTES',
        quantity: 30,
        unit: 'unidad',
        executed: true
      }
    ]
  },
  {
    id: '8',
    projectId: 'project-1',
    date: '2024-05-26',
    activities: [
      {
        id: '8-1',
        activityId: '3',
        activityName: 'Instalación de paneles solares',
        contractor: 'ELECTROMONTES',
        quantity: 30,
        unit: 'unidad',
        executed: true
      }
    ]
  },
  {
    id: '9',
    projectId: 'project-1',
    date: '2024-05-27',
    activities: [
      {
        id: '9-1',
        activityId: '3',
        activityName: 'Instalación de paneles solares',
        contractor: 'ELECTROMONTES',
        quantity: 40,
        unit: 'unidad',
        executed: false
      }
    ]
  }
];

export const currentUser: User = mockUsers[4]; // Default to Supervisor role
