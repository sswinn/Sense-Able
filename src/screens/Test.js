import React, { useState } from "react";
import { Button, Platform, StyleSheet, SliderComponent, TextInput, Vibration, View, FlatList, Image, Text, Pressable } from "react-native";
import TactileDisplay from "../components/TactileDisplay";
import Characters from "../data/Dictionary";
import Vibs from "../data/UserSettings";


const CHARACTERS = Characters;
const VIBS = Vibs;


// MORSE: the length of a dot is 1 unit, a dash is 3 units, the space between parts of the same letter is 1 unit, the space between letters is 3 units, the space between words is 7 units

/*const CHARACTERS = [
    {Char: "A", Braille: "100000", Morse: ".-", TactileImg: require("../../assets/TactileSigning/A.png")},
    {Char: "B", Braille: "110000", Morse: "-...", TactileImg: require("../../assets/TactileSigning/B.png")},
    {Char: "C", Braille: "100100", Morse: "-.-.", TactileImg: require("../../assets/TactileSigning/C.png")},
    {Char: "D", Braille: "100110", Morse: "-..", TactileImg: require("../../assets/TactileSigning/D.png")},
    {Char: "E", Braille: "100010", Morse: ".", TactileImg: require("../../assets/TactileSigning/E.png")},
    {Char: "F", Braille: "110100", Morse: "..-.", TactileImg: require("../../assets/TactileSigning/F.png")},
    {Char: "G", Braille: "110110", Morse: "--.", TactileImg: require("../../assets/TactileSigning/G.png")},
    {Char: "H", Braille: "110010", Morse: "....", TactileImg: require("../../assets/TactileSigning/H.png")},
    {Char: "I", Braille: "010100", Morse: "..", TactileImg: require("../../assets/TactileSigning/I.png")},
    {Char: "J", Braille: "010110", Morse: ".---", TactileImg: require("../../assets/TactileSigning/J.png")},
    {Char: "K", Braille: "101000", Morse: "-.-", TactileImg: require("../../assets/TactileSigning/K.png")},
    {Char: "L", Braille: "111000", Morse: ".-..", TactileImg: require("../../assets/TactileSigning/L.png")},
    {Char: "M", Braille: "101100", Morse: "--", TactileImg: require("../../assets/TactileSigning/M.png")},
    {Char: "N", Braille: "101110", Morse: "-.", TactileImg: require("../../assets/TactileSigning/N.png")},
    {Char: "O", Braille: "101010", Morse: "---", TactileImg: require("../../assets/TactileSigning/O.png")},
    {Char: "P", Braille: "111100", Morse: ".--.", TactileImg: require("../../assets/TactileSigning/P.png")},
    {Char: "Q", Braille: "111110", Morse: "--.-", TactileImg: require("../../assets/TactileSigning/Q.png")},
    {Char: "R", Braille: "111010", Morse: ".-.", TactileImg: require("../../assets/TactileSigning/R.png")},
    {Char: "S", Braille: "011100", Morse: "...", TactileImg: require("../../assets/TactileSigning/S.png")},
    {Char: "T", Braille: "011110", Morse: "-", TactileImg: require("../../assets/TactileSigning/T.png")},
    {Char: "U", Braille: "101001", Morse: "..-", TactileImg: require("../../assets/TactileSigning/U.png")},
    {Char: "V", Braille: "111001", Morse: "...-", TactileImg: require("../../assets/TactileSigning/V.png")},
    {Char: "W", Braille: "010111", Morse: ".--", TactileImg: require("../../assets/TactileSigning/W.png")},
    {Char: "X", Braille: "101101", Morse: "-..-", TactileImg: require("../../assets/TactileSigning/X.png")},
    {Char: "Y", Braille: "101111", Morse: "-.--", TactileImg: require("../../assets/TactileSigning/Y.png")},
    {Char: "Z", Braille: "101011", Morse: "--..", TactileImg: require("../../assets/TactileSigning/Z.png")},

];*/

const noTrailingEmpties = true;

function findCharacter(char)
{
    let returnChar = CHARACTERS.find(
        (item) => item.Char === char.toUpperCase()
    );
    return returnChar;
}

/*function findImage(char)
{
    let image = IMAGES + char.Char + ".png')";
    return image;
}*/

function toVibPattern(code)
{
    console.log("translating pattern");
    let vibArray = [0];
    console.log(code);

    for (let i = 0; i < code.length; i++)
    {
        let char = code.charAt(i);

        if (char === "-" || char === "1")
        {
            vibArray = vibArray.concat([VIBS.LONG_VIB]);
        }
        else if (char === "." || char === "0")
        {
            vibArray = vibArray.concat([VIBS.SHORT_VIB]);
        }
        
        if (char === " ")
        {
            vibArray[vibArray.length -1] = VIBS.LONG_BREAK;
        }
        else if (char === "|")
        {
            vibArray.splice(vibArray.length -1, 1);
            vibArray = vibArray.concat([VIBS.WORD_BREAK]);
        }
        else
        {
            vibArray = vibArray.concat([VIBS.SHORT_BREAK]);
        }
    }
    console.log(vibArray);
    console.log("translated pattern");
    return vibArray;
}

