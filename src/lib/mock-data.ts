import { User, Project, WorkQuantity, Material, PurchaseOrder, MaterialReception, MaterialDelivery, Activity, DailyExecution, DailyProjection, Contractor, WorkQuantityCatalog } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alfredo Cabarcas',
    email: 'alfredo.cabarcas@solenium.com',
    role: 'Diseñador',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Alfredo',
    projectIds: ['project-1', 'project-2']
  },
  {
    id: 'user-2',
    name: 'Daniela Mendoza',
    email: 'daniela.mendoza@solenium.com',
    role: 'Suministro',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Daniela',
    projectIds: ['project-1']
  },
  {
    id: 'user-3',
    name: 'Carlos Vives',
    email: 'carlos.vives@solenium.com',
    role: 'Almacenista',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Carlos',
    projectIds: ['project-2']
  },
  {
    id: 'user-4',
    name: 'Shakira Isabel',
    email: 'shakira.isabel@solenium.com',
    role: 'Residente',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Shakira',
    projectIds: ['project-3']
  },
  {
    id: 'user-5',
    name: 'Juanes Esteban',
    email: 'juanes.esteban@solenium.com',
    role: 'Supervisor',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Juanes',
    projectIds: ['project-1', 'project-2', 'project-3', 'project-4']
  },
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Vallenata',
    location: 'Valledupar',
    startDate: '2024-01-01',
    expectedEndDate: '2024-12-31',
    status: 'En Ejecución',
    progress: 45,
    projectedProgress: 55,
  },
  {
    id: 'project-2',
    name: 'El Son',
    location: 'Santa Marta',
    startDate: '2024-02-01',
    expectedEndDate: '2024-11-30',
    status: 'En Ejecución',
    progress: 30,
    projectedProgress: 40,
  },
  {
    id: 'project-3',
    name: 'Puya',
    location: 'Barranquilla',
    startDate: '2024-03-01',
    expectedEndDate: '2024-10-31',
    status: 'En Ejecución',
    progress: 65,
    projectedProgress: 62,
  },
  {
    id: 'project-4',
    name: 'Mapalé',
    location: 'Cartagena',
    startDate: '2024-04-01',
    expectedEndDate: '2024-09-30',
    status: 'En Ejecución',
    progress: 85,
    projectedProgress: 88,
  },
];

export const mockWorkQuantities: WorkQuantity[] = [
  {
    id: 'wq-1',
    projectId: 'project-1',
    description: 'Excavación para cimientos',
    unit: 'm3',
    quantity: 150,
    expectedExecutionDate: '2024-05-10',
    materialIds: ['mat-1', 'mat-2'],
    catalogId: 'cat-1'
  },
  {
    id: 'wq-2',
    projectId: 'project-1',
    description: 'Construcción de muros de contención',
    unit: 'm2',
    quantity: 300,
    expectedExecutionDate: '2024-05-15',
    materialIds: ['mat-3', 'mat-4'],
    catalogId: 'cat-2'
  },
  {
    id: 'wq-3',
    projectId: 'project-2',
    description: 'Instalación de sistema eléctrico',
    unit: 'punto',
    quantity: 200,
    expectedExecutionDate: '2024-06-01',
    materialIds: ['mat-5', 'mat-6'],
    catalogId: 'cat-3'
  },
  {
    id: 'wq-4',
    projectId: 'project-3',
    description: 'Colocación de pisos',
    unit: 'm2',
    quantity: 400,
    expectedExecutionDate: '2024-06-15',
    materialIds: ['mat-7', 'mat-8'],
    catalogId: 'cat-4'
  },
  {
    id: 'wq-5',
    projectId: 'project-4',
    description: 'Instalación de paneles solares',
    unit: 'panel',
    quantity: 100,
    expectedExecutionDate: '2024-07-01',
    materialIds: ['mat-9', 'mat-10'],
    catalogId: 'cat-5'
  },
  {
    id: 'wq-6',
    projectId: 'project-1',
    description: 'Montaje de estructura metálica',
    unit: 'kg',
    quantity: 5000,
    expectedExecutionDate: '2024-05-20',
    materialIds: ['mat-11', 'mat-12'],
    catalogId: 'cat-6'
  },
  {
    id: 'wq-7',
    projectId: 'project-2',
    description: 'Construcción de cerramientos',
    unit: 'm2',
    quantity: 800,
    expectedExecutionDate: '2024-06-10',
    materialIds: ['mat-13', 'mat-14'],
    catalogId: 'cat-7'
  }
];

