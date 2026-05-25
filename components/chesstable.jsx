import { View, ScrollView, StyleSheet, Text } from 'react-native'
import { colors } from '../constants/colors'

const theme = colors['light'] 

const ll = []
const cl = []
let cflag = true

for (let c = 0; c < 8; c++) {

    let bgcolor = ''
    
    if (cflag == true) {
        bgcolor = theme.darkcolum
    } else {
        bgcolor = theme.lightcolum
    }

    console.log(cflag)

    if (c != 7) {
        cflag = !cflag
    }

    cl.push( {
        key: 'square'+(c+1),
        bgcolor: bgcolor
    })

}

for (let l = 0; l < 8; l++) {

    ll.push({
        key: 'line'+(l+1),
        columns: cl
    })

}

const ChessTable = (colunas = 8, linhas = 8) => {
    
    const Square = ({ style }) => (
        <View style={[{
            maxWidth: 100,
            minWidth: 40,
            flex: 1,
            aspectRatio: 1,
        }, style]}/>
    )

    const TableLines = ({children}) => (
        <View style={{
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center',
            }}
        >   
            {children}
        </View>
    )

    return (
        <View style={{
            width: '90%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <ScrollView style={{width:'100%', height:'100%'}} contentContainerStyle={{flexGrow: 1,justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView horizontal={true} style={{width:'100%', height:'100%'}} contentContainerStyle={{flexGrow: 1,justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    {ll.map((line) => {
                        return (
                            <TableLines key={line.key}>
                                {cl.map((column) => {
            
                                    return (
                                        <Square key={column.key} style={{backgroundColor: column.bgcolor}}></Square>
                                    )
                                })}
                            </TableLines>
                        )
                    })}
                </ScrollView>                
            </ScrollView>


        </View>
    )
}
export default ChessTable