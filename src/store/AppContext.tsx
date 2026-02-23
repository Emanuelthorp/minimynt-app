import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { AppState, Action, initialState, isTaskExpired } from './types';
import { loadState, saveState, clearState } from './persistence';

// ── Reducer ────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE_LOCK':
      return { ...state, roleLock: action.payload };

    case 'SET_ADULT_PHONE':
      return { ...state, adultPhone: action.payload };

    case 'SET_CHILD_PHONE':
      return { ...state, childPhone: action.payload };

    case 'ADD_CHILD':
      return { ...state, children: [...state.children, action.payload] };

    case 'REMOVE_CHILD':
      return {
        ...state,
        children: state.children.filter((c) => c.phone !== action.payload),
      };

    case 'UPDATE_CHILD':
      return {
        ...state,
        children: state.children.map((c) =>
          c.phone === action.payload.phone
            ? { ...c, name: action.payload.name, avatarEmoji: action.payload.avatarEmoji }
            : c
        ),
      };

    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case 'TAKE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId
            ? {
                ...t,
                status: 'Tatt',
                takenBy: action.payload.childPhone,
                takenAt: Date.now(),
              }
            : t
        ),
      };

    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: 'Ferdig', completedAt: Date.now() }
            : t
        ),
      };

    case 'APPROVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: 'Godkjent', approvedAt: Date.now() }
            : t
        ),
      };

    case 'REJECT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: 'Avvist', approvedAt: Date.now() }
            : t
        ),
      };

    case 'SET_TASKS_PAID': {
      const paidIds = new Set(action.payload);
      const paidTasks = state.tasks.filter((t) => paidIds.has(t.id));
      const totalPaid = paidTasks.reduce((sum, t) => sum + t.reward, 0);
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          paidIds.has(t.id)
            ? { ...t, status: 'Betalt', paidAt: Date.now() }
            : t
        ),
        ledger: {
          ...state.ledger,
          paidOutThisMonth: state.ledger.paidOutThisMonth + totalPaid,
          feeDue: state.ledger.feeDue + totalPaid * 0.001,
        },
      };
    }

    case 'REOPEN_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: 'Ledig', takenBy: undefined, takenAt: undefined, completedAt: undefined, approvedAt: undefined }
            : t
        ),
      };

    case 'RESET_LEDGER': {
      const currentMonth = new Date().toISOString().slice(0, 7);
      return {
        ...state,
        ledger: { paidOutThisMonth: 0, feeDue: 0, month: currentMonth },
      };
    }

    case 'CLEANUP_EXPIRED_TASKS':
      return {
        ...state,
        tasks: state.tasks.filter(
          (t) => !(isTaskExpired(t) && (t.status === 'Ledig' || t.status === 'Tatt'))
        ),
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isLoading: boolean;
  /** Clears AsyncStorage AND resets in-memory state atomically. Always use this for logout. */
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    await clearState();          // 1. Remove from AsyncStorage first
    dispatch({ type: 'RESET_STATE' }); // 2. Reset in-memory state
  };

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      const saved = await loadState();
      if (saved) {
        // Replay the full saved state via a bulk-replace action
        dispatch({ type: 'RESET_STATE' });
        if (saved.roleLock) dispatch({ type: 'SET_ROLE_LOCK', payload: saved.roleLock });
        if (saved.adultPhone) dispatch({ type: 'SET_ADULT_PHONE', payload: saved.adultPhone });
        if (saved.childPhone) dispatch({ type: 'SET_CHILD_PHONE', payload: saved.childPhone });
        saved.children.forEach((c) => dispatch({ type: 'ADD_CHILD', payload: c }));
        saved.tasks.forEach((t) => dispatch({ type: 'ADD_TASK', payload: t }));

        // Fix 4: reset ledger if the saved month differs from the current month
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (saved.ledger && saved.ledger.month !== currentMonth) {
          dispatch({ type: 'RESET_LEDGER' });
        }
      }
      setIsLoading(false);
    })();
  }, []);

  // Fix 5: clean up expired tasks once loading is complete
  useEffect(() => {
    if (!isLoading) {
      dispatch({ type: 'CLEANUP_EXPIRED_TASKS' });
    }
  }, [isLoading]);

  // Persist on every state change
  useEffect(() => {
    if (!isLoading) {
      saveState(state);
    }
  }, [state, isLoading]);

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};
