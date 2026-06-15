import { Project, Task, TeamMember, TaskStatus } from './types';

const STORAGE_KEY = 'taskflow_data';

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
];

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getInitialData() {
  const teamMembers: TeamMember[] = [
    { id: 'tm1', name: 'Alex Johnson', email: 'alex@taskflow.io', role: 'Project Manager', avatar: AVATARS[0], createdAt: new Date().toISOString() },
    { id: 'tm2', name: 'Sarah Chen', email: 'sarah@taskflow.io', role: 'Frontend Developer', avatar: AVATARS[1], createdAt: new Date().toISOString() },
    { id: 'tm3', name: 'John Davis', email: 'john@taskflow.io', role: 'Backend Developer', avatar: AVATARS[2], createdAt: new Date().toISOString() },
    { id: 'tm4', name: 'Emily Wilson', email: 'emily@taskflow.io', role: 'UI/UX Designer', avatar: AVATARS[3], createdAt: new Date().toISOString() },
    { id: 'tm5', name: 'Michael Brown', email: 'michael@taskflow.io', role: 'QA Engineer', avatar: AVATARS[4], createdAt: new Date().toISOString() },
  ];

  const projects: Project[] = [
    {
      id: 'p1',
      name: 'E-Commerce Platform',
      description: 'Build a full-stack e-commerce application with payment integration and inventory management.',
      status: 'active',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      teamMemberIds: ['tm1', 'tm2', 'tm3', 'tm4'],
      color: COLORS[0],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      name: 'Mobile Banking App',
      description: 'Develop a secure mobile banking application with biometric authentication and real-time transactions.',
      status: 'active',
      startDate: '2025-02-01',
      endDate: '2025-08-15',
      teamMemberIds: ['tm1', 'tm3', 'tm5'],
      color: COLORS[1],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p3',
      name: 'AI Chatbot Integration',
      description: 'Integrate an AI-powered chatbot for customer support with natural language processing.',
      status: 'on-hold',
      startDate: '2025-03-10',
      endDate: '2025-07-20',
      teamMemberIds: ['tm2', 'tm4'],
      color: COLORS[2],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p4',
      name: 'Data Analytics Dashboard',
      description: 'Create an interactive analytics dashboard with real-time data visualization and reporting.',
      status: 'completed',
      startDate: '2024-10-01',
      endDate: '2025-01-30',
      teamMemberIds: ['tm1', 'tm2', 'tm3', 'tm4', 'tm5'],
      color: COLORS[3],
      createdAt: new Date().toISOString(),
    },
  ];

  const tasks: Task[] = [
    // E-Commerce tasks
    { id: 't1', title: 'Design database schema', description: 'Create ER diagram and define tables for products, orders, users', status: 'done', priority: 'high', assigneeId: 'tm3', deadline: '2025-02-01', projectId: 'p1', createdAt: new Date().toISOString() },
    { id: 't2', title: 'Setup React project', description: 'Initialize Vite project with TypeScript and Tailwind', status: 'done', priority: 'high', assigneeId: 'tm2', deadline: '2025-02-05', projectId: 'p1', createdAt: new Date().toISOString() },
    { id: 't3', title: 'Design UI mockups', description: 'Create Figma designs for all main pages', status: 'done', priority: 'high', assigneeId: 'tm4', deadline: '2025-02-10', projectId: 'p1', createdAt: new Date().toISOString() },
    { id: 't4', title: 'Implement authentication', description: 'Build login, register, and JWT token handling', status: 'in-progress', priority: 'high', assigneeId: 'tm3', deadline: '2025-03-15', projectId: 'p1', createdAt: new Date().toISOString() },
    { id: 't5', title: 'Product catalog page', description: 'Build product listing with filters and search', status: 'in-progress', priority: 'medium', assigneeId: 'tm2', deadline: '2025-03-20', projectId: 'p1', createdAt: new Date().toISOString() },
    { id: 't6', title: 'Shopping cart functionality', description: 'Implement add to cart, update quantities, and checkout flow', status: 'todo', priority: 'high', assigneeId: 'tm2', deadline: '2025-04-01', projectId: 'p1', createdAt: new Date().toISOString() },
    { id: 't7', title: 'Payment integration', description: 'Integrate Stripe for payment processing', status: 'todo', priority: 'high', assigneeId: 'tm3', deadline: '2025-04-15', projectId: 'p1', createdAt: new Date().toISOString() },
    { id: 't8', title: 'Write unit tests', description: 'Achieve 80% code coverage with Jest', status: 'todo', priority: 'medium', assigneeId: 'tm5', deadline: '2025-05-01', projectId: 'p1', createdAt: new Date().toISOString() },

    // Mobile Banking tasks
    { id: 't9', title: 'Security architecture', description: 'Design secure API with OAuth2 and encryption', status: 'done', priority: 'high', assigneeId: 'tm3', deadline: '2025-02-20', projectId: 'p2', createdAt: new Date().toISOString() },
    { id: 't10', title: 'Biometric auth research', description: 'Evaluate Face ID and fingerprint options', status: 'done', priority: 'medium', assigneeId: 'tm1', deadline: '2025-02-25', projectId: 'p2', createdAt: new Date().toISOString() },
    { id: 't11', title: 'Account dashboard', description: 'Build main screen with balance and recent transactions', status: 'in-progress', priority: 'high', assigneeId: 'tm3', deadline: '2025-04-10', projectId: 'p2', createdAt: new Date().toISOString() },
    { id: 't12', title: 'Transfer funds feature', description: 'Implement peer-to-peer money transfers', status: 'todo', priority: 'high', assigneeId: 'tm3', deadline: '2025-05-01', projectId: 'p2', createdAt: new Date().toISOString() },
    { id: 't13', title: 'Security testing', description: 'Penetration testing and vulnerability assessment', status: 'todo', priority: 'high', assigneeId: 'tm5', deadline: '2025-06-01', projectId: 'p2', createdAt: new Date().toISOString() },

    // AI Chatbot tasks
    { id: 't14', title: 'LLM provider selection', description: 'Compare OpenAI, Claude, and Gemini APIs', status: 'done', priority: 'high', assigneeId: 'tm2', deadline: '2025-03-20', projectId: 'p3', createdAt: new Date().toISOString() },
    { id: 't15', title: 'Chat UI component', description: 'Design and build the chat interface', status: 'in-progress', priority: 'medium', assigneeId: 'tm4', deadline: '2025-04-15', projectId: 'p3', createdAt: new Date().toISOString() },
    { id: 't16', title: 'API integration', description: 'Connect to LLM API with streaming responses', status: 'todo', priority: 'high', assigneeId: 'tm2', deadline: '2025-05-15', projectId: 'p3', createdAt: new Date().toISOString() },

    // Analytics Dashboard tasks (completed)
    { id: 't17', title: 'Requirements gathering', description: 'Interview stakeholders and document requirements', status: 'done', priority: 'high', assigneeId: 'tm1', deadline: '2024-10-15', projectId: 'p4', createdAt: new Date().toISOString() },
    { id: 't18', title: 'Data pipeline setup', description: 'Build ETL pipeline from multiple sources', status: 'done', priority: 'high', assigneeId: 'tm3', deadline: '2024-11-01', projectId: 'p4', createdAt: new Date().toISOString() },
    { id: 't19', title: 'Chart components', description: 'Build reusable chart library with D3', status: 'done', priority: 'medium', assigneeId: 'tm2', deadline: '2024-11-20', projectId: 'p4', createdAt: new Date().toISOString() },
    { id: 't20', title: 'Dashboard layout', description: 'Create responsive grid layout for widgets', status: 'done', priority: 'medium', assigneeId: 'tm4', deadline: '2024-12-01', projectId: 'p4', createdAt: new Date().toISOString() },
    { id: 't21', title: 'Export reports', description: 'Add PDF and CSV export functionality', status: 'done', priority: 'low', assigneeId: 'tm2', deadline: '2024-12-15', projectId: 'p4', createdAt: new Date().toISOString() },
    { id: 't22', title: 'Final QA', description: 'End-to-end testing and bug fixes', status: 'done', priority: 'high', assigneeId: 'tm5', deadline: '2025-01-15', projectId: 'p4', createdAt: new Date().toISOString() },
  ];

  return { projects, tasks, teamMembers };
}

