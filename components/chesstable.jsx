import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { colors } from '../constants/colors'

const theme = colors['light']

const ChessTable = ({ colunas = 8, linhas =8
  } = {}) => {
   
    const rows = Array.from({ length: linhas }, (_, r) => ({
        key: 'line' + (r + 1),
        rIndex: r,
        columns: Array.from({ length: colunas }, (_, c) => ({
            key: `square${r + 1}-${c + 1}`,
            rIndex: r,
            cIndex: c,
            bgcolor: ((r + c) % 2 == 0) ? theme.darkcolum : theme.lightcolum
        }))
    }))
    const [selec, setSelec] = useState()

    const getSquareColor = (r, c, baseColor) => {
        if (!selec) return baseColor
        const sr = selec.r
        const sc = selec.c
        if (sr == r && sc == c) return 'blue'
        if (Math.abs(sr - r) <= 1 && Math.abs(sc - c) <= 1) return 'red'
        return baseColor
    }
    
    const Square = ({ style, onPress }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[{
            maxWidth: 100,
            minWidth: 40,
            flex: 1,
            aspectRatio: 1,
        }, style]} />
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
                    {rows.map((line) => (
                        <TableLines key={line.key}>
                            {line.columns.map((column) => (
                                <Square
                                    key={column.key}
                                    onPress={() => setSelec({ r: column.rIndex, c: column.cIndex })}
                                    style={{ backgroundColor: getSquareColor(column.rIndex, column.cIndex, column.bgcolor) }}
                                />
                            ))}
                        </TableLines>
                    ))}
                </ScrollView>                
            </ScrollView>


        </View>
    )
}
export default ChessTable