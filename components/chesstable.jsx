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
    // two circle positions. Defaults: bottom-left and top-right.
    const [whiteCircle, setWhiteCircle] = useState(() => ({ r: linhas - 1, c: 0 }))
    const [blackCircle, setBlackCircle] = useState(() => ({ r: 0, c: colunas - 1 }))

    const getSquareColor = (r, c, baseColor) => {
        // highlight squares occupied by either circle
        if (whiteCircle && whiteCircle.r === r && whiteCircle.c === c) return 'blue'
        if (blackCircle && blackCircle.r === r && blackCircle.c === c) return 'blue'
        // highlight forward neighbors in red
        const isBottomForward = whiteCircle && (r === whiteCircle.r - 1) && Math.abs(c - whiteCircle.c) <= 1 && !(blackCircle && blackCircle.r === r && blackCircle.c === c)
        const isTopForward = blackCircle && (r === blackCircle.r + 1) && Math.abs(c - blackCircle.c) <= 1 && !(whiteCircle && whiteCircle.r === r && whiteCircle.c === c)
        if (isBottomForward || isTopForward) return 'red'
        return baseColor
    }
    
    const Square = ({ style, onPress, disabled, children }) => (
        <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={[{
            maxWidth: 100,
            minWidth: 40,
            flex: 1,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }, style]}>
            {children}
        </TouchableOpacity>
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

    const styles = StyleSheet.create({
        circlewhite: {
            zIndex: 1,
            width: '40%',
            aspectRatio: 1,
            borderRadius: 999,
            borderWidth: 3,
            borderColor: '#000',
            backgroundColor: colors.peon2,
        },
        circleblack: {
            zIndex: 1,
            width: '40%',
            aspectRatio: 1,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: '#fff',
            backgroundColor: colors.peon1,
        }
    })

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
                            {line.columns.map((column) => {
                                const r = column.rIndex
                                const c = column.cIndex
                                const base = column.bgcolor
                                const color = getSquareColor(r, c, base)
                                // valid forward moves:
                                const checkWhiteMove = whiteCircle && (r === whiteCircle.r - 1) && Math.abs(c - whiteCircle.c) <= 1 && !(blackCircle && blackCircle.r === r && blackCircle.c === c)
                                const checkBlackMove = blackCircle && (r === blackCircle.r + 1) && Math.abs(c - blackCircle.c) <= 1 && !(whiteCircle && whiteCircle.r === r && whiteCircle.c === c)
                                const Available = checkWhiteMove || checkBlackMove
                                const isWhiteHere = whiteCircle && whiteCircle.r === r && whiteCircle.c === c
                                const isBlackHere = blackCircle && blackCircle.r === r && blackCircle.c === c
                                return (
                                    <Square
                                        key={column.key}
                                        onPress={checkWhiteMove ? () => setWhiteCircle({ r, c }) : checkBlackMove ? () => setBlackCircle({ r, c }) : undefined}
                                        disabled={!Available}
                                        style={{ backgroundColor: color }}
                                    >
                                        {isWhiteHere && (
                                            <View style={styles.circle} />
                                        )}
                                        {isBlackHere && (
                                            <View style={styles.circle2} />
                                        )}
                                    </Square>
                                )
                            })}
                        </TableLines>
                    ))}
                </ScrollView>                
            </ScrollView>


        </View>
    )
}
export default ChessTable