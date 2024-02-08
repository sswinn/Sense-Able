import { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import UserContext from "../contexts/UserContext";
import { auth } from "../data/FirebaseSetup";

const ListCard = ({navigation, name, selected, values}) =>
{

    const {state} = useContext(UserContext);
    const userSettings = state.find(item => item.uid === auth.currentUser.uid);

    const valuesRender = () =>
    {
        if (values) { // if additional values are passed through props (optional)
            useEffect(() => {
                setSelectedVal(userSettings[name.replace(" ", "_").toLowerCase().toString()])
            }, [userSettings])

            const [selectedVal, setSelectedVal] = useState(userSettings[name.replace(" ", "_").toLowerCase().toString()]);

            return(
                <FlatList
                    horizontal = {true}
                    scrollEnabled = {false}
                    data = {values}
                    keyExtractor = {item => values.indexOf(item)}
                    renderItem = {({item}) => {
                        return(
                            <ListCard
                                name = {item}
                                selected = {selectedVal}
                            />
                        )
                    }}
                />
            )
        }
    }

    return(
        <View style = {{marginBottom: 20}}>
            <View style = {{backgroundColor: name === selected ? "darkgray" : "lightgray", padding: 10}}>
                <Text style = {{fontSize: 30}}>{name}</Text>
            </View>
            {valuesRender()}
        </View>
    );
}

export default ListCard;