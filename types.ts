
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Category {
  ADVENTURE = 'Adventure',
  CAREER = 'Career',
  CREATIVE = 'Creativity',
  FINANCE = 'Finance',
  HEALTH = 'Health',
  LEARNING = 'Learning',
  PERSONAL = 'Personal',
  RELATIONSHIP = 'Relationship',
  TRAVEL = 'Travel',
  SELF_IMPROVEMENT = 'Self Improvement',
  OTHER = 'Others'
}

export interface JournalEntry {
  id: string;
  date: number;
  text: string;
  imageUrl?: string;
}

export interface BucketItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  targetDate?: string;
  isCompleted: boolean;
  imageUrl?: string;
  generatedTasks: boolean;
  relatedTodoIds: string[]; // Link to Tasks
  relatedHabitIds: string[]; // Link to Habits
}

export interface TodoItem {
  id: string;
  linkedDreamId?: string; // Link back to a Dream
  title: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate?: string; // ISO Date YYYY-MM-DD
  isRecurring?: boolean;
  recurrenceEndDate?: string;
  points: number; // Gamification points (Sunlight)
  journal: JournalEntry[]; // Retrospective
  createdAt: number;
}

export interface Habit {
  id: string;
  linkedDreamId?: string; // Link back to a Dream
  title: string;
  streak: number;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  color: string;
}

export interface Plant {
  id: string;
  name: string;
  icon: string; // Lucide icon name or emoji
  cost: number;
  owned: number;
}

export interface UserStats {
  sunlight: number; // Currency
  level: number;
  inventory: Plant[];
}

export type ViewState = 'today' | 'bucket' | 'todo' | 'habit' | 'achievements' | 'me';
