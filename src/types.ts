export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type ProjectStatus = 'active' | 'completed' | 'on-hold';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  deadline: string;
  projectId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  teamMemberIds: string[];
  color: string;
  createdAt: string;
}

export type View = 'dashboard' | 'projects' | 'project-detail' | 'calendar' | 'team';
