import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { PanResponder, View, Dimensions, Text, Vibration, Alert } from "react-native";
import Characters from "../data/Dictionary";
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import GestureContext from "../contexts/GestureContext";
import CustomGestureDetector from "../components/CustomGestureDetector";
import UserContext from "../contexts/UserContext";
import { auth } from "../data/FirebaseSetup";
import * as Speech from "expo-speech";

const TypeScreen = ({navigation, route}) =>
{


    const {state, updateSettings} = useContext(UserContext);
    const {Haptics} = useContext(GestureContext);

    const settings = state.find(item => item.uid === auth.currentUser.uid);

    const dimX = Dimensions.get("window").width;
    const dimY = Dimensions.get("window").height;

    const [string, setString] = useState("");
    const [arr, setArr] = useState([]);

    let brailleL = "";
    let brailleR = "";

    let fingersMoving = false;
    
    useEffect(() => {
        translate();
        if (arr.length > 0) Vibration.vibrate(70);
    }, [arr]);

    const doubleTapFunc = () =>
    {
        Vibration.vibrate(10);
        console.log("Double");
        brailleL += "1";
        brailleR += "1";
        checkLetter();
    }
   
    const translate = () =>
    {
        let tempString = "";
        console.log(arr);
        arr.forEach((letter) =>
        {
            try {
                let foundChar = Characters.find((item) => item.Braille === letter);
                tempString += foundChar.Char;
            } catch (e) {}
        });
        setString(tempString);
    }

    const checkLetter = () =>
    {
        let braille = brailleL + brailleR;
        if (braille.length === 6) {
            setArr(arr.concat([braille]));
            brailleL = "";
            brailleR = "";
            console.log(arr);
        }
    }

    const doubleTap = useMemo(() => 
        Gesture.Tap()
            .maxDuration(150)
            .maxDelay(0)
            .minPointers(2)
            .onStart((event) => {
                doubleTapFunc();
            })
    )

    const singleTap = useMemo(() =>
        Gesture.Tap()
            .maxDuration(150)
            .maxDelay(0)
            .onStart((event) => {
                Vibration.vibrate(10);
                if (event.absoluteX < dimX / 2) {
                    console.log("Left");
                    brailleL += "1";
                    brailleR += "0"
                } else {
                    console.log("Right");
                    brailleL += "0";
                    brailleR += "1"
                } 
                checkLetter();
            })
    )

    longPress = () => {
        console.log("Clear");
        setArr([]);
        Vibration.vibrate(210);
    }

    const nextSwipe = useMemo(() =>
        Gesture.Fling()
            .direction(Directions.RIGHT)
            .onStart((event) => {
                console.log("Next");
                brailleL += "000";
                brailleR += "000";
                brailleL = brailleL.slice(0,3);
                brailleR = brailleR.slice(0,3);
                let braille = brailleL + brailleR;
                setArr(arr.concat([braille]));
            })
    )

    const backSwipe = useMemo(() =>
        Gesture.Fling()
            .direction(Directions.LEFT)
            .onStart((event) => {
                console.log("Back");
                brailleL = "";
                brailleR = "";
            })
    )

    const doubleBackSwipe = useMemo(() =>
        Gesture.Fling()
            .direction(Directions.LEFT)
            .numberOfPointers(2)
            .onTouchesMove(() => fingersMoving = true)
            .onStart((event) => {
                if (fingersMoving === true) {
                    console.log("Backspace");
                    setArr(arr.splice(0, arr.length -1));
                } else {                
                    doubleTapFunc();
                }
            })
            .onEnd(() => fingersMoving = false)
    )

    const doubleForwardSwipe = useMemo(() =>
        Gesture.Fling()
            .direction(Directions.RIGHT)
            .numberOfPointers(2)
            .onTouchesMove(() => fingersMoving = true)
            .onStart((event) => {
                Speech.stop();
                if (fingersMoving === true) {
                    console.log("Speaking");
                    Vibration.vibrate(Haptics.SHORT);
                    Speech.speak(string.toLowerCase());
                } else {                
                    doubleTapFunc();
                }
            })
            .onEnd(() => fingersMoving = false)
    )
    
    const tripleForwardSwipe = useMemo(() =>
        Gesture.Fling()
            .direction(Directions.RIGHT)
            .numberOfPointers(3)
            .onTouchesMove(() => fingersMoving = true)
            .onStart((event) => {
                if (fingersMoving === true && string.length > 0 && !settings.phrases.includes(string)) {
                    console.log("Double forward")
                    updateSettings(
                        settings.id,
                        settings.uid,
                        settings.language,
                        settings.vib_speed,
                        settings.trailing_empties,
                        settings.display_length,
                        settings.phrases.concat([string]),
                        () => navigation.navigate("Phrases")
                    )
                } else {                
                    doubleTapFunc();
                }
            })
            .onEnd(() => fingersMoving = false)
    )

    const downSwipe = useMemo(() =>
        Gesture.Fling()
            .direction(Directions.DOWN)
            .onStart((event) => {
                console.log("Down");
                brailleL += "0";
                brailleR += "0";
                Vibration.vibrate(Haptics.SHORT);
                checkLetter();
            })
            .onEnd(() => fingersMoving = false)
    )

    return (
        <GestureHandlerRootView>
            <Text style= {{fontSize: 30}}>{string}</Text>
            <CustomGestureDetector 
                extra = {[/*pinch, */doubleForwardSwipe, tripleForwardSwipe, nextSwipe, doubleBackSwipe, backSwipe, downSwipe, doubleTap, singleTap]}
                navigation = {navigation}
                textToVibrate = {string}
                longPressFunc = {longPress}
            >
                <View style = {{height: "100%", width: "100%", backgroundColor: "grey", flexDirection: "row"}}>
                    <View style = {{flex: 1, borderColor: "black", borderWidth: 2}} />
                    <View style = {{flex: 1, borderColor: "black", borderWidth: 2}} />
                </View>
            </CustomGestureDetector>
        </GestureHandlerRootView>
    );
}

export default TypeScreen;