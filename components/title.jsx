import { View, useColorScheme, Text } from 'react-native'
import { colors } from '../constants/colors'

const Title = ({style, title_text, ...props}) => {
    const theme = colors['light'] 

    return (
        <View style={[{
            backgroundColor: theme.title,
            padding: 7,
            borderRadius: 10,

        },style]} {...props}>

            <Text style={[{color: theme.background, fontSize: 40}]}>{title_text}</Text>

        </View>
    )
}
export default Title