import { INDIAN_STATES_UT } from '@/lib/indian-locations';

const selectClassName =
  'w-full min-w-0 min-h-[2.75rem] sm:min-h-[2.5rem] px-3 sm:px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-base sm:text-sm';

interface LocationStateFieldProps {
  stateId: string;
  onStateChange: (stateId: string) => void;
  label?: string;
  className?: string;
}

export function LocationStateField({
  stateId,
  onStateChange,
  label = 'State / Union Territory',
  className = '',
}: LocationStateFieldProps) {
  return (
    <div className={`min-w-0 w-full ${label ? 'space-y-2' : ''} ${className}`}>
      {label ? (
        <label className="text-sm font-medium text-foreground block">{label}</label>
      ) : null}
      <select
        value={stateId}
        onChange={(e) => onStateChange(e.target.value)}
        className={selectClassName}
      >
        {INDIAN_STATES_UT.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
