
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
        const { data, error } = await supabase
          .from('material_catalog')
          .select('id, name, unit');

        if (error) throw error;

        setItems(data);
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
