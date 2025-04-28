
import * as React from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MaterialCatalog {
  id: string;
  name: string;
  unit: string;
}

interface MaterialComboboxProps {
  value?: string;
  onSelect: (item: MaterialCatalog) => void;
  isLoading?: boolean;
}

export const MaterialCombobox = ({
  value,
  onSelect,
  isLoading: externalLoading = false,
}: MaterialComboboxProps) => {
  // Fetch material catalog from the database
  const { data: items = [], isLoading: queryLoading } = useQuery({
    queryKey: ['material-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_catalog')
        .select('id, name, unit');
        
      if (error) throw error;
      return data;
    }
  });
  
  const isLoading = externalLoading || queryLoading;
  
  const options = items.map((item) => ({
    value: item.id,
    label: item.name,
    unit: item.unit,
    data: item,
  }));

  const selectedOption = options.find(option => option.value === value);

  return (
    <Select
      value={selectedOption}
      onChange={(newValue: any) => {
        if (newValue) {
          onSelect(newValue.data);
        }
      }}
      options={options}
      isLoading={isLoading}
      placeholder="Seleccionar material"
      noOptionsMessage={() => "No se encontraron resultados"}
      loadingMessage={() => "Cargando..."}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
        control: (base) => ({
          ...base,
          backgroundColor: 'var(--background)',
          borderColor: 'var(--input)',
          '&:hover': {
            borderColor: 'var(--ring)',
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: 'var(--background)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected 
            ? 'var(--primary)' 
            : isFocused 
              ? 'var(--accent)' 
              : 'transparent',
          color: isSelected 
            ? 'var(--primary-foreground)' 
            : 'var(--foreground)',
          cursor: 'pointer',
          ':active': {
            backgroundColor: 'var(--accent)',
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: 'var(--foreground)',
        }),
        input: (base) => ({
          ...base,
          color: 'var(--foreground)',
        }),
      }}
      formatOptionLabel={({ label, unit }) => (
        <div>
          <div>{label}</div>
          <div className="text-sm text-muted-foreground">Unidad: {unit}</div>
        </div>
      )}
    />
  );
};