export const mockMaterials: Material[] = [
  {
    id: 'mat-1',
    projectId: 'project-1',
    name: 'Cemento Portland Tipo I',
    unit: 'tonelada',
    estimatedQuantity: 50,
    receivedQuantity: 45,
    usedQuantity: 30
  },
  {
    id: 'mat-2',
    projectId: 'project-1',
    name: 'Acero de refuerzo corrugado',
    unit: 'tonelada',
    estimatedQuantity: 30,
    receivedQuantity: 28,
    usedQuantity: 20
  },
  {
    id: 'mat-3',
    projectId: 'project-2',
    name: 'Bloque de concreto #4',
    unit: 'unidad',
    estimatedQuantity: 5000,
    receivedQuantity: 4800,
    usedQuantity: 4000
  },
  {
    id: 'mat-4',
    projectId: 'project-2',
    name: 'Mortero de pega',
    unit: 'saco',
    estimatedQuantity: 100,
    receivedQuantity: 95,
    usedQuantity: 80
  },
  {
    id: 'mat-5',
    projectId: 'project-3',
    name: 'Cable THHN #12',
    unit: 'metro',
    estimatedQuantity: 1000,
    receivedQuantity: 950,
    usedQuantity: 800
  },
  {
    id: 'mat-6',
    projectId: 'project-3',
    name: 'Tubería conduit PVC',
    unit: 'metro',
    estimatedQuantity: 500,
    receivedQuantity: 480,
    usedQuantity: 400
  },
  {
    id: 'mat-7',
    projectId: 'project-4',
    name: 'Cerámica 45x45',
    unit: 'm2',
    estimatedQuantity: 450,
    receivedQuantity: 430,
    usedQuantity: 350
  },
  {
    id: 'mat-8',
    projectId: 'project-4',
    name: 'Boquilla para cerámica',
    unit: 'saco',
    estimatedQuantity: 50,
    receivedQuantity: 48,
    usedQuantity: 40
  },
  {
    id: 'mat-9',
    projectId: 'project-4',
    name: 'Panel Solar 450W',
    unit: 'panel',
    estimatedQuantity: 110,
    receivedQuantity: 105,
    usedQuantity: 90
  },
  {
    id: 'mat-10',
    projectId: 'project-4',
    name: 'Inversor 5kW',
    unit: 'unidad',
    estimatedQuantity: 10,
    receivedQuantity: 10,
    usedQuantity: 8
  },
  {
    id: 'mat-11',
    projectId: 'project-1',
    name: 'Perfiles metálicos IPE 200',
    unit: 'kg',
    estimatedQuantity: 2500,
    receivedQuantity: 2000,
    usedQuantity: 1800
  },
  {
    id: 'mat-12',
    projectId: 'project-1',
    name: 'Pernos de anclaje',
    unit: 'und',
    estimatedQuantity: 500,
    receivedQuantity: 500,
    usedQuantity: 450
  },
  {
    id: 'mat-13',
    projectId: 'project-2',
    name: 'Lámina metálica',
    unit: 'm2',
    estimatedQuantity: 1000,
    receivedQuantity: 800,
    usedQuantity: 600
  },
  {
    id: 'mat-14',
    projectId: 'project-2',
    name: 'Pintura anticorrosiva',
    unit: 'galón',
    estimatedQuantity: 50,
    receivedQuantity: 40,
    usedQuantity: 35
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'order-1',
    projectIds: ['project-1'],
    materials: [
      { id: 'item-1', materialId: 'mat-1', materialName: 'Panel Solar 450W', quantity: 100, projectId: 'project-1' },
      { id: 'item-2', materialId: 'mat-2', materialName: 'Inversor 60kW', quantity: 2, projectId: 'project-2' }
    ],
    supplier: 'SolarTech',
    estimatedDeliveryDate: '2024-05-15',
    actualDeliveryDate: '2024-05-10',
    status: 'En Tránsito',
    createdAt: '2024-04-01',
  },
  {
    id: 'order-2',
    projectIds: ['project-2'],
    materials: [
      { id: 'item-3', materialId: 'mat-3', materialName: 'Cable de cobre #10', quantity: 500, projectId: 'project-3' },
      { id: 'item-4', materialId: 'mat-4', materialName: 'Interruptor termomagnético 20A', quantity: 100, projectId: 'project-4' }
    ],
    supplier: 'ElectriMax',
    estimatedDeliveryDate: '2024-05-20',
    actualDeliveryDate: null,
    status: 'Pendiente',
    createdAt: '2024-04-05',
  },
  {
    id: 'order-3',
    projectIds: ['project-3'],
    materials: [
      { id: 'item-5', materialId: 'mat-5', materialName: 'Tubería PVC 1/2"', quantity: 300, projectId: 'project-1' },
      { id: 'item-6', materialId: 'mat-6', materialName: 'Caja de registro 4x4', quantity: 150, projectId: 'project-2' }
    ],
    supplier: 'Construred',
    estimatedDeliveryDate: '2024-05-25',
    actualDeliveryDate: '2024-05-23',
    status: 'Recibido Total',
    createdAt: '2024-04-10',
  }
];

