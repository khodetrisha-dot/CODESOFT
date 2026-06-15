import { useState, useEffect, useCallback } from 'react';
import * as store from '../store';


export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return {
    projects: store.getProjects(),
    tasks: store.getTasks(),
    teamMembers: store.getTeamMembers(),
    getProjectById: store.getProjectById,
    getTasksByProject: store.getTasksByProject,
    getTaskById: store.getTaskById,
    getTeamMemberById: store.getTeamMemberById,
    getProjectProgress: store.getProjectProgress,
    addProject: store.addProject,
    updateProject: store.updateProject,
    deleteProject: store.deleteProject,
    addTask: store.addTask,
    updateTask: store.updateTask,
    deleteTask: store.deleteTask,
    moveTask: store.moveTask,
    addTeamMember: store.addTeamMember,
    updateTeamMember: store.updateTeamMember,
    deleteTeamMember: store.deleteTeamMember,
    resetData: store.resetData,
    refresh,
  };
}
