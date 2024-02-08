import { useEffect, useRef, useState } from "react";
import { PanResponder, View, Dimensions, Text, Vibration } from "react-native";
import Characters from "../data/Dictionary";
import Vibs from "../data/UserSettings";

const TypeScreen2 = () =>
{

    const dimX = Dimensions.get("window").width;
    const dimY = Dimensions.get("window").height;

    const [string, setString] = useState("");

    let braille = "";

    const translate = () =>
    {
        if (braille.length >= 6 && braille.length % 6 === 0)
        {
            let tempString = "";
            for (let i = 0; i < braille.length; i += 6)
            {
                let thisBraille = braille.slice(i, i + 6);
                try {
                    let foundChar = Characters.find((item) => item.Braille === thisBraille);
                    tempString += foundChar.Char;
                } catch (e) {}
            }
            setString(tempString);
        }
    }

    useEffect(() => {
        if (braille.length % 6 === 0) Vibration.vibrate(Vibs.SHORT_VIB);
    }), [braille]

    setInterval(translate, 500);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (event, gesture) => true,
            onPanResponderStart: (event, gesture) =>
            {
                let touches = event.nativeEvent.touches;

                if (gesture.numberActiveTouches == 1 ) {
                    console.log("ONE TOUCH");

                    if (touches[0].locationX < dimX / 2) {
                        console.log("LEFT"); 
                        braille += "10";
                    } else {
                        console.log("RIGHT"); 
                        braille += "01"
                    }
                }

                else if (gesture.numberActiveTouches == 2) {
                    console.log("TWO TOUCHES");
                    braille = braille.slice(0, braille.length - 2);
                    braille += "11";
                } 
            },
            onPanResponderRelease: (event, gesture) =>
            {
                if (gesture.dy * -1 >= dimY / 10)
                {
                    console.log("SWIPE");
                    braille = braille.slice(0, braille.length - 2);
                    braille += "00";
                }
                else if (gesture.dx * -1 >= dimX / 5)
                {
                    console.log("SPACE");
                    braille = braille.slice(0, braille.length - 2);
                    if (braille.length % 6 === 0) braille += "000000";
                    else if ((braille.length -2) % 6 === 0) braille += "0000";
                    else if ((braille.length -4) % 6 === 0) braille += "00";
                    else console.log("Space error");
                }
            }
        })
    ).current;

    return (
        <View>
            <Text style = {{backgroundColor: "white", fontSize: 30}}>{string}</Text>
            <View 
                style = {{height: "100%", width: "100%"}} 
                {...panResponder.panHandlers}
            >
            </View>
            <View style = {{height: dimY, width: dimX, position: "absolute", flexDirection: "row", bottom: 0, zIndex: -50}}>
                <View
                    style = {{flex: 1, backgroundColor: "orange", borderColor: "black", borderWidth: 2}}
                >
                </View>
                <View
                    style = {{flex: 1, backgroundColor: "orange", borderColor: "black", borderWidth: 2}}
                >
                </View>
            </View>
        </View>
    );
}

export default TypeScreen2;