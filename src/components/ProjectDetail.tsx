import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  X,
  GripVertical,
  Search,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { View, Task, TaskStatus, TaskPriority } from '../types';
import { format, isPast, isToday, parseISO } from 'date-fns';

interface ProjectDetailProps {
  projectId: string;
  onNavigate: (view: View, projectId?: string) => void;
}

const COLUMNS: { status: TaskStatus; label: string; color: string; bg: string }[] = [
  { status: 'todo', label: 'To Do', color: 'text-slate-700', bg: 'bg-slate-50' },
  { status: 'in-progress', label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-50' },
  { status: 'review', label: 'Review', color: 'text-violet-700', bg: 'bg-violet-50' },
  { status: 'done', label: 'Done', color: 'text-emerald-700', bg: 'bg-emerald-50' },
];



export default function ProjectDetail({ projectId, onNavigate }: ProjectDetailProps) {
  const {
    getProjectById,
    getTasksByProject,
    getTeamMemberById,
    getProjectProgress,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    teamMembers,
  } = useStore();

  const project = getProjectById(projectId);
  const tasks = getTasksByProject(projectId);
  const progress = getProjectProgress(projectId);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingTask, setDraggingTask] = useState<string | null>(null);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assigneeId: '',
    deadline: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  });

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Project not found</p>
        <button
          onClick={() => onNavigate('projects')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...taskForm,
      assigneeId: taskForm.assigneeId || null,
      projectId,
    };
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    closeTaskModal();
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assigneeId: '',
      deadline: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    });
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId || '',
      deadline: task.deadline,
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Delete this task?')) {
      deleteTask(id);
    }
  };

  const handleDragStart = (taskId: string) => {
    setDraggingTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggingTask) {
      moveTask(draggingTask, status);
      setDraggingTask(null);
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDeadlineColor = (deadline: string, status: TaskStatus) => {
    if (status === 'done') return 'text-emerald-600';
    const date = parseISO(deadline);
    if (isPast(date) && !isToday(date)) return 'text-red-600';
    if (isToday(date)) return 'text-amber-600';
    return 'text-slate-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('projects')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} />
            <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
          </div>
          <p className="text-slate-500 mt-1 ml-7">{project.description}</p>
        </div>

      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Progress</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-slate-100 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
                className="h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
            </div>
            <span className="text-lg font-bold text-slate-900">{progress}%</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Tasks</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{tasks.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {tasks.filter((t) => t.status === 'done').length} completed
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Timeline</p>
          <p className="text-sm font-medium text-slate-900 mt-1">
            {format(new Date(project.startDate), 'MMM d')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isPast(parseISO(project.endDate)) && project.status !== 'completed'
              ? 'Overdue'
              : project.status === 'completed'
              ? 'Completed'
              : 'In progress'}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter((t) => t.status === column.status);
          return (
            <div
              key={column.status}
              className={`${column.bg} rounded-2xl p-4 min-h-[400px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-sm ${column.color}`}>{column.label}</h3>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full font-medium text-slate-600 border border-slate-200">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {columnTasks.map((task) => {
                    const assignee = task.assigneeId ? getTeamMemberById(task.assigneeId) : null;
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 cursor-move hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <GripVertical size={14} className="text-slate-300 shrink-0" />
                            <h4 className="font-medium text-slate-900 text-sm truncate">{task.title}</h4>
                          </div>
                          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditTask(task)}
                              className="p-1 hover:bg-slate-100 rounded"
                            >
                              <Pencil size={12} className="text-slate-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={12} className="text-red-400" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 ml-5">{task.description}</p>

                        <div className="flex items-center justify-between mt-3 ml-5">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs flex items-center gap-1 ${getDeadlineColor(task.deadline, task.status)}`}>
                              <Calendar size={12} />
                              {format(parseISO(task.deadline), 'MMM d')}
                            </span>
                            {assignee && (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-6 h-6 rounded-full border border-white"
                                title={assignee.name}
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={closeTaskModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h3>
                <button onClick={closeTaskModal} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleTaskSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    required
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as TaskStatus })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                    <select
                      value={taskForm.assigneeId}
                      onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Unassigned</option>
                      {teamMembers.map((tm) => (
                        <option key={tm.id} value={tm.id}>{tm.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                    <input
                      type="date"
                      required
                      value={taskForm.deadline}
                      onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeTaskModal}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
