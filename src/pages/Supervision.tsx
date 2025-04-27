import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { mockActivities, mockMaterials, mockPurchaseOrders, mockDailyExecutions, mockProjects } from "@/lib/mock-data";
import { format, differenceInDays, parseISO } from "date-fns";
import { useProjectsProgress } from "@/hooks/useProjectsProgress";
import { useIssueCategories } from "@/hooks/useIssueCategories";
import { ProjectProgress } from "@/components/supervision/ProjectProgress";
import { IssueDistribution } from "@/components/supervision/IssueDistribution";
import { ProjectStatus } from "@/components/supervision/ProjectStatus";
import { ProjectDetails } from "@/components/supervision/ProjectDetails";

const actividadesEjemplo = [
  {
    nombre: "Cimentación",
    porcentajeAvance: 95,
    fechaComprometida: "2025-05-15",
    materiales: [
      {
        nombre: "Cemento",
        cantidadRequerida: 100,
        cantidadDisponible: 95,
        porcentajeAvance: 95,
        fechaComprometida: "2025-05-10"
      },
      {
        nombre: "Arena",
        cantidadRequerida: 50,
        cantidadDisponible: 45,
        porcentajeAvance: 90,
        fechaComprometida: "2025-05-12"
      }
    ]
  },
  {
    nombre: "Estructura metálica",
    porcentajeAvance: 45,
    fechaComprometida: "2025-04-20",
    materiales: [
      {
        nombre: "Vigas de acero",
        cantidadRequerida: 20,
        cantidadDisponible: 8,
        porcentajeAvance: 40,
        fechaComprometida: "2025-04-15"
      },
      {
        nombre: "Tornillería",
        cantidadRequerida: 1000,
        cantidadDisponible: 500,
        porcentajeAvance: 50,
        fechaComprometida: "2025-04-18"
      }
    ]
  },
  {
    nombre: "Cerramiento",
    porcentajeAvance: 95,
    fechaComprometida: "2025-05-15",
    materiales: [
      {
        nombre: "Cemento",
        cantidadRequerida: 100,
        cantidadDisponible: 95,
        porcentajeAvance: 95,
        fechaComprometida: "2025-05-10"
      },
      {
        nombre: "Arena",
        cantidadRequerida: 50,
        cantidadDisponible: 45,
        porcentajeAvance: 90,
        fechaComprometida: "2025-05-12"
      }
    ]
  },
];

const Supervision = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { timeSeriesData, projectsProgressData } = useProjectsProgress(mockProjects);
  const { processIssueCategoriesData } = useIssueCategories(mockDailyExecutions);
  
  const currentProject = selectedProject 
    ? mockProjects.find(p => p.id === selectedProject)
    : null;

  const getActivitiesProgressData = (project = mockProjects[0]) => {
    const projectActivities = mockActivities.filter(activity => activity.projectId === project.id);
    return projectActivities.map(activity => ({
      name: activity.name.length > 20 ? activity.name.substring(0, 20) + '...' : activity.name,
      estimado: activity.estimatedQuantity,
      ejecutado: activity.executedQuantity,
      porcentaje: activity.progress,
      delay: Math.random() > 0.6 ? Math.floor(Math.random() * 10) : 0
    }));
  };

  const getMaterialsData = (project = mockProjects[0]) => {
    const projectMaterials = mockMaterials.filter(material => material.projectId === project.id);
    return projectMaterials.map(material => ({
      name: material.name.length > 20 ? material.name.substring(0, 20) + '...' : material.name,
      recibido: material.receivedQuantity,
      usado: material.usedQuantity,
      enSitio: material.receivedQuantity - material.usedQuantity
    }));
  };

  const getDeliveryPerformanceData = (project = mockProjects[0]) => {
    return mockPurchaseOrders
      .filter(order => order.projectIds.includes(project.id))
      .filter(order => order.actualDeliveryDate)
      .map(order => {
        const estimatedDate = parseISO(order.estimatedDeliveryDate);
        const actualDate = parseISO(order.actualDeliveryDate!);
        const delay = differenceInDays(actualDate, estimatedDate);
        
        return {
          name: order.supplier.length > 15 ? order.supplier.substring(0, 15) + '...' : order.supplier,
          estimado: format(estimatedDate, 'dd/MM'),
          real: format(actualDate, 'dd/MM'),
          desviación: delay
        };
      });
  };

  const allProjectsIssueData = processIssueCategoriesData();

  return (
    <AppLayout requiredRoles={["Supervisor"]}>
      <div className="space-y-6">
        {!selectedProject ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Supervisión</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectProgress timeSeriesData={timeSeriesData} />
              <IssueDistribution issueData={allProjectsIssueData} />
            </div>
            <ProjectStatus 
              projects={mockProjects}
              onProjectSelect={setSelectedProject}
            />
          </>
        ) : (
          currentProject && (
            <ProjectDetails
              project={currentProject}
              onBack={() => setSelectedProject(null)}
              activitiesData={getActivitiesProgressData(currentProject)}
              materialsData={getMaterialsData(currentProject)}
              deliveryData={getDeliveryPerformanceData(currentProject)}
              actividadesEjemplo={actividadesEjemplo}
            />
          )
        )}
      </div>
    </AppLayout>
  );
};

export default Supervision;
