import { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, Vibration, View } from "react-native";
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import ListCard from "../components/ListCard";
import UserContext from "../contexts/UserContext";
import GlobalStyles from "../components/GlobalStyles";
import GestureDetectorLists from "../components/GestureDetectorLists";

const MenuScreen = ({navigation}) =>
{
    const screens = ["Manual Translation", "Braille Typing", "Phrases", "Buffer", "Settings"]

    const [selected, setSelected] = useState(0);

    const {state} = useContext(UserContext);

    console.log(state);

    const navigateTo = useMemo(() =>
        Gesture.Tap()
            .maxDelay(0)
            .onStart((event) => {
                console.log("Navigating");
                navigation.navigate(screens[selected]);
                Vibration.vibrate(10);
            })
    )

    return(
        <GestureHandlerRootView style = {GlobalStyles.listRootView}>

            <GestureDetectorLists
                navigation = {navigation}
                extra = {[navigateTo]}
                textToVibrate = {screens[selected]}
                list = {screens}
                selected = {selected}
                setSelected = {setSelected}
            >
                <FlatList
                    style = {GlobalStyles.list}
                    data = {screens}
                    keyExtractor = {(item, index) => index}
                    renderItem = {({item}) => {
                        return(
                            <ListCard
                                name = {item}
                                selected = {screens[selected]}
                            />
                        )
                    }}
                />
            </GestureDetectorLists>

        </GestureHandlerRootView>
    );
}

export default MenuScreen;