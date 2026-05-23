import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { Stack } from "expo-router";
import { StackScreen } from "expo-router/build/layouts/stack-utils";
import { colors } from "../constants/colors";

const RootLayout = () => {

const colorscheme  = useColorScheme()
const theme = colors[colorscheme] ?? colors.light

    return (<Stack screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: theme.navBackground,
        },
    }}>
        <StackScreen name="index" options={{title: "Home", headerShown: false}}>

        </StackScreen>
    </Stack>)
}
export default RootLayout