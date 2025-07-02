
import { useState, useEffect } from "react";
import { mockMaterialCatalog } from "@/lib/mock-data";
import { useToast } from "@/components/ui/use-toast";

export interface MaterialCatalog {
  id: string;
  name: string;
  unit: string;
}

export const useMaterialCatalog = () => {
  const [items, setItems] = useState<MaterialCatalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaterialCatalog = async () => {
      try {
        setIsLoading(true);
        // Simulate async loading
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setItems(mockMaterialCatalog);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el catálogo de materiales';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterialCatalog();
  }, [toast]);

  return { items, isLoading, error };
};
