export type Role = 'adult' | 'child';

export type TaskStatus =
  | 'Ledig'      // available/open
  | 'Tatt'       // taken by child
  | 'Ferdig'     // completed by child, awaiting approval
  | 'Godkjent'   // approved by adult
  | 'Avvist'     // rejected by adult
  | 'Betalt';    // paid out via Vipps

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;           // NOK
  status: TaskStatus;
  createdAt: number;        // Date.now()
  takenBy?: string;         // child phone
  takenAt?: number;
  completedAt?: number;
  approvedAt?: number;
  paidAt?: number;
}

export interface Child {
  name: string;
  phone: string;            // 8 digits, unique
  avatarEmoji: string;
}

export interface Ledger {
  paidOutThisMonth: number; // NOK
  feeDue: number;           // NOK (0.1% of paid)
  month: string;            // 'YYYY-MM'
}

export interface AppState {
  roleLock: Role | null;
  adultPhone: string | null;
  childPhone: string | null;  // which child is logged in
  children: Child[];
  tasks: Task[];
  ledger: Ledger;
}

// ── Actions ────────────────────────────────────────────────────────────────

export type Action =
  | { type: 'SET_ROLE_LOCK'; payload: Role }
  | { type: 'SET_ADULT_PHONE'; payload: string }
  | { type: 'SET_CHILD_PHONE'; payload: string }
  | { type: 'ADD_CHILD'; payload: Child }
  | { type: 'REMOVE_CHILD'; payload: string }            // phone
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Partial<Task> & { id: string } }
  | { type: 'DELETE_TASK'; payload: string }             // id
  | { type: 'TAKE_TASK'; payload: { taskId: string; childPhone: string } }
  | { type: 'COMPLETE_TASK'; payload: string }           // taskId
  | { type: 'APPROVE_TASK'; payload: string }            // taskId
  | { type: 'REJECT_TASK'; payload: string }             // taskId
  | { type: 'SET_TASKS_PAID'; payload: string[] }        // taskIds
  | { type: 'RESET_STATE' };

export const initialState: AppState = {
  roleLock: null,
  adultPhone: null,
  childPhone: null,
  children: [],
  tasks: [],
  ledger: {
    paidOutThisMonth: 0,
    feeDue: 0,
    month: new Date().toISOString().slice(0, 7),
  },
};

// ── Helper ─────────────────────────────────────────────────────────────────

export const isTaskExpired = (task: Task): boolean =>
  ['Ledig', 'Tatt'].includes(task.status) &&
  Date.now() - task.createdAt > 48 * 60 * 60 * 1000;
