import { createContext, useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import Characters from "../data/Dictionary";
import Settings from "../data/UserSettings";
import { Platform, Vibration } from "react-native";

const VibrateContext = createContext();

export const VibrateProvider = ({children}) => 
{

    const findCharacter = (char) =>
    {
        let returnChar = Characters.find(
            (item) => item.Char === char.toUpperCase() && char !== " "
        );
        return returnChar;
    }

    const toVibPattern = (code, Settings) =>
    {
        console.log("Translating pattern");
        let vibArray = [0];
        console.log(code);

        for (let i = 0; i < code.length; i++)
        {
            let char = code.charAt(i);

            if (char === "-" || char === "1")
            {
                vibArray = vibArray.concat([Math.round(Settings.LONG_VIB)]);
            }
            else if (char === "." || char === "0")
            {
                vibArray = vibArray.concat([Math.round(Settings.SHORT_VIB)]);
            }
            
            if (char === " ")
            {
                vibArray[vibArray.length -1] = Math.round(Settings.LONG_BREAK);
            }
            else if (char === "_")
            {
                vibArray.splice(vibArray.length -1, 1);
                vibArray = vibArray.concat([Math.round(Settings.WORD_BREAK)]);
            }
            else
            {
                vibArray = vibArray.concat([Math.round(Settings.SHORT_BREAK)]);
            }
        }
        console.log(vibArray);
        return vibArray;
    }

    const removeTrailingEmpties = (braille) =>
    {
        let newBraille = braille;

        for (let i = braille.length -1; i >= 0; i--)
        {
            if (braille.charAt(i) === "1")
            {
                newBraille = braille.substring(0, i+1);
                break;
            }
        }
        return newBraille;
    }

    const handleVibrate = (str, Settings) =>
    {
        let type = Settings.LANGUAGE;
        let empties = Settings.TRAILING_EMPTIES;
        let currentChar;
        let brailleOrMorse;
        let concatString = "";

        if (Platform.OS === "android" && str && str.length > 0 && type) 
        {
            console.log("Handling vibrate " + str + type);
            
            for (let i = 0; i < str.length; i++)
            {
                currentChar = findCharacter(str.charAt(i));

                if (currentChar)
                {
                    brailleOrMorse = currentChar[type];

                    if (type === "Braille" && empties === "Off") 
                    {
                        brailleOrMorse = removeTrailingEmpties(brailleOrMorse);
                    }

                    concatString += brailleOrMorse + " ";
                }
                else if (str.charAt(i) === " ")
                {
                    concatString += "_";
                }
            }
            let translatedArray = toVibPattern(concatString, Settings);
            Vibration.vibrate(translatedArray);
        }
    }

    return (
        <VibrateContext.Provider
            value = {{
                handleVibrate: handleVibrate,
                findCharacter: findCharacter
            }}
        >
            {children}
        </VibrateContext.Provider>
    );
}

export default VibrateContext;