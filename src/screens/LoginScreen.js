import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { View, StyleSheet, Pressable, TextInput, Text } from "react-native";
import { auth } from "../data/FirebaseSetup";
import UserContext from "../contexts/UserContext";

const LoginScreen = ({navigation}) =>
{

    const {state, getSettingsFromDb, addSettingsState, addSettings} = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const getUserSettings = async (callback) => {
        try {
            await getSettingsFromDb(auth.currentUser.uid, (settings) => {
                addSettingsState(
                    settings.id,
                    settings.uid,
                    settings.language,
                    settings.vib_speed,
                    settings.trailing_empties,
                    settings.display_length,
                    settings.phrases,
                () => callback())
            })
        } catch (e) {
            console.log(e);
        }
    }

    const signIn = async () =>
    {
        console.log("Signing in...");
        try {
            await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                getUserSettings(() => {
                    console.log("Navigating");
                    navigation.navigate("Main Menu");
                });
            })
        } catch (e) {
            console.log(e);
        }
    }

    const signUp = async () =>
    {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                addSettings(auth.currentUser.uid, () => {
                    navigation.navigate("Main Menu");
                });
            })
        } catch (e) {
            console.log(e);
        }
    }

    return(
        <View style = {{flex: 1, padding: 50, justifyContent: "space-evenly"}}>
            <TextInput
                placeholder = "Email"
                style = {[styles.textInput, styles.text]}
                value = {email}
                onChangeText = {(text) => setEmail(text)}
            />
            <TextInput
                placeholder = "Password"
                secureTextEntry = {true}
                style = {[styles.textInput, styles.text]}
                password = {password}
                onChangeText = {(text) => setPassword(text)}
            />
            <Pressable 
                style = {[styles.pressable, {backgroundColor: "lightblue"}]}
                onPress = {() => {
                    signUp();
                }}
            >
                <Text style = {styles.text}>Create Account</Text>
            </Pressable>
            <Pressable 
                style = {[styles.pressable, {backgroundColor: "cornflowerblue"}]}
                onPress = {() => {
                    signIn();
                }}
            >
                <Text style = {styles.text}>Log In</Text>
            </Pressable>
            {/*<Pressable style = {[styles.pressable, {}]} onPress = {() => navigation.navigate("Main Menu")}>
                <Text style = {[styles.text, styles.hyperlink]}>Skip</Text>
            </Pressable>*/}
        </View>
    )
}

const styles = StyleSheet.create({
    pressable: {
        padding: 10,

    },
    text: {
        fontSize: 30,
        textAlign: "center"
    },
    hyperlink: {
        color: "blue"
    },
    textInput: {
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        backgroundColor: "white"
    }
})

export default LoginScreen;