export const mockMaterialReceptions: MaterialReception[] = [
  {
    id: 'reception-1',
    projectId: 'project-1',
    orderId: 'order-1',
    materialId: 'mat-1',
    materialName: 'Panel Solar 450W',
    quantity: 50,
    status: 'Bueno',
    date: '2024-05-15',
    observation: 'Primera entrega de paneles solares'
  },
  {
    id: 'reception-2',
    projectId: 'project-2',
    orderId: 'order-1',
    materialId: 'mat-2',
    materialName: 'Inversor 60kW',
    quantity: 2,
    status: 'Bueno',
    date: '2024-05-15',
    observation: 'Entrega completa de inversores'
  },
  {
    id: 'reception-3',
    projectId: 'project-3',
    orderId: 'order-3',
    materialId: 'mat-5',
    materialName: 'Tubería PVC 1/2"',
    quantity: 300,
    status: 'Bueno',
    date: '2024-05-23',
    observation: 'Entrega de tubería en perfecto estado'
  },
];

export const mockMaterialDeliveries: MaterialDelivery[] = [
  {
    id: 'delivery-1',
    projectId: 'project-1',
    materialId: 'mat-1',
    materialName: 'Cemento Portland Tipo I',
    receivedBy: 'Carlos Pérez',
    quantity: 10,
    date: '2024-05-16'
  },
  {
    id: 'delivery-2',
    projectId: 'project-2',
    materialId: 'mat-3',
    materialName: 'Bloque de concreto #4',
    receivedBy: 'Ana Gómez',
    quantity: 500,
    date: '2024-05-17'
  },
  {
    id: 'delivery-3',
    projectId: 'project-3',
    materialId: 'mat-5',
    materialName: 'Cable THHN #12',
    receivedBy: 'Luis Torres',
    quantity: 200,
    date: '2024-05-18'
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    projectId: 'project-1',
    workQuantityId: 'wq-1',
    name: 'Excavación para cimientos',
    contractorId: 'Excavaciones S.A.',
    estimatedQuantity: 150,
    executedQuantity: 120,
    unit: 'm3',
    date: '2024-05-15',
    expectedExecutionDate: '2024-05-20',
    progress: 80,
    materialsRequired: ['mat-1', 'mat-2']
  },
  {
    id: 'act-2',
    projectId: 'project-1',
    workQuantityId: 'wq-2',
    name: 'Construcción de muros de contención',
    contractorId: 'Construcciones Unidas',
    estimatedQuantity: 300,
    executedQuantity: 200,
    unit: 'm2',
    date: '2024-05-16',
    expectedExecutionDate: '2024-05-25',
    progress: 67,
    materialsRequired: ['mat-3', 'mat-4']
  },
  {
    id: 'act-3',
    projectId: 'project-2',
    workQuantityId: 'wq-3',
    name: 'Instalación de sistema eléctrico',
    contractorId: 'Electromontajes SAS',
    estimatedQuantity: 200,
    executedQuantity: 150,
    unit: 'punto',
    date: '2024-05-17',
    expectedExecutionDate: '2024-06-01',
    progress: 75,
    materialsRequired: ['mat-5', 'mat-6']
  },
  {
    id: 'act-4',
    projectId: 'project-3',
    workQuantityId: 'wq-4',
    name: 'Colocación de pisos',
    contractorId: 'Pisos y Acabados S.A.',
    estimatedQuantity: 400,
    executedQuantity: 300,
    unit: 'm2',
    date: '2024-05-18',
    expectedExecutionDate: '2024-06-15',
    progress: 75,
    materialsRequired: ['mat-7', 'mat-8']
  },
  {
    id: 'act-5',
    projectId: 'project-4',
    workQuantityId: 'wq-5',
    name: 'Instalación de paneles solares',
    contractorId: 'Sistemas Solares Ltda',
    estimatedQuantity: 100,
    executedQuantity: 80,
    unit: 'panel',
    date: '2024-05-19',
    expectedExecutionDate: '2024-07-01',
    progress: 80,
    materialsRequired: ['mat-9', 'mat-10']
  },
  {
    id: 'act-6',
    projectId: 'project-1',
    workQuantityId: 'wq-6',
    name: 'Montaje de estructura metálica',
    contractorId: 'Construyendo SAS',
    estimatedQuantity: 5000,
    executedQuantity: 3500,
    unit: 'kg',
    date: '2024-05-20',
    expectedExecutionDate: '2024-05-25',
    progress: 70,
    materialsRequired: ['mat-11', 'mat-12']
  },
  {
    id: 'act-7',
    projectId: 'project-2',
    workQuantityId: 'wq-7',
    name: 'Construcción de cerramientos',
    contractorId: 'OSPINAS',
    estimatedQuantity: 800,
    executedQuantity: 500,
    unit: 'm2',
    date: '2024-05-21',
    expectedExecutionDate: '2024-06-10',
    progress: 62.5,
    materialsRequired: ['mat-13', 'mat-14']
  }
];

