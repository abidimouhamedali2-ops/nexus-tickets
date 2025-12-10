import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets, TicketStatus } from '@/contexts/TicketContext';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { SkeletonDashboard } from '@/components/ui/skeleton-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = {
    total: tickets.length,
    new: tickets.filter(t => t.status === 'new').length,
    underReview: tickets.filter(t => t.status === 'under_review').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const recentTickets = tickets.slice(0, 5);

  const statCards = [
    { 
      title: 'Total Tickets', 
      value: stats.total, 
      icon: Ticket, 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+12%'
    },
    { 
      title: 'New', 
      value: stats.new, 
      icon: AlertCircle, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    { 
      title: 'Under Review', 
      value: stats.underReview, 
      icon: Clock, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
    { 
      title: 'Resolved', 
      value: stats.resolved, 
      icon: CheckCircle, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="page-enter">
          <SkeletonDashboard />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-enter space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your tickets today.
            </p>
          </div>
          <Button asChild>
            <Link to="/tickets/new">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="card-hover"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  {stat.trend && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Tickets</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tickets">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentTickets.map((ticket, index) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="block p-4 hover:bg-muted/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          #{ticket.id}
                        </span>
                        <StatusBadge status={ticket.status} />
                      </div>
                      <h4 className="font-medium text-foreground truncate">
                        {ticket.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.createdByName} • {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
