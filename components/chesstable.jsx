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
            //cria o tabuleiro
        }))
    }))

    // coloca as units no lugar
    const initialBlack = Array.from({ length: linhas }).flatMap((_, r) => (r < 2 ? Array.from({ length: colunas }, (_, c) => ({ r, c })) : []))
    const initialWhite = Array.from({ length: linhas }).flatMap((_, r) => (r >= linhas - 2 ? Array.from({ length: colunas }, (_, c) => ({ r, c })) : []))

    const [whiteUnits, setWhiteUnits] = useState(() => initialWhite)
    const [blackUnits, setBlackUnits] = useState(() => initialBlack)
    const [selected, setSelected] = useState(null)
    const [turn, setTurn] = useState('white')

    const findUnitAt = (r, c) => {
        const wIndex = whiteUnits.findIndex(u => u.r == r && u.c == c)
        if (wIndex >= 0) return { color: 'white', index: wIndex }
        const bIndex = blackUnits.findIndex(u => u.r == r && u.c == c)
        if (bIndex >= 0) return { color: 'black', index: bIndex }
        return null
    }

    const tem = (r, c, color) => {
        return color == 'white'
            ? whiteUnits.some(u => u.r == r && u.c == c)
            : blackUnits.some(u => u.r == r && u.c == c)
    }

    const calcularMov = (r, c, baseColor) => {
        // mostra os movimentos possiveis para a unit selecionada (apenas 1 tile diagonal)
        if (selected && selected.color == 'white') {
            const unit = whiteUnits[selected.index]
            if (unit && unit.r == r && unit.c == c) return 'blue'
            const whiteDiag = unit && Math.abs(r - unit.r) == 1 && Math.abs(c - unit.c) == 1
            if (whiteDiag) {
                // If target empty -> valid move. If occupied by black -> check landing square for jump capture
                if (!tem(r, c, 'white') && !tem(r, c, 'black')) return 'red'
                if (tem(r, c, 'black')) {
                    const dr = r - unit.r
                    const dc = c - unit.c
                    const r2 = r + dr
                    const c2 = c + dc
                    const inside = r2 >= 0 && r2 < linhas && c2 >= 0 && c2 < colunas
                    if (inside && !tem(r2, c2, 'white') && !tem(r2, c2, 'black')) return 'red'
                }
            }
        }
        if (selected && selected.color == 'black') {
            const unit = blackUnits[selected.index]
            if (unit && unit.r == r && unit.c == c) return 'blue'
            const blackDiag = unit && Math.abs(r - unit.r) == 1 && Math.abs(c - unit.c) == 1
            if (blackDiag) {
                if (!tem(r, c, 'white') && !tem(r, c, 'black')) return 'red'
                if (tem(r, c, 'white')) {
                    const dr = r - unit.r
                    const dc = c - unit.c
                    const r2 = r + dr
                    const c2 = c + dc
                    const inside = r2 >= 0 && r2 < linhas && c2 >= 0 && c2 < colunas
                    if (inside && !tem(r2, c2, 'white') && !tem(r2, c2, 'black')) return 'red'
                }
            }
        }
        return baseColor
        // calcula as diagonais dos units e colore pra vermelho
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
            }}>

            {children}
        </View>
    )

    const styles = StyleSheet.create({
        BlackUnit: {
            zIndex: 1,
            width: '40%',
            aspectRatio: 1,
            borderRadius: 999,
            borderWidth: 3,
            borderColor: '#fff',
            backgroundColor: colors.peon2,
        },
        WhiteUnit: {
            zIndex: 1,
            width: '40%',
            aspectRatio: 1,
            borderRadius: 999,
            borderWidth: 3,
            borderColor: '#000',
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
                                const color = calcularMov(r, c, base)

                                const occupant = findUnitAt(r, c)
                                const checkWhitePos = occupant && occupant.color ==
                 'white'
                                const checkBlackPos = occupant && occupant.color ==
                 'black'

                                const checkWhiteMove = selected && selected.color == 'white' && (() => {
                                    const unit = whiteUnits[selected.index]
                                    if (!unit) return false
                                    const dr = r - unit.r
                                    const dc = c - unit.c
                                    if (Math.abs(dr) !== 1 || Math.abs(dc) !== 1) return false
                                    const occ = findUnitAt(r, c)
                                    if (!occ) return true // empty square
                                    // occupied: allow if opponent present and landing square is free and inside board
                                    if (occ.color == 'black') {
                                        const r2 = r + dr
                                        const c2 = c + dc
                                        const inside = r2 >= 0 && r2 < linhas && c2 >= 0 && c2 < colunas
                                        if (!inside) return false
                                        return !findUnitAt(r2, c2)
                                    }
                                    return false
                                })()
                                const checkBlackMove = selected && selected.color == 'black' && (() => {
                                    const unit = blackUnits[selected.index]
                                    if (!unit) return false
                                    const dr = r - unit.r
                                    const dc = c - unit.c
                                    if (Math.abs(dr) !== 1 || Math.abs(dc) !== 1) return false
                                    const occ = findUnitAt(r, c)
                                    if (!occ) return true
                                    if (occ.color == 'white') {
                                        const r2 = r + dr
                                        const c2 = c + dc
                                        const inside = r2 >= 0 && r2 < linhas && c2 >= 0 && c2 < colunas
                                        if (!inside) return false
                                        return !findUnitAt(r2, c2)
                                    }
                                    return false
                                })()
                                const Available = checkWhiteMove || checkBlackMove

                                // script para selecionar a unit por click (only current turn can select)
                                let onPress
                                if (checkWhitePos && turn === 'white') onPress = () => setSelected({ color: 'white', index: occupant.index })
                                else if (checkBlackPos && turn === 'black') onPress = () => setSelected({ color: 'black', index: occupant.index })
                                // move e deseleciona a unit
                                else if (checkWhiteMove) onPress = () => {
                                    const unit = whiteUnits[selected.index]
                                    if (!unit) return
                                    const dr = r - unit.r
                                    const dc = c - unit.c
                                    const occ = findUnitAt(r, c)
                                    if (occ && occ.color == 'black') {
                                        const r2 = r + dr
                                        const c2 = c + dc
                                        // perform jump and remove captured black unit
                                        setWhiteUnits(prev => { const next = [...prev]; next[selected.index] = { r: r2, c: c2 }; return next })
                                        setBlackUnits(prev => prev.filter(u => !(u.r == r && u.c == c)))
                                        setSelected({ color: 'white', index: selected.index })
                                        // capture -> retain turn (white continues)
                                        return
                                    } else {
                                        setWhiteUnits(prev => { const next = [...prev]; next[selected.index] = { r, c }; return next })
                                        setSelected(null)
                                        setTurn('black')
                                    }
                                }
                                else if (checkBlackMove) onPress = () => {
                                    const unit = blackUnits[selected.index]
                                    if (!unit) return
                                    const dr = r - unit.r
                                    const dc = c - unit.c
                                    const occ = findUnitAt(r, c)
                                    if (occ && occ.color == 'white') {
                                        const r2 = r + dr
                                        const c2 = c + dc
                                        setBlackUnits(prev => { const next = [...prev]; next[selected.index] = { r: r2, c: c2 }; return next })
                                        setWhiteUnits(prev => prev.filter(u => !(u.r == r && u.c == c)))
                                        setSelected({ color: 'black', index: selected.index })
                                        // capture -> retain turn (black continues)
                                        return
                                    } else {
                                        setBlackUnits(prev => { const next = [...prev]; next[selected.index] = { r, c }; return next })
                                        setSelected(null)
                                        setTurn('white')
                                    }
                                }

                                const disabled = !(checkWhitePos || checkBlackPos || Available)

                                return (
                                    <Square
                                        key={column.key}
                                        onPress={onPress}
                                        disabled={disabled}
                                        style={{ backgroundColor: color }}
                                    >
                                        {checkWhitePos && (
                                            <View style={styles.WhiteUnit} />
                                        )}
                                        {checkBlackPos && (
                                            <View style={styles.BlackUnit} />
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