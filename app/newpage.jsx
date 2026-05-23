import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

const Newpage = () => {
    return (
        <View style={styles.container}>
            <Text>New page</Text>
            <Link href={'/.'}>Back to Home</Link>
        </View>
    )
}
export default Newpage
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})