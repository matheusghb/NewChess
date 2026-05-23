import { View } from 'react-native'

const Square = ({style}) => {

    return (
        <View style={[{
            minWidth: 40,
            flex: 1,
            aspectRatio: 1,
            borderWidth: 7,
            borderColor: '#000',
            borderStyle: 'solid',
        },style]}/>
    )
}

export default Square