export const mockDailyExecutions: DailyExecution[] = [
  {
    id: 'exec-1',
    projectId: 'project-1',
    activityId: 'act-1',
    activityName: 'Excavación para cimientos',
    executedQuantity: 30,
    date: '2024-05-15',
    notes: 'Se avanzó según lo previsto',
    issueCategory: 'Lluvia moderada'
  },
  {
    id: 'exec-2',
    projectId: 'project-1',
    activityId: 'act-2',
    activityName: 'Construcción de muros de contención',
    executedQuantity: 20,
    date: '2024-05-16',
    notes: 'Retraso por falta de materiales',
    issueCategory: 'Falta de suministro'
  },
  {
    id: 'exec-3',
    projectId: 'project-2',
    activityId: 'act-3',
    activityName: 'Instalación de sistema eléctrico',
    executedQuantity: 25,
    date: '2024-05-17',
    notes: 'Personal adicional para acelerar la instalación',
    issueCategory: 'Otros',
    issueOtherDescription: 'Falta de herramienta especializada'
  },
  {
    id: 'exec-4',
    projectId: 'project-3',
    activityId: 'act-4',
    activityName: 'Colocación de pisos',
    executedQuantity: 40,
    date: '2024-05-18',
    notes: 'Se completó el área de la cocina',
    issueCategory: 'RTB incompleto'
  },
  {
    id: 'exec-5',
    projectId: 'project-4',
    activityId: 'act-5',
    activityName: 'Instalación de paneles solares',
    executedQuantity: 15,
    date: '2024-05-19',
    notes: 'Se instalaron los paneles en el techo',
    issueCategory: 'Sin novedad'
  },
  {
    id: 'exec-6',
    projectId: 'project-1',
    activityId: 'act-6',
    activityName: 'Montaje de estructura metálica',
    executedQuantity: 500,
    date: '2024-05-20',
    notes: 'Se completó el montaje del primer nivel',
    issueCategory: 'Lluvia moderada'
  },
  {
    id: 'exec-7',
    projectId: 'project-2',
    activityId: 'act-7',
    activityName: 'Construcción de cerramientos',
    executedQuantity: 100,
    date: '2024-05-21',
    notes: 'Retraso por falta de material',
    issueCategory: 'Falta de suministro'
  }
];

