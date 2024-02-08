import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({

    list: {
        backgroundColor: "lightblue", 
        padding: 20, 
        flexGrow: 1
    },
    listRootView: {
        height: "100%", 
        width: "100%", 
        paddingHorizontal: 30, 
        paddingVertical: 100
    },
    text: {
        fontSize: 30
    },
    textInput: {
        backgroundColor: "white",
        textAlign: "center",
        height: 50,
        width: "100%",
        fontSize: 20,
        borderWidth: 1,
        padding: 10,
    },
})

export default GlobalStyles;