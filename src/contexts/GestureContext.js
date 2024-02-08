import { createContext, useCallback, useContext, useMemo } from "react";
import { Vibration } from "react-native";
import { Directions, Gesture } from "react-native-gesture-handler";

const GestureContext = createContext();

export const GestureProvider = ({children}) => 
{

    const Haptics = {LONG: 200, MED: 80, SHORT: 10, DOUBLE: [100, 100, 100, 100]}

    const backToMenu = (navigation) => {
        return(
            useMemo(() => Gesture.Pinch()
                .onStart((event) => {
                    console.log("Pinch");
                    navigation.navigate("Main Menu");
                })
            )
        )
    }

    const vibrateText = (vibFunction, text, settings) => {
        return(
            useMemo(() => Gesture.Fling()
                .direction(Directions.UP)
                .numberOfPointers(1)
                .onStart((event) => {
                    console.log("Vibration swipe");
                    vibFunction(text, settings);
                })
            )
        )
    }

    const cancelVibrate = () => {
        let ready = false
        return(
            useMemo(() => Gesture.Fling()
                .direction(Directions.UP)
                .numberOfPointers(2)
                .onTouchesMove(() => ready = true)
                .onStart((event) => {
                    if (ready) {
                        console.log("Vibration cancel swipe");
                        Vibration.cancel();
                    } else {                
                        console.log("Double");
                        brailleL += "1";
                        brailleR += "1";
                        checkLetter();
                    }
                })
            )
        )
    }
    
    const moreInfoList = (vibFunction, text, settings) => {
        return(
            useMemo(() => Gesture.Tap()
                .minPointers(3)
                .maxDelay(0)
                .onStart((event) => {
                    console.log("Triple");
                    vibFunction(text, settings);
                })
            )
        )
    }

    const selectBelow = (list, selected, setSelected) => {
        return(
            useMemo(() => Gesture.Fling()
                .direction(Directions.RIGHT)
                .onStart((event) => {
                    console.log("Swiped next");
                    if (!(selected +1 >= list.length)) {
                        setSelected(selected +1);
                        Vibration.vibrate(50);                        
                    }
                })
            )
        )
    }

    const selectAbove = (selected, setSelected) => {
        return(
            useMemo(() => Gesture.Fling()
                .direction(Directions.LEFT)
                .onStart((event) => {
                    console.log("Swiped previous");
                    if (!(selected -1 < 0)) {
                        setSelected(selected -1);
                        Vibration.vibrate(50);                        
                    }
                })
            )
        )
    }

    const helpScreen = (screen, navigation, func) => {
        return(
            useMemo(() => Gesture.LongPress()
                .minDuration(250)
                .onEnd((event) => {
                    if (event.duration > 1000) {
                        console.log("Help");
                        navigation.navigate("Help", {screen: screen});
                    } else {
                        func();
                    }
                })
            )
        )
    }

    return (
        <GestureContext.Provider
            value = {{
                backToMenu: backToMenu,
                moreInfoList: moreInfoList,
                vibrateText: vibrateText,
                cancelVibrate: cancelVibrate,
                selectBelow: selectBelow,
                selectAbove: selectAbove,
                helpScreen: helpScreen,
                Haptics: Haptics,
            }}
        >
            {children}
        </GestureContext.Provider>
    );
}

export default GestureContext;