export const mockDailyProjections: DailyProjection[] = [
  {
    id: 'proj-1',
    projectId: 'project-1',
    date: '2024-04-25',
    activities: [
      {
        activityId: 'act-1',
        contractorId: 'CONSTRUYENDO',
        quantity: 50,
        unit: 'und'
      },
      {
        activityId: 'act-2',
        contractorId: 'ELECTROMONTES',
        quantity: 30,
        unit: 'm'
      }
    ],
    isExecutionComplete: false
  },
];

export const mockMaterialCatalog = [
  { id: 'cat-mat-1', name: 'Cemento Portland Tipo I', unit: 'tonelada' },
  { id: 'cat-mat-2', name: 'Acero de refuerzo corrugado', unit: 'tonelada' },
  { id: 'cat-mat-3', name: 'Bloque de concreto #4', unit: 'unidad' },
  { id: 'cat-mat-4', name: 'Mortero de pega', unit: 'saco' },
  { id: 'cat-mat-5', name: 'Cable THHN #12', unit: 'metro' },
  { id: 'cat-mat-6', name: 'Tubería conduit PVC', unit: 'metro' },
  { id: 'cat-mat-7', name: 'Cerámica 45x45', unit: 'm2' },
  { id: 'cat-mat-8', name: 'Boquilla para cerámica', unit: 'saco' },
  { id: 'cat-mat-9', name: 'Panel Solar 450W', unit: 'panel' },
  { id: 'cat-mat-10', name: 'Inversor 5kW', unit: 'unidad' },
  { id: 'cat-mat-11', name: 'Perfiles metálicos IPE 200', unit: 'kg' },
  { id: 'cat-mat-12', name: 'Pernos de anclaje', unit: 'und' },
  { id: 'cat-mat-13', name: 'Lámina metálica', unit: 'm2' },
  { id: 'cat-mat-14', name: 'Pintura anticorrosiva', unit: 'galón' }
];

export const mockWorkQuantityCatalog: WorkQuantityCatalog[] = [
  { id: 'cat-1', description: 'Excavación para cimientos', unit: 'm3', category: 'Movimiento de tierras' },
  { id: 'cat-2', description: 'Construcción de muros de contención', unit: 'm2', category: 'Estructura' },
  { id: 'cat-3', description: 'Instalación de sistema eléctrico', unit: 'punto', category: 'Instalaciones' },
  { id: 'cat-4', description: 'Colocación de pisos', unit: 'm2', category: 'Acabados' },
  { id: 'cat-5', description: 'Instalación de paneles solares', unit: 'panel', category: 'Instalaciones' },
  { id: 'cat-6', description: 'Montaje de estructura metálica', unit: 'kg', category: 'Estructura' },
  { id: 'cat-7', description: 'Construcción de cerramientos', unit: 'm2', category: 'Estructura' }
];

export const mockContractors: Contractor[] = [
  {
    id: 'contractor-1',
    name: 'Excavaciones S.A.',
    contactPerson: 'Juan Pérez',
    contactEmail: 'juan@excavaciones.com',
    contactPhone: '+57 300 123 4567'
  },
  {
    id: 'contractor-2',
    name: 'Construcciones Unidas',
    contactPerson: 'María González',
    contactEmail: 'maria@construcciones.com',
    contactPhone: '+57 301 234 5678'
  },
  {
    id: 'contractor-3',
    name: 'Electromontajes SAS',
    contactPerson: 'Carlos Rodríguez',
    contactEmail: 'carlos@electromontajes.com',
    contactPhone: '+57 302 345 6789'
  },
  {
    id: 'contractor-4',
    name: 'Pisos y Acabados S.A.',
    contactPerson: 'Ana López',
    contactEmail: 'ana@pisos.com',
    contactPhone: '+57 303 456 7890'
  },
  {
    id: 'contractor-5',
    name: 'Sistemas Solares Ltda',
    contactPerson: 'Luis Torres',
    contactEmail: 'luis@sistemassolares.com',
    contactPhone: '+57 304 567 8901'
  },
  {
    id: 'contractor-6',
    name: 'Construyendo SAS',
    contactPerson: 'Patricia Vega',
    contactEmail: 'patricia@construyendo.com',
    contactPhone: '+57 305 678 9012'
  },
  {
    id: 'contractor-7',
    name: 'OSPINAS',
    contactPerson: 'Roberto Ospina',
    contactEmail: 'roberto@ospinas.com',
    contactPhone: '+57 306 789 0123'
  }
];

