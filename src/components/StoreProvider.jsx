import React, {createContext} from "react";

import Store from "./Store";

export const StoreContext= createContext();

const StoreProvider=({children})=>{

    return <StoreContext.Provider value={new Store()}>
        {children}
        </StoreContext.Provider>

}

export default StoreProvider;