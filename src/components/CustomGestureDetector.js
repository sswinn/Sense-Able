import { useContext, useEffect } from "react";
import { Vibration } from "react-native";
import { GestureDetector,  Gesture } from "react-native-gesture-handler";
import GestureContext from "../contexts/GestureContext";
import VibrateContext from "../contexts/VibrateContext";
import UserContext from "../contexts/UserContext";
import { auth } from "../data/FirebaseSetup";
import { useRoute } from "@react-navigation/native";

const CustomGestureDetector = ({navigation, children, extra, textToVibrate, longPressFunc}) => 
{

    const {vibrateText, helpScreen, Haptics} = useContext(GestureContext);
    const {handleVibrate} = useContext(VibrateContext);
    const {getSettings} = useContext(UserContext);

    const Settings = getSettings(auth.currentUser.uid);
    const screenName = useRoute().name;

    const vibrateGesture = vibrateText(handleVibrate, textToVibrate, Settings);
    const longPress = helpScreen(screenName, navigation, longPressFunc ? longPressFunc : () => console.log("No long press"))

    useEffect(() => {
        navigation.addListener("focus", () => {
            Vibration.vibrate(Haptics.DOUBLE);
        });
    }, [navigation])

    return(
        <GestureDetector gesture = {Gesture.Exclusive(longPress, vibrateGesture, ...extra)}>
                {children}
        </GestureDetector>
    )
}

export default CustomGestureDetector;