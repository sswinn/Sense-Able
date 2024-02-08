import { FlatList, Vibration, View, TextInput } from "react-native";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import CustomGestureDetector from "../components/CustomGestureDetector";
import GlobalStyles from "../components/GlobalStyles";
import { useContext, useEffect, useMemo, useState } from "react";
import ListCard from "../components/ListCard";
import GestureDetectorLists from "../components/GestureDetectorLists";
import UserContext from "../contexts/UserContext";
import { auth } from "../data/FirebaseSetup";
import { validate } from "react-native-web/dist/cjs/exports/StyleSheet/validate";

const SettingsScreen = ({navigation}) =>
{

    const {state, updateSettings, updateSettingsState} = useContext(UserContext);
    const userSettings = state.find(item => item.uid === auth.currentUser.uid);

    const settingsList = [

        {
            name: "Language",
            values: ["Braille", "Morse"]
        }, 
        {
            name: "Vib Speed",
            values: [0.5, 0.75, 1, 1.25, 1.5]
        },
        {
            name: "Trailing Empties",
            values: ["On", "Off"]
        },
        {
            name: "Display Length",
            values: [10, 20, 30, 40, 60]
        }
    
    ]

    const toSettingFormat = (name) =>
    {
        return name.replace(" ", "_").toLowerCase();
    }

    const [selected, setSelected] = useState(0);
    const [selectedVal, setSelectedVal] = useState(userSettings[toSettingFormat(settingsList[selected].name)])

    useEffect(() => {
        setSelectedVal(userSettings[toSettingFormat(settingsList[selected].name)])
    }, [userSettings, selected, selectedVal])

    const tapFunction = useMemo(() => 
        Gesture.Tap()
            .maxDelay(0)
            .onStart((event) => {

                const valueList = settingsList[selected].values
                const valIndex = valueList.indexOf(selectedVal);

                if (valIndex >= 0)
                {
                    Vibration.vibrate(10);
                    const newIndex = valIndex +1 >= valueList.length ? 0 : valIndex +1;
                    updateSettings(
                        userSettings.id,
                        userSettings.uid,
                        settingsList[0].values.includes(selectedVal) ? valueList[newIndex] : userSettings.language,
                        settingsList[1].values.includes(selectedVal) ? valueList[newIndex] : userSettings.vib_speed,
                        settingsList[2].values.includes(selectedVal) ? valueList[newIndex] : userSettings.trailing_empties,
                        settingsList[3].values.includes(selectedVal) ? valueList[newIndex] : userSettings.display_length,
                        userSettings.phrases,
                    )
                }
            })
    )

    return (
        <GestureHandlerRootView style = {GlobalStyles.listRootView}>
            <GestureDetectorLists 
                extra = {[tapFunction]}
                navigation = {navigation}
                textToVibrate = {settingsList[selected].name + " " + selectedVal}
                list = {settingsList}
                selected = {selected}
                setSelected = {setSelected}
            >

                <FlatList
                    style = {GlobalStyles.list}
                    data = {settingsList}
                    keyExtractor = {item => settingsList.indexOf(item)}
                    renderItem = {({item}) => {
                        return(
                            <ListCard
                                name = {item.name}
                                selected = {settingsList[selected].name}
                                values = {item.values}
                            />
                        )
                    }}
                />

            </GestureDetectorLists>
        </GestureHandlerRootView>
    )
}

export default SettingsScreen;