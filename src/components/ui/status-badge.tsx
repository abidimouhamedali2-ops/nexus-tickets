import { cn } from '@/lib/utils';
import { TicketStatus, TicketPriority } from '@/contexts/TicketContext';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'status-new' },
  under_review: { label: 'Under Review', className: 'status-review' },
  resolved: { label: 'Resolved', className: 'status-resolved' },
  closed: { label: 'Closed', className: 'status-closed' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  medium: { label: 'Medium', className: 'bg-blue-50 text-blue-600 border-blue-200' },
  high: { label: 'High', className: 'bg-orange-50 text-orange-600 border-orange-200' },
  critical: { label: 'Critical', className: 'bg-red-50 text-red-600 border-red-200' },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
