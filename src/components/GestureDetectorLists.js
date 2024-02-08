import { useContext, useEffect } from "react";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import GestureContext from "../contexts/GestureContext";
import VibrateContext from "../contexts/VibrateContext";
import UserContext from "../contexts/UserContext";
import { auth } from "../data/FirebaseSetup";
import { Vibration } from "react-native";
import { useRoute } from "@react-navigation/native";

const GestureDetectorLists = ({navigation, children, extra, textToVibrate, list, selected, setSelected, longPressFunc}) => 
{

    const {selectAbove, selectBelow, moreInfoList, helpScreen, Haptics} = useContext(GestureContext);
    const {handleVibrate} = useContext(VibrateContext);
    const {getSettings} = useContext(UserContext);

    const Settings = getSettings(auth.currentUser.uid);
    const screenName = useRoute().name;

    const aboveGesture = selectAbove(selected, setSelected)
    const belowGesture = selectBelow(list, selected, setSelected);
    const tripleTap = moreInfoList(handleVibrate, textToVibrate, Settings);
    const longPress = helpScreen(screenName, navigation, longPressFunc ? longPressFunc : () => console.log("No long press"));

    useEffect(() => {
        navigation.addListener("focus", () => {
            Vibration.vibrate(Haptics.DOUBLE);
        });
    }, [navigation])

    return(
        <GestureDetector gesture = {Gesture.Exclusive(longPress, aboveGesture, belowGesture, tripleTap, ...extra)}>
                {children}
        </GestureDetector>
    )
}

export default GestureDetectorLists;