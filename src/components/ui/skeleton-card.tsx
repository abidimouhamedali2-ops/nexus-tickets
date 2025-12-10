import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="skeleton-shimmer h-5 w-32 rounded" />
        <div className="skeleton-shimmer h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton-shimmer h-4 w-full rounded" />
        <div className="skeleton-shimmer h-4 w-3/4 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="skeleton-shimmer h-8 w-8 rounded-full" />
        <div className="skeleton-shimmer h-4 w-24 rounded" />
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b">
      <td className="p-4">
        <div className="skeleton-shimmer h-4 w-8 rounded" />
      </td>
      <td className="p-4">
        <div className="space-y-2">
          <div className="skeleton-shimmer h-4 w-48 rounded" />
          <div className="skeleton-shimmer h-3 w-32 rounded" />
        </div>
      </td>
      <td className="p-4">
        <div className="skeleton-shimmer h-6 w-20 rounded-full" />
      </td>
      <td className="p-4">
        <div className="skeleton-shimmer h-6 w-16 rounded-full" />
      </td>
      <td className="p-4">
        <div className="skeleton-shimmer h-4 w-24 rounded" />
      </td>
      <td className="p-4">
        <div className="skeleton-shimmer h-8 w-8 rounded" />
      </td>
    </tr>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="skeleton-shimmer h-10 w-10 rounded-lg" />
              <div className="skeleton-shimmer h-4 w-16 rounded" />
            </div>
            <div className="skeleton-shimmer h-8 w-20 rounded mb-1" />
            <div className="skeleton-shimmer h-3 w-24 rounded" />
          </div>
        ))}
      </div>
      
      {/* Recent tickets */}
      <div className="rounded-xl border bg-card">
        <div className="p-6 border-b">
          <div className="skeleton-shimmer h-6 w-32 rounded" />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} className="border-0 p-4" />
          ))}
        </div>
      </div>
    </div>
  );
}
