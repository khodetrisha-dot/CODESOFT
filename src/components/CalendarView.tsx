import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
  isPast,
} from 'date-fns';

export default function CalendarView() {
  const { tasks, getProjectById, getTeamMemberById } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => isSameDay(parseISO(task.deadline), date));
  };

  const selectedTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Calendar</h2>
          <p className="text-slate-500 mt-1">View tasks and deadlines by date</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h3 className="text-lg font-semibold text-slate-900 min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((wd) => (
              <div key={wd} className="text-center text-xs font-semibold text-slate-500 uppercase py-2">
                {wd}
              </div>
            ))}
            {days.map((d, i) => {
              const dayTasks = getTasksForDay(d);
              const hasOverdue = dayTasks.some(
                (t) => t.status !== 'done' && isPast(parseISO(t.deadline)) && !isToday(parseISO(t.deadline))
              );
              const hasDueToday = dayTasks.some(
                (t) => t.status !== 'done' && isToday(parseISO(t.deadline))
              );
              const isSelected = selectedDate && isSameDay(d, selectedDate);

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDate(d)}
                  className={`aspect-square rounded-xl p-2 text-left transition-all relative ${
                    !isSameMonth(d, currentMonth)
                      ? 'text-slate-300 bg-slate-50/50'
                      : isSelected
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isToday(d)
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
                    {format(d, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            t.status === 'done'
                              ? 'bg-emerald-400'
                              : hasOverdue
                              ? 'bg-red-400'
                              : hasDueToday
                              ? 'bg-amber-400'
                              : 'bg-blue-400'
                          }`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                          +{dayTasks.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Task List for Selected Date */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
          </h3>
          {selectedTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Calendar size={32} className="mx-auto mb-2" />
              <p className="text-sm">No tasks for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedTasks.map((task) => {
                const project = getProjectById(task.projectId);
                const assignee = task.assigneeId ? getTeamMemberById(task.assigneeId) : null;
                const isOverdue =
                  task.status !== 'done' && isPast(parseISO(task.deadline)) && !isToday(parseISO(task.deadline));

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border ${
                      task.status === 'done'
                        ? 'bg-emerald-50 border-emerald-200'
                        : isOverdue
                        ? 'bg-red-50 border-red-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {task.status === 'done' ? (
                        <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                      ) : isOverdue ? (
                        <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                      ) : (
                        <Clock size={18} className="text-blue-500 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">{task.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{task.description.slice(0, 60)}...</p>
                        <div className="flex items-center gap-2 mt-2">
                          {project && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                              style={{ backgroundColor: project.color }}
                            >
                              {project.name}
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : task.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        {assignee && (
                          <div className="flex items-center gap-2 mt-2">
                            <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full" />
                            <span className="text-xs text-slate-500">{assignee.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
