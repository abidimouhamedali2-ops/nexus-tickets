import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TicketStatus = 'new' | 'under_review' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'technical' | 'billing' | 'general' | 'feature_request';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface StatusChange {
  id: string;
  from: TicketStatus;
  to: TicketStatus;
  changedBy: string;
  changedAt: Date;
  note?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: Attachment[];
  statusHistory: StatusChange[];
}

interface TicketContextType {
  tickets: Ticket[];
  isLoading: boolean;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<Ticket>;
  updateTicketStatus: (ticketId: string, status: TicketStatus, note?: string, changedBy?: string) => Promise<void>;
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Mock tickets
const initialTickets: Ticket[] = [
  {
    id: '1',
    title: 'Unable to access email server',
    description: 'Getting timeout errors when trying to connect to the mail server. This started happening after the maintenance window last night.',
    status: 'new',
    priority: 'high',
    category: 'technical',
    createdBy: '2',
    createdByName: 'John Employee',
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
    attachments: [],
    statusHistory: [],
  },
  {
    id: '2',
    title: 'Request for new software license',
    description: 'Need Adobe Creative Suite license for the design team project starting next month.',
    status: 'under_review',
    priority: 'medium',
    category: 'general',
    createdBy: '2',
    createdByName: 'Sarah Designer',
    createdAt: new Date('2024-01-14T14:30:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    attachments: [],
    statusHistory: [
      {
        id: '1',
        from: 'new',
        to: 'under_review',
        changedBy: 'Admin User',
        changedAt: new Date('2024-01-15T10:00:00'),
        note: 'Checking with procurement',
      },
    ],
  },
  {
    id: '3',
    title: 'Billing discrepancy on invoice #4521',
    description: 'The invoice shows charges for services we did not request. Please review and correct.',
    status: 'resolved',
    priority: 'medium',
    category: 'billing',
    createdBy: '2',
    createdByName: 'Mike Finance',
    createdAt: new Date('2024-01-10T11:00:00'),
    updatedAt: new Date('2024-01-14T16:00:00'),
    attachments: [],
    statusHistory: [
      {
        id: '1',
        from: 'new',
        to: 'under_review',
        changedBy: 'Admin User',
        changedAt: new Date('2024-01-11T09:00:00'),
      },
      {
        id: '2',
        from: 'under_review',
        to: 'resolved',
        changedBy: 'Admin User',
        changedAt: new Date('2024-01-14T16:00:00'),
        note: 'Invoice corrected and refund issued',
      },
    ],
  },
  {
    id: '4',
    title: 'Feature request: Dark mode for internal dashboard',
    description: 'Would be great to have a dark mode option for the internal dashboard to reduce eye strain during night shifts.',
    status: 'new',
    priority: 'low',
    category: 'feature_request',
    createdBy: '2',
    createdByName: 'Alex Developer',
    createdAt: new Date('2024-01-16T08:00:00'),
    updatedAt: new Date('2024-01-16T08:00:00'),
    attachments: [],
    statusHistory: [],
  },
  {
    id: '5',
    title: 'VPN connection drops frequently',
    description: 'VPN disconnects every 15-20 minutes requiring manual reconnection. Very disruptive to work.',
    status: 'under_review',
    priority: 'critical',
    category: 'technical',
    createdBy: '2',
    createdByName: 'Remote Worker',
    createdAt: new Date('2024-01-15T16:00:00'),
    updatedAt: new Date('2024-01-16T09:00:00'),
    attachments: [],
    statusHistory: [
      {
        id: '1',
        from: 'new',
        to: 'under_review',
        changedBy: 'Admin User',
        changedAt: new Date('2024-01-16T09:00:00'),
        note: 'Escalated to network team',
      },
    ],
  },
];

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(false);

  const createTicket = useCallback(async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [],
    };

    setTickets(prev => [newTicket, ...prev]);
    setIsLoading(false);
    return newTicket;
  }, []);

  const updateTicketStatus = useCallback(async (ticketId: string, status: TicketStatus, note?: string, changedBy: string = 'Admin User') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const statusChange: StatusChange = {
          id: Date.now().toString(),
          from: ticket.status,
          to: status,
          changedBy,
          changedAt: new Date(),
          note,
        };

        return {
          ...ticket,
          status,
          updatedAt: new Date(),
          statusHistory: [...ticket.statusHistory, statusChange],
        };
      }
      return ticket;
    }));

    setIsLoading(false);
  }, []);

  const getTicketById = useCallback((id: string) => {
    return tickets.find(t => t.id === id);
  }, [tickets]);

  return (
    <TicketContext.Provider value={{
      tickets,
      isLoading,
      createTicket,
      updateTicketStatus,
      getTicketById,
    }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