interface StoreData {
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
}

function loadData(): StoreData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  const data = getInitialData();
  saveData(data);
  return data;
}

function saveData(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let data = loadData();

let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getProjects(): Project[] {
  return [...data.projects];
}

export function getTasks(): Task[] {
  return [...data.tasks];
}

export function getTeamMembers(): TeamMember[] {
  return [...data.teamMembers];
}

export function getProjectById(id: string): Project | undefined {
  return data.projects.find((p) => p.id === id);
}

export function getTasksByProject(projectId: string): Task[] {
  return data.tasks.filter((t) => t.projectId === projectId);
}

export function getTaskById(id: string): Task | undefined {
  return data.tasks.find((t) => t.id === id);
}

export function getTeamMemberById(id: string): TeamMember | undefined {
  return data.teamMembers.find((tm) => tm.id === id);
}

export function addProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
  const newProject: Project = {
    ...project,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  data.projects.push(newProject);
  saveData(data);
  notify();
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data.projects[idx] = { ...data.projects[idx], ...updates };
  saveData(data);
  notify();
  return data.projects[idx];
}

export function deleteProject(id: string): boolean {
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  data.projects.splice(idx, 1);
  data.tasks = data.tasks.filter((t) => t.projectId !== id);
  saveData(data);
  notify();
  return true;
}

export function addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  data.tasks.push(newTask);
  saveData(data);
  notify();
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const idx = data.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  data.tasks[idx] = { ...data.tasks[idx], ...updates };
  saveData(data);
  notify();
  return data.tasks[idx];
}

