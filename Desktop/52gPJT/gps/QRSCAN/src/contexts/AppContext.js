import React, { createContext, useReducer, useContext } from "react";

// Initial state
const initialState = {
  isLoading: false,
  error: null,
  user: null,
  cardEntryWorkers: [],
  modals: {
    addWorker: { isOpen: false },
    cardEntry: { isOpen: false },
    enforcement: { isOpen: false },
    enforcedList: { isOpen: false },
  },
};

// Action types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_USER: "SET_USER",
  SET_CARD_ENTRY_WORKERS: "SET_CARD_ENTRY_WORKERS",
  TOGGLE_MODAL: "TOGGLE_MODAL",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.SET_CARD_ENTRY_WORKERS:
      return { ...state, cardEntryWorkers: action.payload };
    case ActionTypes.TOGGLE_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: {
            isOpen: action.payload.isOpen,
            data: action.payload.data,
          },
        },
      };
    default:
      return state;
  }
};

// Context
export const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (isLoading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const setUser = (user) => {
    dispatch({ type: ActionTypes.SET_USER, payload: user });
  };

  const setCardEntryWorkers = (workers) => {
    dispatch({ type: ActionTypes.SET_CARD_ENTRY_WORKERS, payload: workers });
  };

  const toggleModal = (modal, isOpen, data = null) => {
    dispatch({
      type: ActionTypes.TOGGLE_MODAL,
      payload: { modal, isOpen, data },
    });
  };

  const value = {
    state,
    setLoading,
    setError,
    setUser,
    setCardEntryWorkers,
    toggleModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
