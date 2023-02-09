import React, { createContext, useReducer } from "react";

const DataContextCreator = (
    reducer, actions, initialState
) => {
    const Context = createContext({state: initialState});
    const Provider = ({children}) => {
        const [state, dispatch] = useReducer(reducer, initialState);
        const boundActions = {};
        for (let key in actions) {
            boundActions[key] = actions[key](dispatch);
        }
        const values = {state, ...boundActions};

        return <Context.Provider value={values}>{children}</Context.Provider>;
    }
    return {Context, Provider};
};

export default DataContextCreator;