import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { createContext, useReducer } from "react";
import { db } from "../data/FirebaseSetup";

const UserContext = createContext();

const settingsDb = collection(db, "UserSettings");

let data = [];

const reducer = (state, action) =>
{
    switch (action.type) {
        case "addSettingsState":
            return [
                ...state,
                {
                    id: action.payload.id,
                    uid: action.payload.uid,
                    language: action.payload.language,
                    vib_speed: action.payload.vib_speed,
                    trailing_empties: action.payload.trailing_empties,
                    display_length: action.payload.display_length,
                    phrases: action.payload.phrases
                }
            ];
        case "updateSettingsState":
            return state.map((settings) => {
                if (settings.id === action.payload.id) {
                    return action.payload;
                } else {
                    return settings;
                }
            });
        case "deleteSettingsState":
            return state.filter((settings) => settings.id !== action.payload.id);
        default:
            console.log("default");
            return state;
    }
}

export const UserProvider = ({children}) => 
{

    const [state, dispatch] = useReducer(reducer, data);

    const getSettings = (uid) =>
    {
        const settings = state.find((item) => item.uid === uid);
        
        const chosen_code = settings.language;

        const short_vib = 70 /settings.vib_speed;
        const long_vib = short_vib *3;
        const short_break = short_vib -1;
        const long_break = long_vib -1;
        const word_break = short_vib *7 -1;

        const trailing_empties = settings.trailing_empties;

        const display_length = settings.display_length;
        
        const phrases = settings.phrases;
    
        const Settings = 
        {
            ID: settings.id,
            UID: settings.uid,
            LANGUAGE: chosen_code,
            SHORT_VIB: short_vib,
            LONG_VIB: long_vib,
            SHORT_BREAK: short_break,
            LONG_BREAK: long_break,
            WORD_BREAK: word_break,
            TRAILING_EMPTIES: trailing_empties,
            DISPLAY_LENGTH: display_length,
            PHRASES: phrases, 
        };

        return Settings
    }

    const getSettingsFromDb = async (uid, callback) =>
    {
        try {
            const initialData = await getDocs(settingsDb);
            const data = initialData.docs.map((doc) => ({
                ...doc.data(), id: doc.id
            }));
            const settings = data.find((doc) => doc.uid === uid);
            if (callback) callback(settings)
        } catch (e) {
            console.log(e);
        }
    }

    const addSettingsState = (id, uid, language, vib_speed, trailing_empties, display_length, phrases, callback) =>
    {
        if (!state.find((settings) => settings.id === id))
        {
            dispatch({ 
                type: "addSettingsState",
                payload: {id, uid, language, vib_speed, trailing_empties, display_length, phrases}
            });
        }
        if (callback) callback();
    }

    const addSettings = async (uid, callback) =>
    {
        let docId;
        try {
            await addDoc(settingsDb, {
                uid: uid,
                language: "Braille",
                vib_speed: 1,
                trailing_empties: "Off",
                display_length: 20,
                phrases: [],
            })
            .then((docRef) => {
                docId = docRef.id;
            })
            addSettingsState(docId, uid, "Braille", 1, "Off", []);
        } catch (e) {
            console.log(e);
        }
        if (callback) callback();
    }

    const updateSettingsState = (id, uid, language, vib_speed, trailing_empties, display_length, phrases, callback) =>
    {
        dispatch({
            type: "updateSettingsState",
            payload: {id, uid, language, vib_speed, trailing_empties, display_length, phrases}
        });
        if (callback) callback();
    }

    const updateSettings = async (id, uid, language, vib_speed, trailing_empties, display_length, phrases, callback) =>
    {
        const settings = state.find((item) => uid === item.uid);
        try {
            const thisDoc = doc(db, "UserSettings", settings.id);
            await updateDoc(thisDoc, {
                uid: uid,
                language: language,
                vib_speed: vib_speed,
                trailing_empties: trailing_empties,
                display_length: display_length,
                phrases: phrases,
            });
        } catch (e) {
            console.log(e);
        }
        updateSettingsState(id, uid, language, vib_speed, trailing_empties, display_length, phrases);
        if (callback) callback();
    }

    const deleteSettingsState = (id, callback) =>
    {
        dispatch({ type: "deleteProfileState", payload: {id} });
        if (callback) callback();
    }

    return (
        <UserContext.Provider
            value = {{
                state: state,
                getSettings: getSettings,
                getSettingsFromDb: getSettingsFromDb,
                addSettingsState: addSettingsState,
                addSettings: addSettings,
                updateSettingsState: updateSettingsState,
                updateSettings: updateSettings,
                deleteSettingsState: deleteSettingsState,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;