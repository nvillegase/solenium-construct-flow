
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialReception } from "@/lib/types";

interface MaterialReceptionListProps {
  receptions: MaterialReception[];
}

const MaterialReceptionList = ({ receptions }: MaterialReceptionListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Recepciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="data-table">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Material</th>
                <th className="text-left p-2">Cantidad</th>
                <th className="text-left p-2">Estado</th>
                <th className="text-left p-2">Orden</th>
                <th className="text-left p-2">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {receptions.map(reception => (
                <tr key={reception.id} className="border-b">
                  <td className="p-2">{format(new Date(reception.date), 'dd/MM/yyyy')}</td>
                  <td className="p-2">{reception.materialName}</td>
                  <td className="p-2">{reception.quantity}</td>
                  <td className="p-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      reception.status === "Bueno" ? "bg-green-100 text-green-800" :
                      reception.status === "Regular" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {reception.status}
                    </span>
                  </td>
                  <td className="p-2">#{reception.orderId.substring(0, 5)}</td>
                  <td className="p-2 max-w-xs truncate">{reception.observation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialReceptionList;

