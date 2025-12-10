import { Ticket } from '@/contexts/TicketContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TicketQuickViewProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export function TicketQuickView({ ticket, onClose }: TicketQuickViewProps) {
  const { user } = useAuth();
  
  if (!ticket) return null;

  return (
    <div className={cn(
      'fixed right-0 top-0 h-full w-full max-w-md bg-card border-l shadow-xl z-50',
      'animate-slide-in-right'
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Quick View</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/tickets/${ticket.id}`}>
                <ExternalLink className="w-4 h-4 mr-1" />
                Full View
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Title & Status */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="font-semibold text-lg leading-tight">{ticket.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>

          {/* Meta info */}
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created by:</span>
              <span className="font-medium">{ticket.createdByName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium capitalize">{ticket.category.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h5 className="text-sm font-medium text-muted-foreground mb-2">Description</h5>
            <p className="text-sm leading-relaxed">{ticket.description}</p>
          </div>

          {/* Status History */}
          {ticket.statusHistory.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-3">Activity</h5>
              <div className="space-y-3">
                {ticket.statusHistory.slice(-3).map((change) => (
                  <div key={change.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <p>
                        <span className="font-medium">{change.changedBy}</span>
                        {' changed status to '}
                        <StatusBadge status={change.to} className="ml-1" />
                      </p>
                      {change.note && (
                        <p className="text-muted-foreground mt-0.5">{change.note}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(change.changedAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button asChild className="w-full">
            <Link to={`/tickets/${ticket.id}`}>
              View Full Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
