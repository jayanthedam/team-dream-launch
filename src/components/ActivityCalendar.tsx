
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ActivityCalendar = () => {
  // Generate random activity data for the past year
  const generateActivityData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Generate random activity count (0-10 logins per day)
      const count = Math.floor(Math.random() * 11);
      
      data.push({
        date: date.toISOString().split('T')[0],
        count,
        level: count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4
      });
    }
    
    return data;
  };

  const activityData = generateActivityData();
  
  // Group data by weeks
  const weeks = [];
  let currentWeek = [];
  
  activityData.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay();
    
    if (index === 0) {
      // Fill in empty days at the beginning of the first week
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }
    
    currentWeek.push(day);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Add the last week if it's not complete
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const getColorClass = (level) => {
    switch (level) {
      case 0: return 'bg-slate-100';
      case 1: return 'bg-green-200';
      case 2: return 'bg-green-300';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-500';
      default: return 'bg-slate-100';
    }
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate total contributions
  const totalContributions = activityData.reduce((sum, day) => sum + day.count, 0);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="text-sm text-slate-600">
          <span className="font-medium">{totalContributions}</span> login activities in the last year
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex mb-2">
              <div className="w-8"></div> {/* Space for day labels */}
              <div className="flex flex-1 justify-between text-xs text-slate-500">
                {months.map((month, index) => (
                  <span key={month} className="text-center" style={{ width: `${100/12}%` }}>
                    {month}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col space-y-1 mr-2">
                {days.map((day, index) => (
                  <div key={day} className="text-xs text-slate-500 h-3 flex items-center">
                    {index % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="flex space-x-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {week.map((day, dayIndex) => (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-3 h-3 rounded-sm border border-slate-200 ${
                              day ? getColorClass(day.level) : 'bg-transparent border-transparent'
                            } cursor-pointer transition-all hover:ring-1 hover:ring-slate-400`}
                          />
                        </TooltipTrigger>
                        {day && (
                          <TooltipContent>
                            <p>
                              <span className="font-medium">{day.count} logins</span> on{' '}
                              {new Date(day.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-200 border border-slate-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-300 border border-slate-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400 border border-slate-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-500 border border-slate-200"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ActivityCalendar;
