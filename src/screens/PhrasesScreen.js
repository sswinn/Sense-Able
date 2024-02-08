import { FlatList, Vibration, View } from "react-native";
import { Directions, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import GestureDetectorLists from "../components/GestureDetectorLists";
import UserContext from "../contexts/UserContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../data/FirebaseSetup";
import GlobalStyles from "../components/GlobalStyles";
import ListCard from "../components/ListCard";
import * as Speech from "expo-speech";
import GestureContext from "../contexts/GestureContext";

const PhrasesScreen = ({navigation}) =>
{
    const {Haptics} = useContext(GestureContext);
    const {state, updateSettings} = useContext(UserContext);

    const settings = state.find((item) => item.uid === auth.currentUser.uid);

    const list = settings.phrases
    const [selected, setSelected] = useState(0);

    const speakPhrase = useMemo(() =>
        Gesture.Tap()
            .onStart((event) => {
                console.log("Speaking phrase");
                Speech.stop();
                if (list[selected]) {
                    Vibration.vibrate(Haptics.SHORT);
                    Speech.speak(list[selected].toLowerCase());
                }
            })
    )

    longPress = () => {
        if (list.length > 0 && list[selected]) {
            Vibration.vibrate(Haptics.LONG);
            updateSettings(
                settings.id,
                settings.uid,
                settings.language,
                settings.vib_speed,
                settings.trailing_empties,
                settings.display_length,
                list.filter(item => item !== list[selected]),
                () => setSelected(0)
            )
        }
    }

    const newPhrase = useMemo(() =>
        Gesture.Tap()
            .numberOfTaps(2) 
            .onStart((event) => {
                Vibration.vibrate(Haptics.DOUBLE);
                console.log("New phrase");
                navigation.navigate("Braille Typing");
            })
    )

    return (
        <GestureHandlerRootView style = {GlobalStyles.listRootView}>
            <GestureDetectorLists
                extra = {[newPhrase, speakPhrase]}
                list = {list}
                selected = {selected}
                setSelected = {setSelected}
                longPressFunc = {longPress}
                navigation = {navigation}
                textToVibrate = {list[selected] ? list[selected] : ""}
            >
                <FlatList
                    style = {GlobalStyles.list}
                    data = {list}
                    keyExtractor = {(item, index) => index}
                    renderItem = {({item}) => {
                        return (
                            <ListCard
                                name = {item}
                                selected = {list[selected]}
                            />
                        );
                    }}
                />
            </GestureDetectorLists>
        </GestureHandlerRootView>
    );
}

export default PhrasesScreen;