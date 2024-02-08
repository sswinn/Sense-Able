import { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import UserContext from "../contexts/UserContext";
import { auth } from "../data/FirebaseSetup";
import GlobalStyles from "../components/GlobalStyles";

const BufferScreen = ({navigation}) =>
{
    const {getSettings} = useContext(UserContext);

    const Settings = getSettings(auth.currentUser.uid);

    const screenLength = Settings.DISPLAY_LENGTH;

    const [text, setText] = useState("");
    const [slice, setSlice] = useState(screenLength);

    useEffect(() => {
        if (text.includes(";")) {
            setText(text.replace(";", ""));
            setSlice(slice + screenLength);
        }
    }, [text])

    return (
        <View>
            <TextInput
                style = {GlobalStyles.textInput}
                placeholder = "Type your message here"
                value = {text.slice(0, slice)}
                onChangeText = {(str) => {
                    // determine length of text and compare to display length
                    let subStr = text.length < slice ? text.length : slice
                    let lengthDiff = text.slice(0, slice).length - str.length;
                    // difference in length between existing text and new text determines
                    // whether a backspace is performed or whether to update the text with
                    // additional characters
                    if (lengthDiff > 0) setText(text.slice(0, text.length -lengthDiff));
                    else setText(text + str.slice(subStr));
                }}
            />
            <Text style = {GlobalStyles.text}>{text}</Text>
        </View>
    )
}

export default BufferScreen;