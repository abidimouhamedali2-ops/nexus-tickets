import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets, TicketStatus, Ticket } from '@/contexts/TicketContext';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Paperclip,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { getTicketById, updateTicketStatus } = useTickets();
  const { toast } = useToast();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<TicketStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const loadTicket = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const fetchedTicket = await getTicketById(id);
        setTicket(fetchedTicket);
        if (fetchedTicket) {
          setNewStatus(fetchedTicket.status);
        }
      } catch (error) {
        console.error('Failed to load ticket:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTicket();
  }, [id, getTicketById]);

  const handleStatusUpdate = async () => {
    if (!ticket || !newStatus || newStatus === ticket.status || !isAdmin) return;
    
    setIsUpdating(true);
    try {
      await updateTicketStatus(ticket.id, newStatus, statusNote || undefined);
      setUpdateSuccess(true);
      setStatusNote('');
      
      // Refresh ticket data
      const updatedTicket = await getTicketById(ticket.id);
      if (updatedTicket) {
        setTicket(updatedTicket);
        setNewStatus(updatedTicket.status);
      }
      
      toast({
        title: 'Status Updated',
        description: `Ticket status changed to ${newStatus.replace('_', ' ')}`,
      });
      setTimeout(() => setUpdateSuccess(false), 2000);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not update ticket status. You may not have permission.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="page-enter max-w-5xl mx-auto space-y-6">
          <SkeletonCard />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonCard />
            </div>
            <SkeletonCard />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!ticket) {
    return (
      <MainLayout>
        <div className="page-enter text-center py-12">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
          <p className="text-muted-foreground mb-4">The ticket you're looking for doesn't exist or you don't have access.</p>
          <Button asChild>
            <Link to="/tickets">Back to Tickets</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-enter max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-muted-foreground">#{ticket.id}</span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{ticket.title}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </CardContent>
            </Card>

            {/* Meta Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created By</p>
                    <p className="font-medium">{ticket.createdByName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="font-medium">{format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{ticket.category.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{format(new Date(ticket.updatedAt), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {ticket.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Attachments ({ticket.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ticket.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status History */}
            {ticket.statusHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ticket.statusHistory.map((change, index) => (
                      <div 
                        key={change.id} 
                        className="flex gap-4 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          {index < ticket.statusHistory.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{change.changedBy}</span>
                            <span className="text-muted-foreground">changed status to</span>
                            <StatusBadge status={change.to} />
                          </div>
                          {change.note && (
                            <p className="text-sm text-muted-foreground mb-2">{change.note}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(change.changedAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Admin Panel */}
          <div className="space-y-6">
            {/* Admin Control Panel - Only visible to admins */}
            {isAdmin && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Admin Control
                    <Badge variant="secondary" className="text-[10px]">Admin Only</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Update Status</label>
                    <Select value={newStatus} onValueChange={(v) => setNewStatus(v as TicketStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Note (optional)</label>
                    <Textarea
                      placeholder="Add a note about this status change..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || !newStatus || newStatus === ticket.status}
                    className={cn(
                      'w-full transition-all duration-300',
                      updateSuccess && 'bg-emerald-500 hover:bg-emerald-500 success-pulse'
                    )}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : updateSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Updated!
                      </>
                    ) : (
                      'Update Status'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Non-admin notice */}
            {!isAdmin && (
              <Card className="border-muted">
                <CardContent className="p-4 text-center text-sm text-muted-foreground">
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Status updates are managed by administrators.
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status Changes</span>
                  <span className="font-medium">{ticket.statusHistory.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Attachments</span>
                  <span className="font-medium">{ticket.attachments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <span className="font-medium">
                    {Math.ceil((Date.now() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
