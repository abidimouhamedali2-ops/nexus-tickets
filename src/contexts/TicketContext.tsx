import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import ticketService, { TicketFilters, CreateTicketData } from '@/services/ticketService';
import { useAuth } from './AuthContext';

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

interface TicketStats {
  total: number;
  new: number;
  underReview: number;
  resolved: number;
  closed: number;
}

interface TicketContextType {
  tickets: Ticket[];
  stats: TicketStats;
  isLoading: boolean;
  totalTickets: number;
  currentPage: number;
  totalPages: number;
  fetchTickets: (filters?: TicketFilters) => Promise<void>;
  createTicket: (data: CreateTicketData) => Promise<Ticket>;
  updateTicketStatus: (ticketId: string, status: TicketStatus, note?: string) => Promise<void>;
  getTicketById: (id: string) => Promise<Ticket | null>;
  refreshStats: () => Promise<void>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({ total: 0, new: 0, underReview: 0, resolved: 0, closed: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tickets with role-based filtering
  const fetchTickets = useCallback(async (filters: TicketFilters = {}) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await ticketService.getTickets(
        filters,
        user.role,
        user.id
      );
      setTickets(response.data);
      setTotalTickets(response.total);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    try {
      const newStats = await ticketService.getStats();
      setStats(newStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Initial fetch when user changes
  useEffect(() => {
    if (user) {
      fetchTickets();
      refreshStats();
    }
  }, [user, fetchTickets, refreshStats]);

  const createTicket = useCallback(async (data: CreateTicketData) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const newTicket = await ticketService.createTicket(data, user.id, user.name);
      setTickets(prev => [newTicket, ...prev]);
      await refreshStats();
      return newTicket;
    } finally {
      setIsLoading(false);
    }
  }, [user, refreshStats]);

  const updateTicketStatus = useCallback(async (ticketId: string, status: TicketStatus, note?: string) => {
    if (!user || !isAdmin) throw new Error('Unauthorized');
    
    setIsLoading(true);
    try {
      const updatedTicket = await ticketService.updateTicketStatus(
        ticketId,
        { status, note },
        user.name
      );
      
      setTickets(prev => prev.map(t => 
        t.id === ticketId ? updatedTicket : t
      ));
      await refreshStats();
    } finally {
      setIsLoading(false);
    }
  }, [user, isAdmin, refreshStats]);

  const getTicketById = useCallback(async (id: string): Promise<Ticket | null> => {
    // First check local state
    const cached = tickets.find(t => t.id === id);
    if (cached) return cached;
    
    // Fetch from API
    return await ticketService.getTicketById(id);
  }, [tickets]);

  return (
    <TicketContext.Provider value={{
      tickets,
      stats,
      isLoading,
      totalTickets,
      currentPage,
      totalPages,
      fetchTickets,
      createTicket,
      updateTicketStatus,
      getTicketById,
      refreshStats,
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
