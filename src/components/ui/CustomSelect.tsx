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
              "w-full flex items-center justify-between px-3.5 py-3 text-sm text-left rounded-xl transition-all duration-200 cursor-pointer border border-transparent",
              isSelected
                ? "bg-blue-500/20 text-white border-blue-500/50 font-bold shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className="truncate mr-2">{opt.label}</span>
            {isSelected && <Check className="h-4 w-4 shrink-0 text-blue-400" />}
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
        <DrawerContent className="max-h-[85vh] outline-none bg-slate-950/80 backdrop-blur-xl border-t border-white/10 rounded-t-3xl text-white shadow-2xl">
          <DrawerHeader className="border-b border-white/5 pb-3">
            <DrawerTitle className="text-center text-xs font-bold tracking-widest uppercase text-slate-400">
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
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1.5 max-h-[300px] overflow-y-auto bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl z-50 text-white">
        <OptionsList />
      </PopoverContent>
    </Popover>
  );
}
