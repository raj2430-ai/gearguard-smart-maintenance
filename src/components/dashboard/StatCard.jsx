import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({ title, value, icon, trend, className, iconClassName }) => {
  return (
    <div className={cn("stat-card group hover:shadow-elevated transition-shadow duration-200", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.direction === 'up' && (
                <TrendingUp className="h-4 w-4 text-status-repaired" />
              )}
              {trend.direction === 'down' && (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              {trend.direction === 'neutral' && (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={cn(
                "text-sm font-medium",
                trend.direction === 'up' && "text-status-repaired",
                trend.direction === 'down' && "text-destructive",
                trend.direction === 'neutral' && "text-muted-foreground"
              )}>
                {trend.value > 0 && '+'}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
          iconClassName
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};
