
import { DailyExecution } from "@/lib/types";

export const useIssueCategories = (dailyExecutions: DailyExecution[]) => {
  const processIssueCategoriesData = (projectId?: string) => {
    const filteredExecutions = projectId 
      ? dailyExecutions.filter(item => item.projectId === projectId && item.issueCategory)
      : dailyExecutions.filter(item => item.issueCategory);
    
    const categoryCounts: Record<string, number> = {};
    
    filteredExecutions.forEach(execution => {
      if (execution.issueCategory) {
        categoryCounts[execution.issueCategory] = (categoryCounts[execution.issueCategory] || 0) + 1;
      }
    });
    
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  return { processIssueCategoriesData };
};

