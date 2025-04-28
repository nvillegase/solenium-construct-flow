
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WorkQuantityCatalog } from "@/lib/types";

interface WorkQuantityComboboxProps {
  items: WorkQuantityCatalog[];
  value?: string;
  onSelect: (item: WorkQuantityCatalog) => void;
  isLoading?: boolean;
}

export const WorkQuantityCombobox = ({
  items,
  value,
  onSelect,
  isLoading = false,
}: WorkQuantityComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const selectedItem = items && items.length > 0 ? items.find(item => item.id === value) : undefined;

  // Default to empty array if items is undefined
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {isLoading
            ? "Cargando..."
            : value && selectedItem
            ? selectedItem.description
            : "Seleccionar cantidad de obra"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Buscar cantidad de obra..." />
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {safeItems.map((item) => (
              <CommandItem
                key={item.id}
                value={item.description}
                onSelect={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{item.description}</span>
                  <span className="text-xs text-muted-foreground">
                    Unidad: {item.unit}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
