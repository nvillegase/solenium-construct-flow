
import * as React from "react";
import Select from "react-select";
import { WorkQuantityCatalog } from "@/lib/types";

interface WorkQuantityComboboxProps {
  items: WorkQuantityCatalog[];
  value?: string;
  onSelect: (item: WorkQuantityCatalog) => void;
  isLoading?: boolean;
}

export const WorkQuantityCombobox = ({
  items = [],
  value,
  onSelect,
  isLoading = false,
}: WorkQuantityComboboxProps) => {
  // Ensure we have a valid array to work with
  const safeItems = items && Array.isArray(items) ? items : [];
  
  // Format items for react-select
  const options = safeItems.map((item) => ({
    value: item.id,
    label: item.description,
    unit: item.unit,
    data: item, // Store the full item data
  }));

  // Find the selected option
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
      placeholder="Seleccionar cantidad de obra"
      noOptionsMessage={() => "No se encontraron resultados"}
      loadingMessage={() => "Cargando..."}
      menuPortalTarget={document.body} // Render menu in a portal
      menuPosition="fixed" // Use fixed positioning
      styles={{
        menuPortal: (base) => ({ // Style the portal
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
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // Add shadow for better visibility
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
