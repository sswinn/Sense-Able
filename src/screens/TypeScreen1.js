import { useState } from "react";
import { View, Pressable, Text, Button } from "react-native";
import { GestureHandlerRootView, TouchableOpacity, TouchableHighlight, RectButton } from "react-native-gesture-handler";

const TypeScreen = () => 
{
    const [text, setText] = useState("");

    let leftPressed = false;
    let rightPressed = false;

    const checkPressed = (callback) => {
        let status = "neither";
        if (leftPressed == true && rightPressed == true)
            status = "both";
        else if (leftPressed == true)
            status = "left";
        else if (rightPressed == true)
            status = "right";
        else
            status = "neither";
        callback(status)
    }

    return(
        <GestureHandlerRootView>
            <Text style = {{fontSize: 30}}>{text}</Text>
            {/*<TouchableOpacity 
                style = {{display: "flex", flexDirection: "row"}}
                onPress = {() => {
                        checkPressed((status) => {
                            setText(status);
                            leftPressed = false;
                            rightPressed = false;
                        }
                    )}
                }
            >   */}
            <View style = {{display: "flex", flexDirection: "row"}}>
                <View style = {{flex: 1}}>
                    <RectButton
                    onPress = {() => {console.log("LEFTPRESSED")}}
                        exclusive = {false}
                        /*delayLongPress = {250}
                        onPressIn = {() => {
                            console.log("leftpressed");
                            leftPressed = true;
                        }} 
                        onLongPress = {() => {
                            rightPressed = true;
                            leftPressed = true;
                        }}
                    >
                        <View 
                            accessibilityRole="button" accessible style = {{borderColor: "black", borderWidth: 2, backgroundColor: "gray", height: "100%", width: "100%"}}>
                        </View>
                    </RectButton>
                </View>
                <View style = {{flex: 1}}>
                    <RectButton
                        onPress = {() => {console.log("RIGHTPRESSED")}}
                        
                        exclusive = {false}
                        /*delayLongPress = {250}
                        onPressIn = {() => {
                            console.log("rightpressed");
                            rightPressed = true;
                        }}
                        onLongPress = {() => {
                            rightPressed = true;
                            leftPressed = true;
                        }}*/
                    >
                        <View accessibilityRole="button" accessible style = {{borderColor: "black", borderWidth: 2, backgroundColor: "gray", height: "100%", width: "100%"}}>
                        </View>
                    </RectButton>
                </View>
            </View>
            {/*</TouchableOpacity>*/}
            <TouchableOpacity
                style = {{position: "absolute", bottom:0, width: "100%", height: "100%",  backgroundColor: "red", zIndex: 999}}   
                onPress = {() => console.log("BIGPRESS")} 
            >
                <View>

                </View>
            </TouchableOpacity>
        </GestureHandlerRootView>
    )
}

export default TypeScreen;