
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types";

interface ProjectStatusProps {
  projects: Project[];
  onProjectSelect: (projectId: string) => void;
}

export const ProjectStatus: FC<ProjectStatusProps> = ({ projects, onProjectSelect }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Estado Actual de Proyectos</CardTitle>
        <CardDescription>Comparación entre avance real y proyectado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map(project => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Avance Real:</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-solenium-blue" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Avance Proyectado:</span>
                    <span className="font-medium">{project.projectedProgress || project.progress + 10}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400" 
                      style={{ width: `${project.projectedProgress || project.progress + 10}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Desviación:</span>
                    <span className={`font-medium ${project.progress >= (project.projectedProgress || project.progress + 10) ? 'text-green-600' : 'text-red-600'}`}>
                      {project.progress >= (project.projectedProgress || project.progress + 10) ? '+' : ''}
                      {project.progress - (project.projectedProgress || project.progress + 10)}%
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-solenium-blue hover:bg-blue-600"
                  onClick={() => onProjectSelect(project.id)}
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

