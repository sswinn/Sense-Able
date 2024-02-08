import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Platform, StyleSheet, SliderComponent, TextInput, Vibration, View, FlatList, Image, Text, Pressable } from "react-native";
import VibrateContext from "../contexts/VibrateContext";
import GestureContext from "../contexts/GestureContext";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import CustomGestureDetector from "../components/CustomGestureDetector";
import GlobalStyles from "../components/GlobalStyles";

// All Deafblind Manual diagrams are originally from the charity www.deafblind.org.uk

const ManualTranslateScreen = ({navigation}) => {

    const {findCharacter} = useContext(VibrateContext);

    const [text, setText] = useState("");
    const [imgArr, setImgArr] = useState([{id: -1, img: [], string: ""}]);
    const [currIndex, setCurrIndex] = useState(0);

    const getImages = (str) =>
    {
        let words = str.split(" ");
        let wordArray = [];

        words.forEach(word => {

            let letterArray = [];
            for (let i = 0; i < word.length; i++)
            {
                let charString = word.charAt(i);
                let char = findCharacter(charString);
                
                if (char && char.TactileImg)
                {
                    let img = char.TactileImg;
                    letterArray.push(img);
                }
            }
            let newWord = {
                letters: letterArray,
                string: word
            };
            wordArray.push(newWord);
        });
        setImgArr(wordArray);
    }

    const iterateWord = (moveBy) =>
    {
        let newIndex = currIndex + moveBy;
        if (newIndex < imgArr.length && newIndex >= 0)
            setCurrIndex(newIndex);
    }

    const checkLength = (str, callback) =>
    {
        let newText = str.replace(/\s\s+/g, ' ')
        let length = newText.split(" ").length;

        if (length <= currIndex) {
            setCurrIndex(length -1);
        }

        callback(newText);
    }

    return(
        <GestureHandlerRootView style = {styles.itemContainer} >
            <CustomGestureDetector 
                extra = {[]}
                navigation = {navigation}
                textToVibrate = {text}
            >
                <View style = {{flex: 1}}>
                    <TextInput 
                        style = {GlobalStyles.textInput}
                        clearTextOnFocus = {true}
                        value = {text}
                        placeholder = "Type your message here"
                        onChangeText = {(text) => {
                            checkLength(text, (newText) => {
                                setText(newText);
                                getImages(newText);
                            })
                        }}
                    />
                    
                    <FlatList
                        numColumns = {3}
                        data = {imgArr[currIndex].letters}
                        keyExtractor = {(item, index) => index}
                        renderItem = {({item}) => 
                            <View>
                                <Image source = {item} style = {styles.tactileImage} />
                            </View>
                        }   
                    />

                    <View style = {{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>

                        <Pressable style = {{flex: 1}} 
                            onPress = {() => iterateWord(-1)}> 
                            <Text style = {[styles.bottomBarText, {backgroundColor: currIndex == 0 ? "lightblue" : "cornflowerblue"}]} > {"<"} </Text>
                        </Pressable>

                        <Text style = {[styles.bottomBarText, {backgroundColor: "gainsboro", flex: 2}]}>
                            {imgArr[currIndex].string.toUpperCase()}
                        </Text>

                        <Pressable style = {{flex: 1}} 
                            onPress = {() => iterateWord(1)}> 
                            <Text style = {[styles.bottomBarText, {backgroundColor: currIndex >= imgArr.length -1 ? "lightblue" : "cornflowerblue"}]} > {">"} </Text>
                        </Pressable>

                    </View>
                </View>
            </CustomGestureDetector>
        </GestureHandlerRootView> 
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        height: "100%",
        width: "100%"
    },
    tactileImage: {
        height: 100,
        width: 120,
        resizeMode: "contain",
    },
    bottomBarText: {
        height: 60,
        padding: 10,
        fontSize: 25,
        textAlign: "center",
        fontWeight: "bold"
    }
});

export default ManualTranslateScreen;