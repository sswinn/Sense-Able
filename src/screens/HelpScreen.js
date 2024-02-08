import { View } from "react-native"
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import GestureDetectorLists from "../components/GestureDetectorLists";
import { useState } from "react";
import Instructions from "../data/Instructions";
import GlobalStyles from "../components/GlobalStyles";
import ListCard from "../components/ListCard";

const HelpScreen = ({navigation, route}) =>
{
    const list = Instructions;

    /*const {screen} = route.params;
    const currentScreen = list.includes(screen) ? list.indexOf(screen) : 0;*/

    const [selected, setSelected] = useState(0);

    return (
        <GestureHandlerRootView>
            <GestureDetectorLists
                navigation = {navigation}
                extra = {[]}
                textToVibrate = {list[selected]}
                list = {list}
                selected = {selected}
                setSelected = {setSelected}       
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
                        )
                    }}
                />
            </GestureDetectorLists>
        </GestureHandlerRootView>
    )
}

export default HelpScreen;