export const mockActivityMaterials = [
  { activityId: 'act-1', projectMaterialId: 'mat-1', materialName: 'Cemento Portland Tipo I', quantity: 20, unit: 'tonelada' },
  { activityId: 'act-1', projectMaterialId: 'mat-2', materialName: 'Acero de refuerzo corrugado', quantity: 15, unit: 'tonelada' },
  { activityId: 'act-2', projectMaterialId: 'mat-3', materialName: 'Bloque de concreto #4', quantity: 2000, unit: 'unidad' },
  { activityId: 'act-2', projectMaterialId: 'mat-4', materialName: 'Mortero de pega', quantity: 40, unit: 'saco' },
  { activityId: 'act-3', projectMaterialId: 'mat-5', materialName: 'Cable THHN #12', quantity: 500, unit: 'metro' },
  { activityId: 'act-3', projectMaterialId: 'mat-6', materialName: 'Tubería conduit PVC', quantity: 250, unit: 'metro' },
  { activityId: 'act-4', projectMaterialId: 'mat-7', materialName: 'Cerámica 45x45', quantity: 350, unit: 'm2' },
  { activityId: 'act-4', projectMaterialId: 'mat-8', materialName: 'Boquilla para cerámica', quantity: 35, unit: 'saco' },
  { activityId: 'act-5', projectMaterialId: 'mat-9', materialName: 'Panel Solar 450W', quantity: 90, unit: 'panel' },
  { activityId: 'act-5', projectMaterialId: 'mat-10', materialName: 'Inversor 5kW', quantity: 8, unit: 'unidad' },
  { activityId: 'act-6', projectMaterialId: 'mat-11', materialName: 'Perfiles metálicos IPE 200', quantity: 2000, unit: 'kg' },
  { activityId: 'act-6', projectMaterialId: 'mat-12', materialName: 'Pernos de anclaje', quantity: 400, unit: 'und' },
  { activityId: 'act-7', projectMaterialId: 'mat-13', materialName: 'Lámina metálica', quantity: 600, unit: 'm2' },
  { activityId: 'act-7', projectMaterialId: 'mat-14', materialName: 'Pintura anticorrosiva', unit: 'galón' }
];

export const mockWorkQuantityMaterials = [
  { workQuantityId: 'wq-1', materialIds: ['mat-1', 'mat-2'] },
  { workQuantityId: 'wq-2', materialIds: ['mat-3', 'mat-4'] },
  { workQuantityId: 'wq-3', materialIds: ['mat-5', 'mat-6'] },
  { workQuantityId: 'wq-4', materialIds: ['mat-7', 'mat-8'] },
  { workQuantityId: 'wq-5', materialIds: ['mat-9', 'mat-10'] },
  { workQuantityId: 'wq-6', materialIds: ['mat-11', 'mat-12'] },
  { workQuantityId: 'wq-7', materialIds: ['mat-13', 'mat-14'] }
];

export const mockDailyProjectionData = [
  {
    id: 'daily-proj-1',
    projectId: 'project-1',
    date: '2024-12-25',
    activities: [
      { activityId: 'act-1', contractorId: 'contractor-1', quantity: 25, unit: 'm3', name: 'Excavación para cimientos', contractorName: 'Excavaciones S.A.' },
      { activityId: 'act-2', contractorId: 'contractor-2', quantity: 50, unit: 'm2', name: 'Construcción de muros de contención', contractorName: 'Construcciones Unidas' }
    ],
    isExecutionComplete: false
  },
  {
    id: 'daily-proj-2',
    projectId: 'project-2',
    date: '2024-12-25',
    activities: [
      { activityId: 'act-3', contractorId: 'contractor-3', quantity: 30, unit: 'punto', name: 'Instalación de sistema eléctrico', contractorName: 'Electromontajes SAS' }
    ],
    isExecutionComplete: false
  }
];

export const mockDailyExecutionData = [
  {
    id: 'daily-exec-1',
    projectId: 'project-1',
    activityId: 'act-1',
    activityName: 'Excavación para cimientos',
    executedQuantity: 20,
    date: '2024-12-25',
    notes: 'Avance según lo programado',
    issueCategory: 'Sin novedad' as const
  }
];