export function deleteTask(id: string): boolean {
  const idx = data.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  data.tasks.splice(idx, 1);
  saveData(data);
  notify();
  return true;
}

export function moveTask(id: string, status: TaskStatus): Task | null {
  return updateTask(id, { status });
}

export function addTeamMember(member: Omit<TeamMember, 'id' | 'createdAt' | 'avatar'>): TeamMember {
  const newMember: TeamMember = {
    ...member,
    id: generateId(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`,
    createdAt: new Date().toISOString(),
  };
  data.teamMembers.push(newMember);
  saveData(data);
  notify();
  return newMember;
}

export function updateTeamMember(id: string, updates: Partial<TeamMember>): TeamMember | null {
  const idx = data.teamMembers.findIndex((tm) => tm.id === id);
  if (idx === -1) return null;
  data.teamMembers[idx] = { ...data.teamMembers[idx], ...updates };
  saveData(data);
  notify();
  return data.teamMembers[idx];
}

export function deleteTeamMember(id: string): boolean {
  const idx = data.teamMembers.findIndex((tm) => tm.id === id);
  if (idx === -1) return false;
  data.teamMembers.splice(idx, 1);
  data.tasks = data.tasks.map((t) =>
    t.assigneeId === id ? { ...t, assigneeId: null } : t
  );
  data.projects = data.projects.map((p) => ({
    ...p,
    teamMemberIds: p.teamMemberIds.filter((tid) => tid !== id),
  }));
  saveData(data);
  notify();
  return true;
}

export function getProjectProgress(projectId: string): number {
  const tasks = getTasksByProject(projectId);
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

export function resetData() {
  data = getInitialData();
  saveData(data);
  notify();
}