function removeTrailingEmpties(braille)
{
    console.log("removing trailing empties");
    let newBraille = braille;

    for (let i = braille.length -1; i >= 0; i--)
    {
        if (braille.charAt(i) === "1")
        {
            newBraille = braille.substring(0, i+1);
            break;
        }
    }
    console.log("removed trailing empties");
    return newBraille;
}

function handleVibrate(str, type)
{
    console.log("handling vibrate");
    let currentChar;
    let brailleOrMorse;
    let concatString = "";

    if (Platform.OS === "android" && str.length > 0 && type) 
    {
        for (let i = 0; i < str.length; i++)
        {
            currentChar = findCharacter(str.charAt(i));

            if (currentChar)
            {
                brailleOrMorse = currentChar[type];

                if (type === "Braille" && noTrailingEmpties === true) 
                {
                    brailleOrMorse = removeTrailingEmpties(brailleOrMorse);
                }

                concatString += brailleOrMorse + " ";
            }
            else if (str.charAt(i) === " ")
            {
                concatString += "|";
            }
        }
        let translatedArray = toVibPattern(concatString);
        Vibration.vibrate(translatedArray);
        console.log("handled vibrate");
    }
}

function getImages(str)
{
    let words = str.split(" ");
    let wordArray = [];
    let letterId = 0;
    let wordId = 0;

    words.forEach(word => {
        let letterArray = [];
        for (let i = 0; i < word.length; i++)
        {
            let charString = word.charAt(i);
            let char = findCharacter(charString);
            
            if (char)
            {
                let img = char.TactileImg;

                let newLetter = {
                    id: letterId, 
                    img: img,
                    string: charString
                };

                letterArray.push(newLetter);
                letterId += 1;
            }
        }
        console.log(letterArray);

        let newWord = {
            id: wordId, 
            letters: letterArray,
            string: word
        };

        console.log(newWord.letters[0]);
        wordArray.push(newWord);
        wordId += 1;
    });
    return wordArray;
}

let leftColour = "lightblue";
let rightColour = "lightblue";

function updateButtonColours(arr, i)
{
    const onColour = "cornflowerblue";
    const offColour = "lightblue";

    leftColour = onColour; rightColour = onColour;
    
    if (i == arr.length-1)
    {
        rightColour = offColour;
    }
    if (i == 0)
    {
        leftColour = offColour;
    }

}

function iterateWord(words, moveBy, currentIndex)
{
    let newIndex = currentIndex + moveBy;
    if (newIndex < words.length && newIndex >= 0)
    {
        currentIndex = newIndex;
    }
    return currentIndex;
}

function ifWords(w, currentIndex)
{
    if (w && w.length > 0 && w.length > currentIndex) {

        updateButtonColours(w, currentIndex);

        return (
            <FlatList
                numColumns = {3}
                data = {w[currentIndex].letters}
                keyExtractor = {item => item.id}
                renderItem = {({item}) => 
                    <View>
                        <Image source = {item.img} style = {styles.tactileImage} />
                    </View>
                }   
            />
        );
    }
    //return w;
}

const Test = () => {

    const [text, setText] = useState("");
    const [wordsImgsArray, setWordsImgsArray] = useState([{id: -1, img: "none", string: "NULL"}]);
    const [currIndex, setCurrIndex] = useState(0);

    return(
        <View style = {styles.itemContainer} >
            <TextInput 
                style = {styles.textInput}
                clearTextOnFocus = {true}
                value = {text}
                placeholder = "Type Here"
                onChangeText = {(text) => {
                    setText(text);
                    setWordsImgsArray(getImages(text));
                }}
            />
            <Button title = "braille" onPress = {() => handleVibrate(text, "Braille") } />
            <Button title = "morse" onPress = {() => handleVibrate(text, "Morse") } />
            <Button title = "cancel" onPress={() => Vibration.cancel()} />
            
            {ifWords(wordsImgsArray, currIndex)}

            <View style = {{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>

                <Pressable style = {{flex: 1}} 
                    onPress = {() => setCurrIndex(iterateWord(wordsImgsArray, -1, currIndex))}> 
                    <Text style = {[styles.bottomBarText, {backgroundColor: leftColour}]} > {"<"} </Text>
                </Pressable>

                <Text style = {[styles.bottomBarText, {backgroundColor: "gainsboro", flex: 2}]}>
                    {wordsImgsArray[currIndex].string.toUpperCase()}
                </Text>

                <Pressable style = {{flex: 1}} 
                    onPress = {() => setCurrIndex(iterateWord(wordsImgsArray, 1, currIndex))}> 
                    <Text style = {[styles.bottomBarText, {backgroundColor: rightColour}]} > {">"} </Text>
                </Pressable>

            </View>
        </View> 
    );
};

const styles = StyleSheet.create({
    textInput: {
        textAlign: "center",
        height: 50,
        width: "100%",
        fontSize: 20,
        borderWidth: 1,
        padding: 10
    },
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

export default Test;