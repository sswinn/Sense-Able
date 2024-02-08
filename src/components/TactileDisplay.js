import { View, Text, Image, StyleSheet } from "react-native";

const TactileDisplay = (uri) =>
{
    return(
        <Image source={ require( "../../assets/TactileSigning/A.png" /*uri*/)} style = {{ width: 200, height: 200}} />
    );
}

export default TactileDisplay;