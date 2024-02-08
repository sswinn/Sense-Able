import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TypeScreen1 from './src/screens/TypeScreen1';
import "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TypeScreen2 from './src/screens/TypeScreen2';
import TypeScreen from './src/screens/TypeScreen';
import { GestureProvider } from './src/contexts/GestureContext';
import ManualTranslateScreen from './src/screens/ManualTranslateScreen';
import MenuScreen from './src/screens/MenuScreen';
import { VibrateProvider } from './src/contexts/VibrateContext';
import LoginScreen from './src/screens/LoginScreen';
import { UserProvider } from './src/contexts/UserContext';
import { UserSettings } from './src/data/UserSettings'
import SettingsScreen from './src/screens/SettingsScreen';
import BufferScreen from './src/screens/BufferScreen';
import PhrasesScreen from './src/screens/PhrasesScreen';
import HelpScreen from './src/screens/HelpScreen';


const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <UserProvider>
      <VibrateProvider>
        <GestureProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName = "Login">
              <Stack.Screen
                name = "Login"
                component = {LoginScreen}
                options = {{title: "Login"}}
              />
              <Stack.Screen
                name = "Main Menu"
                component = { MenuScreen }
                options = {{title: "Main Menu"}}
              />
              <Stack.Screen
                name = "Manual Translation"
                component = { ManualTranslateScreen }
                options = {{title: "Text to Deafblind Manual"}}
              />
              <Stack.Screen
                name = "Braille Typing"
                component = { TypeScreen }
                options = {{title: "Braille Typing"}}
              />
              <Stack.Screen
                name = "Settings"
                component = { SettingsScreen }
                options = {{title: "User Settings"}}
              />
              <Stack.Screen
                name = "Buffer"
                component = { BufferScreen }
                options = {{title: "Buffer"}}
              />
              <Stack.Screen
                name = "Phrases"
                component = { PhrasesScreen }
                options = {{title: "Phrases"}}
              />
              <Stack.Screen
                name = "Help"
                component = { HelpScreen }
                options = {{title: "Help"}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureProvider>
      </VibrateProvider>
    </UserProvider>
  );

}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//triple finger tap for more info
//database for custom braille contractions