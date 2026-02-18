import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { AppState, Action, initialState } from './types';
import { loadState, saveState } from './persistence';

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
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

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
      }
      setIsLoading(false);
    })();
  }, []);

  // Persist on every state change
  useEffect(() => {
    if (!isLoading) {
      saveState(state);
    }
  }, [state, isLoading]);

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};
