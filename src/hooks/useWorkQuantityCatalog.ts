
import { useState, useEffect } from "react";
import { WorkQuantityCatalog } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useWorkQuantityCatalog = () => {
  const [catalog, setCatalog] = useState<WorkQuantityCatalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const { data, error } = await supabase
          .from('work_quantity_catalog')
          .select('*')
          .order('description');

        if (error) throw error;
        
        // Ensure we always set an array, even if data is null
        setCatalog(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching catalog:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el catálogo de cantidades de obra",
          variant: "destructive"
        });
        // Ensure we reset to an empty array on error
        setCatalog([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, [toast]);

  return { catalog, isLoading };
};
