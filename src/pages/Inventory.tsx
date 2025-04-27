
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMaterialReceptions, mockMaterialDeliveries } from "@/lib/mock-data";
import { MaterialReception, MaterialDelivery, Project } from "@/lib/types";
import MaterialReceptionForm from "@/components/inventory/MaterialReceptionForm";
import MaterialReceptionList from "@/components/inventory/MaterialReceptionList";
import MaterialDeliveryForm from "@/components/inventory/MaterialDeliveryForm";
import MaterialDeliveryList from "@/components/inventory/MaterialDeliveryList";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Inventory = () => {
  const [receptions, setReceptions] = useState<MaterialReception[]>(mockMaterialReceptions);
  const [deliveries, setDeliveries] = useState<MaterialDelivery[]>(mockMaterialDeliveries);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { user } = useAuth();
  const [loadingProjects, setLoadingProjects] = useState(false);

  const handleReceptionSubmit = (reception: MaterialReception) => {
    setReceptions([reception, ...receptions]);
  };

  const handleDeliverySubmit = (delivery: MaterialDelivery) => {
    setDeliveries([delivery, ...deliveries]);
  };

  const showProjectSelector = projects.length > 0 &&
    ["Almacenista", "Supervisor"].includes(user?.role || "");

  return (
    <AppLayout requiredRoles={["Almacenista", "Supervisor"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Inventario de Materiales</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {showProjectSelector && 
              <Select
                value={selectedProjectId || ""}
                onValueChange={(value) => setSelectedProjectId(value)}
                disabled={loadingProjects}
              >
                <SelectTrigger id="project-selector" className="w-full max-w-xs">
                  <SelectValue placeholder="Selecciona un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          </div>
        </div>
        
        <Tabs defaultValue="reception">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reception">Recepción de Materiales</TabsTrigger>
            <TabsTrigger value="delivery">Entrega de Materiales</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reception" className="space-y-6">
            <MaterialReceptionForm onSubmit={handleReceptionSubmit} />
            <MaterialReceptionList receptions={receptions} />
          </TabsContent>
          
          <TabsContent value="delivery" className="space-y-6">
            <MaterialDeliveryForm 
              onSubmit={handleDeliverySubmit}
              projects={projects}
              receptions={receptions}
              deliveries={deliveries}
            />
            <MaterialDeliveryList deliveries={deliveries} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Inventory;

