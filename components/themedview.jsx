import { View, useColorScheme } from 'react-native'
import { colors } from '../constants/colors'

const ThemedView = ({style, ...props}) => {
    const theme = colors['light'] 

    return (
        <View 
            
            style={[
                {backgroundColor: theme.background,
                    
            },style]} 
            {...props}
            
        />
    )
}
export default ThemedView