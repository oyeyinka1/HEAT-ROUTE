export function ThermalLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-panel flex items-center gap-3 rounded-full px-4 py-2 ${className}`}>
      <span className="label-xs">Cooler</span>
      <span className="thermal-bar h-1.5 w-24 rounded-full sm:w-36" />
      <span className="label-xs">Hotter</span>
    </div>
  );
}
