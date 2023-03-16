import { createContext, Dispatch, ReactNode, FC, useReducer, useContext } from "react";
import { Poll } from "../types";
import { PollReducer, pollInitialState } from "../state/reducers/pollReducers";
import { PollActions } from "../state/actions/pollActions";

export const PollStateContext = createContext<Poll>(pollInitialState);
export const PollDispatchContext = createContext<Dispatch<PollActions>>(() => undefined);

interface PollProviderProps {
    children: ReactNode
}

export const PollProvider: FC<PollProviderProps> =({ children }) => {
    const [poll, dispatch] = useReducer(PollReducer, pollInitialState)
    return (
        <PollStateContext.Provider value={poll}>
            <PollDispatchContext.Provider value={dispatch}>
                {children}
            </PollDispatchContext.Provider>
        </PollStateContext.Provider>
    );
}

export const usePollState = () => {
    const context = useContext(PollStateContext);
    if(context === undefined){
        throw new Error("usePollState, must be used within an PollProvider");
    }
    return context;
}

export const usePollDispatch = () => {
    const context = useContext(PollDispatchContext);
    if(context === undefined){
        throw new Error("PollDispatchContext, must be used within an PollProvider");
    }
    return context;
}
