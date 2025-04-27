
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialDelivery } from "@/lib/types";

interface MaterialDeliveryListProps {
  deliveries: MaterialDelivery[];
}

const MaterialDeliveryList = ({ deliveries }: MaterialDeliveryListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Entregas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="data-table">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Material</th>
                <th className="text-left p-2">Cantidad</th>
                <th className="text-left p-2">Entregado a</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(delivery => (
                <tr key={delivery.id} className="border-b">
                  <td className="p-2">{format(new Date(delivery.date), 'dd/MM/yyyy')}</td>
                  <td className="p-2">{delivery.materialName}</td>
                  <td className="p-2">{delivery.quantity}</td>
                  <td className="p-2">{delivery.receivedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialDeliveryList;

