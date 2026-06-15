import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  Briefcase,
  X,
  Search,
  User,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { TeamMember } from '../types';

export default function Team() {
  const { teamMembers, tasks, addTeamMember, updateTeamMember, deleteTeamMember } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const getMemberStats = (memberId: string) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === memberId);
    const completed = memberTasks.filter((t) => t.status === 'done').length;
    const inProgress = memberTasks.filter((t) => t.status === 'in-progress').length;
    const todo = memberTasks.filter((t) => t.status === 'todo').length;
    return { total: memberTasks.length, completed, inProgress, todo };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateTeamMember(editingMember.id, formData);
    } else {
      addTeamMember(formData);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData({ name: '', email: '', role: '' });
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({ name: member.name, email: member.email, role: member.role });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this team member? Their tasks will be unassigned.')) {
      deleteTeamMember(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team</h2>
          <p className="text-slate-500 mt-1">Manage your team members and their assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Team Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <User size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-medium">No team members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredMembers.map((member, i) => {
              const stats = getMemberStats(member.id);
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl bg-slate-100"
                        />
                        <div>
                          <h3 className="font-semibold text-slate-900">{member.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Briefcase size={12} className="text-slate-400" />
                            <span className="text-sm text-slate-500">{member.role}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Mail size={12} className="text-slate-400" />
                            <span className="text-xs text-slate-400">{member.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(member)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg"
                        >
                          <Pencil size={14} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-50 rounded-xl p-2">
                          <p className="text-lg font-bold text-slate-900">{stats.total}</p>
                          <p className="text-xs text-slate-500">Total</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-2">
                          <p className="text-lg font-bold text-blue-700">{stats.inProgress}</p>
                          <p className="text-xs text-blue-600">Active</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-2">
                          <p className="text-lg font-bold text-emerald-700">{stats.completed}</p>
                          <p className="text-xs text-emerald-600">Done</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingMember ? 'Edit Member' : 'Add Team Member'}
                </h3>
                <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <input
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                  >
                    {editingMember ? 'Save Changes' : 'Add Member'}
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
