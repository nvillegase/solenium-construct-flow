import { format, isAfter } from "date-fns";
import { AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface Material {
  nombre: string;
  cantidadRequerida: number;
  cantidadDisponible: number;
  porcentajeAvance: number;
  fechaComprometida: string;
}

interface Actividad {
  nombre: string;
  porcentajeAvance: number;
  fechaComprometida: string;
  materiales: Material[];
}

interface ShipmentProgressProps {
  activities: Actividad[];
}

const getProgressColor = (porcentaje: number) => {
  if (porcentaje > 90) return "bg-green-500";
  if (porcentaje >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const mostrarAlerta = (fechaComprometida: string, porcentaje: number) => {
  return isAfter(new Date(), new Date(fechaComprometida)) && porcentaje < 100;
};

const MaterialShipmentProgress = ({ activities }: ShipmentProgressProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 p-4">
      <Accordion type="single" collapsible className="space-y-2">
        {activities.map((actividad, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border rounded-lg p-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{actividad.nombre}</span>
                    {mostrarAlerta(actividad.fechaComprometida, actividad.porcentajeAvance) && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <Progress
                      value={actividad.porcentajeAvance}
                      className="h-2 bg-gray-200"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{actividad.porcentajeAvance}%</span>
                      <span>
                        Fecha: {format(new Date(actividad.fechaComprometida), "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-5 text-sm font-medium text-gray-500 pb-2">
                  <div>Material</div>
                  <div className="text-center">Requerido</div>
                  <div className="text-center">Disponible</div>
                  <div className="text-center">Avance</div>
                  <div className="text-center">Fecha</div>
                </div>
                {actividad.materiales.map((material, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-5 text-sm items-center py-2 border-t"
                  >
                    <div className="flex items-center gap-2">
                      {material.nombre}
                      {mostrarAlerta(material.fechaComprometida, material.porcentajeAvance) && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-center">{material.cantidadRequerida}</div>
                    <div className="text-center">{material.cantidadDisponible}</div>
                    <div className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          material.porcentajeAvance > 90
                            ? "bg-green-100 text-green-800"
                            : material.porcentajeAvance >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {material.porcentajeAvance}%
                      </span>
                    </div>
                    <div className="text-center">
                      {format(new Date(material.fechaComprometida), "dd/MM/yyyy")}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default MaterialShipmentProgress;