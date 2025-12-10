import api, { handleApiError } from '@/lib/api';
import { Ticket, TicketStatus, TicketCategory, TicketPriority } from '@/contexts/TicketContext';

export interface CreateTicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  attachments?: File[];
}

export interface TicketFilters {
  status?: TicketStatus | 'all';
  category?: TicketCategory | 'all';
  search?: string;
  page?: number;
  limit?: number;
  createdBy?: string; // For user-specific filtering
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface StatusUpdateData {
  status: TicketStatus;
  note?: string;
}

// Demo mode flag
const DEMO_MODE = true;

// Mock ticket data for demo mode
let mockTickets: Ticket[] = [
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
      { id: '1', from: 'new', to: 'under_review', changedBy: 'Admin User', changedAt: new Date('2024-01-11T09:00:00') },
      { id: '2', from: 'under_review', to: 'resolved', changedBy: 'Admin User', changedAt: new Date('2024-01-14T16:00:00'), note: 'Invoice corrected and refund issued' },
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
      { id: '1', from: 'new', to: 'under_review', changedBy: 'Admin User', changedAt: new Date('2024-01-16T09:00:00'), note: 'Escalated to network team' },
    ],
  },
];

export const ticketService = {
  /**
   * Get all tickets with filters
   * Django endpoint: GET /api/tickets
   */
  async getTickets(filters: TicketFilters = {}, userRole?: string, userId?: string): Promise<PaginatedResponse<Ticket>> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...mockTickets];
      
      // Role-based filtering: Users only see their own tickets
      if (userRole === 'employee' && userId) {
        filtered = filtered.filter(t => t.createdBy === userId);
      }
      
      // Apply search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search) ||
          t.id.includes(search)
        );
      }
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(t => t.status === filters.status);
      }
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(t => t.category === filters.category);
      }
      
      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);
      
      return {
        data: paginated,
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
      };
    }

    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (userRole === 'employee' && userId) params.append('created_by', userId);

      const response = await api.get<PaginatedResponse<Ticket>>(`/tickets?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get single ticket by ID
   * Django endpoint: GET /api/tickets/:id
   */
  async getTicketById(id: string): Promise<Ticket | null> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockTickets.find(t => t.id === id) || null;
    }

    try {
      const response = await api.get<Ticket>(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      if ((error as any)?.response?.status === 404) return null;
      throw handleApiError(error);
    }
  },

  /**
   * Create new ticket with attachments
   * Django endpoint: POST /api/tickets
   */
  async createTicket(data: CreateTicketData, userId: string, userName: string): Promise<Ticket> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newTicket: Ticket = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: 'new',
        createdBy: userId,
        createdByName: userName,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: data.attachments?.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        })) || [],
        statusHistory: [],
      };
      
      mockTickets = [newTicket, ...mockTickets];
      return newTicket;
    }

    try {
      // Use FormData for multipart/form-data (file uploads)
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('priority', data.priority);
      
      if (data.attachments) {
        data.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await api.post<Ticket>('/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update ticket status (Admin only)
   * Django endpoint: PATCH /api/tickets/:id/status
   */
  async updateTicketStatus(ticketId: string, data: StatusUpdateData, changedBy: string): Promise<Ticket> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      
      const ticket = mockTickets[ticketIndex];
      const statusChange = {
        id: Date.now().toString(),
        from: ticket.status,
        to: data.status,
        changedBy,
        changedAt: new Date(),
        note: data.note,
      };
      
      const updatedTicket: Ticket = {
        ...ticket,
        status: data.status,
        updatedAt: new Date(),
        statusHistory: [...ticket.statusHistory, statusChange],
      };
      
      mockTickets[ticketIndex] = updatedTicket;
      return updatedTicket;
    }

    try {
      const response = await api.patch<Ticket>(`/tickets/${ticketId}/status`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get ticket statistics (Admin only)
   * Django endpoint: GET /api/tickets/stats
   */
  async getStats(): Promise<{ total: number; new: number; underReview: number; resolved: number; closed: number }> {
    if (DEMO_MODE) {
      return {
        total: mockTickets.length,
        new: mockTickets.filter(t => t.status === 'new').length,
        underReview: mockTickets.filter(t => t.status === 'under_review').length,
        resolved: mockTickets.filter(t => t.status === 'resolved').length,
        closed: mockTickets.filter(t => t.status === 'closed').length,
      };
    }

    try {
      const response = await api.get<{ total: number; new: number; underReview: number; resolved: number; closed: number }>('/tickets/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default ticketService;
