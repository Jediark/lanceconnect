import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "./drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  title?: string;
  variant?: "default" | "ghost";
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  triggerClassName,
  title = "Select option",
  variant = "default",
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const selectedOption = options.find((opt) => opt.value === value);

  const TriggerButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
    ({ className: btnClassName, ...props }, ref) => (
      <button
        ref={ref}
        type="button"
        className={cn(
          variant === "ghost"
            ? "flex w-full items-center justify-between bg-transparent text-sm text-foreground focus:outline-none cursor-pointer text-left py-2 px-0 border-none shadow-none hover:bg-transparent"
            : "flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-left",
          triggerClassName,
          btnClassName
        )}
        {...props}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
      </button>
    )
  );
  TriggerButton.displayName = "TriggerButton";

  const OptionsList = () => (
    <div className="flex flex-col gap-1">
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-3.5 py-3 text-sm text-left rounded-lg transition-all duration-200 cursor-pointer",
              isSelected
                ? "bg-primary text-primary-foreground font-bold"
                : "hover:bg-accent text-foreground"
            )}
          >
            <span className="truncate mr-2">{opt.label}</span>
            {isSelected && <Check className="h-4 w-4 shrink-0" />}
          </button>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <TriggerButton className={className} />
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] outline-none">
          <DrawerHeader className="border-b border-border/50 pb-3">
            <DrawerTitle className="text-center text-sm font-bold tracking-wide uppercase text-muted-foreground">
              {title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 py-4 pb-12">
            <OptionsList />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TriggerButton className={className} />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1 max-h-[300px] overflow-y-auto bg-card border-border shadow-xl rounded-xl z-50">
        <OptionsList />
      </PopoverContent>
    </Popover>
  );
}
