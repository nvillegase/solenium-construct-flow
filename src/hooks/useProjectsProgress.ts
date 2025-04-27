
import { Project } from "@/lib/types";

export const useProjectsProgress = (projects: Project[]) => {
  const getTimeSeriesData = () => [
    { date: '01/01', p1Real: 10, p1Proyectado: 15, p2Real: 5, p2Proyectado: 10, p3Real: 20, p3Proyectado: 18, p4Real: 30, p4Proyectado: 28 },
    { date: '01/15', p1Real: 20, p1Proyectado: 30, p2Real: 15, p2Proyectado: 20, p3Real: 35, p3Proyectado: 32, p4Real: 40, p4Proyectado: 42 },
    { date: '02/01', p1Real: 35, p1Proyectado: 45, p2Real: 22, p2Proyectado: 30, p3Real: 50, p3Proyectado: 48, p4Real: 50, p4Proyectado: 55 },
    { date: '02/15', p1Real: 45, p1Proyectado: 55, p2Real: 30, p2Proyectado: 40, p3Real: 65, p3Proyectado: 62, p4Real: 60, p4Proyectado: 68 },
    { date: '03/01', p1Real: 55, p1Proyectado: 65, p2Real: 35, p2Proyectado: 45, p3Real: 75, p3Proyectado: 74, p4Real: 70, p4Proyectado: 78 },
    { date: '03/15', p1Real: 65, p1Proyectado: 75, p2Real: 40, p2Proyectado: 50, p3Real: 85, p3Proyectado: 88, p4Real: 85, p4Proyectado: 88 },
  ];

  const getProjectsProgressData = () => projects.map(project => ({
    name: project.name,
    real: project.progress,
    proyectado: project.projectedProgress || project.progress + 10,
    desviacion: project.progress - (project.projectedProgress || project.progress + 10)
  }));

  return {
    timeSeriesData: getTimeSeriesData(),
    projectsProgressData: getProjectsProgressData()
  };
};

