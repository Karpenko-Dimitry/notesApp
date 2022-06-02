import React, {createContext, useState, useMemo} from "react";

export const popupContext = createContext();

const { Provider } = popupContext;

export const PopupProvider = ({children}) => {
    const [name, setName] = useState('');

    const popupData = useMemo(() => ({
        setPopup: (name) => setName(name),
        popupName: name
    }));

    return (
        <Provider value={popupData}>{children}</Provider>
    )
}

export default { popupContext, PopupProvider };