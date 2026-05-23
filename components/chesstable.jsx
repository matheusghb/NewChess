import { View, ScrollView, useColorScheme, Text } from 'react-native'
import { colors } from '../constants/colors'
import TableLines from './tablecomponents/tablelines'

const ChessTable = (colunas = 8, linhas = 8) => {
    const colorscheme = useColorScheme()
    const theme = colors[colorscheme] ?? colors.light
    console.log(colunas,linhas)

    return (
        <View style={{
            width: '90%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <ScrollView style={{width:'100%', height:'100%'}} contentContainerStyle={{flexGrow: 1,justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView horizontal={true} style={{width:'100%', height:'100%'}} contentContainerStyle={{flexGrow: 1,justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <TableLines/>
                    <TableLines/>
                    <TableLines/>
                    <TableLines/> 
                    <TableLines/>     
                    <TableLines/>
                    <TableLines/>
                    <TableLines/>      
                    <TableLines/> 
                </ScrollView>                
            </ScrollView>


        </View>
    )
}
export default ChessTable