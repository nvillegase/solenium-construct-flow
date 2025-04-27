
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

interface ProjectProgressProps {
  timeSeriesData: any[];
}

export const ProjectProgress: FC<ProjectProgressProps> = ({ timeSeriesData }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Comparativa de Avance entre Proyectos</CardTitle>
        <CardDescription>Serie temporal de avance real vs. proyectado para todos los proyectos</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Avance (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line type="monotone" dataKey="p1Real" name="Vallenata Real" stroke="#2196F3" strokeWidth={2} />
              <Line type="monotone" dataKey="p1Proyectado" name="Vallenata Proyectado" stroke="#2196F3" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="p2Real" name="El Son Real" stroke="#FF9800" strokeWidth={2} />
              <Line type="monotone" dataKey="p2Proyectado" name="El Son Proyectado" stroke="#FF9800" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="p3Real" name="Puya Real" stroke="#4CAF50" strokeWidth={2} />
              <Line type="monotone" dataKey="p3Proyectado" name="Puya Proyectado" stroke="#4CAF50" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="p4Real" name="Mapalé Real" stroke="#9C27B0" strokeWidth={2} />
              <Line type="monotone" dataKey="p4Proyectado" name="Mapalé Proyectado" stroke="#9C27B0" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

