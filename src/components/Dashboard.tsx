import { motion } from 'framer-motion';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { View } from '../types';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';

interface DashboardProps {
  onNavigate: (view: View, projectId?: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { projects, tasks, getProjectProgress, getTeamMemberById } = useStore();

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'done').length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && isPast(parseISO(t.deadline)) && !isToday(parseISO(t.deadline))
  ).length;

  const stats = [
    { label: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'bg-blue-500', trend: '+2 this month' },
    { label: 'Active Projects', value: activeProjects, icon: TrendingUp, color: 'bg-emerald-500', trend: 'On track' },
    { label: 'Tasks Completed', value: completedTasks, icon: CheckCircle2, color: 'bg-violet-500', trend: `${Math.round((completedTasks / (tasks.length || 1)) * 100)}% done` },
    { label: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'bg-amber-500', trend: `${overdueTasks} overdue` },
  ];

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const upcomingDeadlines = [...tasks]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const getDeadlineLabel = (deadline: string) => {
    const date = parseISO(deadline);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getDeadlineColor = (deadline: string, status: string) => {
    if (status === 'done') return 'text-emerald-600 bg-emerald-50';
    const date = parseISO(deadline);
    if (isPast(date) && !isToday(date)) return 'text-red-600 bg-red-50';
    if (isToday(date) || isTomorrow(date)) return 'text-amber-600 bg-amber-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <button
          onClick={() => onNavigate('projects')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View All Projects
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-600 mt-1">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Recent Projects</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProjects.map((project) => {
              const progress = getProjectProgress(project.id);
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const doneCount = projectTasks.filter((t) => t.status === 'done').length;
              return (
                <div
                  key={project.id}
                  onClick={() => onNavigate('project-detail', project.id)}
                  className="p-6 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-slate-700">
                        {doneCount}/{projectTasks.length} tasks
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span>Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h3>
          </div>
          <div className="p-4 space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle2 size={32} className="mx-auto mb-2" />
                <p className="text-sm">All caught up!</p>
              </div>
            ) : (
              upcomingDeadlines.map((task) => {
                const assignee = task.assigneeId ? getTeamMemberById(task.assigneeId) : null;
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${getDeadlineColor(task.deadline, task.status)}`}>
                      <Calendar size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500">
                        {getDeadlineLabel(task.deadline)}
                        {assignee && ` · ${assignee.name}`}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          {overdueTasks > 0 && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-700 font-medium">
                  {overdueTasks} task{overdueTasks > 1 ? 's' : ''} overdue
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
