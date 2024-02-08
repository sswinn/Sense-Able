/*import { useContext } from "react";
import { auth } from "./FirebaseSetup";
import UserContext from "../contexts/UserContext";

const {state} = useContext(UserContext);
const settings = state[0];

const chosen_code = settings.language;

const short_vib = 70 * settings.speed;
const long_vib = short_vib *3;
const short_break = short_vib -1;
const long_break = long_vib -1;
const word_break = short_vib *7 -1;

const Settings = {

    LANGUAGE: chosen_code,
    SHORT_VIB: short_vib,
    LONG_VIB: long_vib,
    SHORT_BREAK: short_break,
    LONG_BREAK: long_break,
    WORD_BREAK: word_break,

};
// MOVE THIS TO USER CONTEXT AND PASS AS PARAMETER TO VIBRATE FUNCTION ETC
export default Settings;*/