import { View } from 'react-native'
import Square from './tablesquares'

const TableLines = ({style}) => {
    return (
        <View style={[{
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center'
            },
            style
            ]}>
            
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />
            
        </View>
    )
}
export default TableLines