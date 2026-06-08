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
    const inicialBlack = Array.from({ length: linhas }).flatMap((_, r) => (r < 2 ? Array.from({ length: colunas }, (_, c) => ({ r, c, upgrade: false })) : []))
    const inicialWhite = Array.from({ length: linhas }).flatMap((_, r) => (r >= linhas - 2 ? Array.from({ length: colunas }, (_, c) => ({ r, c, upgrade: false })) : []))

    const [whiteUnits, setWhiteUnits] = useState(() => inicialWhite)
    const [blackUnits, setBlackUnits] = useState(() => inicialBlack)
    const [selected, setSelected] = useState(null)
    const [turn, setTurn] = useState('white')
    const [posCapture, setposCapture] = useState(null)
    const [captWhite, setCaptWhite] = useState(0) 
    const [captBlack, setCaptBlack] = useState(0)

    const resetBoard = () => {
        setWhiteUnits(inicialWhite)
        setBlackUnits(inicialBlack)
        setSelected(null)
        setTurn('white')
        setCaptWhite(0)
        setCaptBlack(0)
    }

    const vencedor = captWhite >= 16 ? 'Preto' : (captBlack >= 16 ? 'Branco' : null)
    const jogoTerm = !!vencedor

    const procurarUnit = (r, c) => {
        const wIndex = whiteUnits.findIndex(u => u.r == r && u.c == c)
        if (wIndex >= 0) return { color: 'white', index: wIndex }
        const bIndex = blackUnits.findIndex(u => u.r == r && u.c == c)
        if (bIndex >= 0) return { color: 'black', index: bIndex }
        return null
    }

    const tem = (r, c, color) => { //verifica o que tem na tile
        return color == 'white'
            ? whiteUnits.some(u => u.r == r && u.c == c)
            : blackUnits.some(u => u.r == r && u.c == c)
    }

    const calcularMov = (r, c, baseColor) => {
        // mostra os movimentos possiveis para a unit selecionada (1 pra cada diagonal)
            if (selected && selected.color == 'white') {
                const unit = whiteUnits[selected.index]
                if (unit) {
                    // units com upgrade podem se mover qualquer distância pelas diagonais
                    if (unit.upgrade) {
                        const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]]
                        for (const [drDir, dcDir] of dirs) {
                            let dist = 1
                            while (true) {
                                const nr = unit.r + drDir*dist
                                const nc = unit.c + dcDir*dist
                                if (nr < 0 || nr >= linhas || nc < 0 || nc >= colunas) break
                                const occup = procurarUnit(nr, nc)
                                if (!occup) {
                                    if (nr == r && nc == c) return 'red'
                                    dist++
                                    continue
                                }
                                    // encontrou uma peça: se for do oponente, apenas a casa logo após o oponente é um destino válido de captura para units com upgrade
                                    if (occup.color == 'black') {
                                        const lr = nr + drDir
                                        const lc = nc + dcDir
                                        if (!(lr < 0 || lr >= linhas || lc < 0 || lc >= colunas)) {
                                            if (!procurarUnit(lr, lc) && lr == r && lc == c) return 'green'
                                        }
                                    }
                                break
                            }
                        }
                    } else {
                        // movimento da peça base
                        const dr = r - unit.r
                        const dc = c - unit.c
                        const unitBase = Math.abs(dr) == 1 && Math.abs(dc) == 1
                        if (unitBase && dr == -1 && !tem(r, c, 'white') && !tem(r, c, 'black')) return 'red'
                        if (Math.abs(dr) == 2 && Math.abs(dc) == 2) {
                            const midR = unit.r + Math.sign(dr)
                            const midC = unit.c + Math.sign(dc)
                            const dentro = r >= 0 && r < linhas && c >= 0 && c < colunas
                            if (dentro && !tem(r, c, 'white') && !tem(r, c, 'black')) {
                                const uniAlvo = procurarUnit(midR, midC)
                                if (uniAlvo && uniAlvo.color == 'black') return 'green'
                            }
                        }
                    }
                }
            }
            if (selected && selected.color == 'black') {
                const unit = blackUnits[selected.index]
                if (unit && unit.r == r && unit.c == c) return 'blue'
                if (unit) {
                    if (unit.upgrade) {
                        const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]]
                        for (const [drDir, dcDir] of dirs) {
                            let dist = 1
                            while (true) {
                                const nr = unit.r + drDir*dist
                                const nc = unit.c + dcDir*dist
                                if (nr < 0 || nr >= linhas || nc < 0 || nc >= colunas) break
                                const occup = procurarUnit(nr, nc)
                                if (!occup) {
                                    if (nr == r && nc == c) return 'red'
                                    dist++
                                    continue
                                }
                                if (occup.color == 'white') {
                                    const lr = nr + drDir
                                    const lc = nc + dcDir
                                    if (!(lr < 0 || lr >= linhas || lc < 0 || lc >= colunas)) {
                                        if (!procurarUnit(lr, lc) && lr == r && lc == c) return 'green'
                                    }
                                }
                                break
                            }
                        }
                    } else {
                        const dr = r - unit.r
                        const dc = c - unit.c
                        const unitBase = Math.abs(dr) == 1 && Math.abs(dc) == 1
                        if (unitBase && dr == 1 && !tem(r, c, 'white') && !tem(r, c, 'black')) return 'red'
                        if (Math.abs(dr) == 2 && Math.abs(dc) == 2) {
                            const midR = unit.r + Math.sign(dr)
                            const midC = unit.c + Math.sign(dc)
                            const dentro = r >= 0 && r < linhas && c >= 0 && c < colunas
                            if (dentro && !tem(r, c, 'white') && !tem(r, c, 'black')) {
                                const ocupMid = procurarUnit(midR, midC)
                                if (ocupMid && ocupMid.color == 'white') return 'green'
                            }
                        }
                    }
                }
            }
            return baseColor
            // calcula as diagonais dos units e colore pra vermelho/verde

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
            justifyContent: 'center',
            alignItems: 'center',
        },

        upgradeMark: {
            fontSize: 12,
            fontWeight: '700',
            color: '#fff',
            textShadowColor: '#000',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 2,
        }
    })

    return (
        <View style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={{ marginBottom: 8, alignItems: 'center' }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    color: turn == 'white' ? '#000' : '#fff',
                    backgroundColor: turn == 'white' ? colors.peon1 : colors.peon2,
                }}>{turn == 'white' ? 'turno do time Branco' : 'turno do time Preto'}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>Branco: {captWhite}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>Preto: {captBlack}</Text>
            </View>

            {vencedor && (
                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 8 }}>o time {vencedor} ganhou</Text>
                    <TouchableOpacity onPress={resetBoard} style={{ backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Reiniciar jogo</Text>
                    </TouchableOpacity>
                </View>
            )}

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

                                const ocupant = procurarUnit(r, c)
                                const checkWhitePos = ocupant && ocupant.color =='white'
                                const checkBlackPos = ocupant && ocupant.color =='black'

                                const checkWhiteMove = selected && selected.color == 'white' && (() => {
                                    const unit = whiteUnits[selected.index]
                                    if (!unit) return false
                                    const dr = r - unit.r
                                    const dc = c - unit.c
                                    const ocup = procurarUnit(r, c)
                                    // movimento e captura da peça com upgrade,
                                    if (unit.upgrade) {
                                        if (Math.abs(dr) !== Math.abs(dc) || dr == 0) return false
                                        const distR = Math.sign(dr)
                                        const distC = Math.sign(dc)
                                        let Units = []
                                        let UnitPos = null
                                        for (let i = 1; i < Math.abs(dr); i++) {
                                            const rr = unit.r + i * distR
                                            const cc = unit.c + i * distC
                                            const u = procurarUnit(rr, cc)
                                            if (u) { Units.push(u); UnitPos = { r: rr, c: cc, u } }
                                            if (Units.length > 1) return false
                                        }
                                        if (Units.length == 0) {
                                            return !ocup
                                        }
                                        if (Units.length == 1 && Units[0].color == 'black') {
                                            // exigir que o pouso seja imediatamente após o oponente
                                            const lr = UnitPos.r + distR
                                            const lc = UnitPos.c + distC
                                            if (lr == r && lc == c && !ocup) return true
                                            return false
                                        }
                                        return false
                                    }
                                    // captura para a peça normal
                                    const unitBase = Math.abs(dr) == 1 && Math.abs(dc) == 1
                                    if (!unitBase) return false
                                    if (dr !== -1) return false
                                    if (!ocup) return true
                                    if (ocup.color == 'black') {
                                        const r2 = r + dr
                                        const c2 = c + dc
                                        const dentro = r2 >= 0 && r2 < linhas && c2 >= 0 && c2 < colunas
                                        if (!dentro) return false
                                        return !procurarUnit(r2, c2)
                                    }
                                    return false
                                })()
                                const checkBlackMove = selected && selected.color == 'black' && (() => {
                                    const unit = blackUnits[selected.index]
                                    if (!unit) return false
                                    const dr = r - unit.r
                                    const dc = c - unit.c
                                    const ocup = procurarUnit(r, c)
                                    if (unit.upgrade) {
                                        if (Math.abs(dr) !== Math.abs(dc) || dr == 0) return false
                                        const distR = Math.sign(dr)
                                        const distC = Math.sign(dc)
                                        let Units = []
                                        let UnitPos = null
                                        for (let i = 1; i < Math.abs(dr); i++) {
                                            const rr = unit.r + i * distR
                                            const cc = unit.c + i * distC
                                            const u = procurarUnit(rr, cc)
                                            if (u) { Units.push(u); UnitPos = { r: rr, c: cc, u } }
                                            if (Units.length > 1) return false
                                        }
                                        if (Units.length == 0) {
                                            return !ocup
                                        }
                                        if (Units.length == 1 && Units[0].color == 'white') {
                                            const lr = UnitPos.r + distR
                                            const lc = UnitPos.c + distC
                                            if (lr == r && lc == c && !ocup) return true
                                            return false
                                        }
                                        return false
                                    }
                                    const unitBase = Math.abs(dr) == 1 && Math.abs(dc) == 1
                                    if (!unitBase) return false
                                    if (dr !== 1) return false
                                    if (!ocup) return true
                                    if (ocup.color == 'white') {
                                        const r2 = r + dr
                                        const c2 = c + dc
                                        const dentro = r2 >= 0 && r2 < linhas && c2 >= 0 && c2 < colunas
                                        if (!dentro) return false
                                        return !procurarUnit(r2, c2)
                                    }
                                    return false
                                })()
                                const Available = checkWhiteMove || checkBlackMove

                                // script para selecionar a unit por click (verifica o turno)
                                let onPress
                                if (checkWhitePos && turn == 'white') onPress = () => setSelected({ color: 'white', index: ocupant.index })
                                else if (checkBlackPos && turn == 'black') onPress = () => setSelected({ color: 'black', index: ocupant.index })
                                // move e deseleciona a unit
                                else if (checkWhiteMove) onPress = () => {
                                    const unit = whiteUnits[selected.index]
                                    if (!unit) return
                                    const dr = r - unit.r
                                    const dc = c - unit.c
                                    const ocup = procurarUnit(r, c)
                                    // captura de peça promovida (dama): pode haver um inimigo entre origem e destino
                                    if (unit.upgrade) {
                                        if (Math.abs(dr) == Math.abs(dc) && (dr !== 0)) {
                                            const distR = Math.sign(dr)
                                            const distC = Math.sign(dc)
                                            let Units = []
                                            let UnitPos = null
                                            for (let i = 1; i < Math.abs(dr); i++) {
                                                const rr = unit.r + i * distR
                                                const cc = unit.c + i * distC
                                                const u = procurarUnit(rr, cc)
                                                if (u) { Units.push(u); UnitPos = { r: rr, c: cc, unit: u } }
                                                if (Units.length > 1) break
                                            }
                                                if (Units.length == 1 && Units[0].color == 'black' && !ocup) {
                                                const distR = Math.sign(dr)
                                                const distC = Math.sign(dc)
                                                if (r == UnitPos.r + distR && c == UnitPos.c + distC) {
                                                    // captura para o alvo
                                                    setWhiteUnits(prevWU => { const next = [...prevWU]; next[selected.index] = { r, c, upgrade: unit.upgrade || (r == 0) }; return next })
                                                    setBlackUnits(prevBU => prevBU.filter(u => !(u.r == UnitPos.r && u.c == UnitPos.c)))
                                                    setCaptBlack(c => c + 1)
                                                    setSelected({ color: 'white', index: selected.index })
                                                    return
                                                }
                                            }
                                            if (Units.length == 0 && !ocup) {
                                                // movimento simples da dama
                                                setWhiteUnits(prevWU => { const next = [...prevWU]; next[selected.index] = { r, c, upgrade: unit.upgrade || (r == 0) }; return next })
                                                setSelected(null)
                                                setTurn('black')
                                                return
                                            }
                                        }
                                    }
                                    // captura/movimento de peça normal
                                    if (ocup && ocup.color == 'black') {
                                        const r2 = r + dr
                                        const c2 = c + dc
                                        const dentro = r2 >= 0 && r2 < linhas && c2 >= 0 && c2 < colunas
                                        const landingEmpty = dentro && !procurarUnit(r2, c2)
                                        if (landingEmpty) {
                                            // logica de captura + upgrade
                                            setWhiteUnits(prev => { const next = [...prev]; next[selected.index] = { r: r2, c: c2, upgrade: unit.upgrade || (r2 == 0) }; return next })
                                            setBlackUnits(prev => prev.filter(u => !(u.r == r && u.c == c)))
                                            setCaptBlack(c => c + 1)
                                            setSelected({ color: 'white', index: selected.index })
                                            // permite capturar novamente
                                            return
                                        }
                                    }
                                    const promote = (r == 0)
                                    setWhiteUnits(prev => { const next = [...prev]; next[selected.index] = { r, c, upgrade: unit.upgrade || promote }; return next })
                                    setSelected(null)
                                    setTurn('black')
                                }
                                else if (checkBlackMove) onPress = () => {
                                    const unit = blackUnits[selected.index]
                                    if (!unit) return
                                    const dr = r - unit.r
                                    const dc = c - unit.c
                                    const ocup = procurarUnit(r, c)
                                    if (unit.upgrade) {
                                        if (Math.abs(dr) == Math.abs(dc) && (dr !== 0)) {
                                            const distR = Math.sign(dr)
                                            const distC = Math.sign(dc)
                                            let Units = []
                                            let UnitPos = null
                                            for (let i = 1; i < Math.abs(dr); i++) {
                                                const rr = unit.r + i * distR
                                                const cc = unit.c + i * distC
                                                const u = procurarUnit(rr, cc)
                                                if (u) { Units.push(u); UnitPos = { r: rr, c: cc, unit: u } }
                                                if (Units.length > 1) break
                                            }
                                            if (Units.length == 1 && Units[0].color == 'white' && !ocup) {
                                                const distR = Math.sign(dr)
                                                const distC = Math.sign(dc)
                                                if (r == UnitPos.r + distR && c == UnitPos.c + distC) {
                                              
                                                    setBlackUnits(prev => { const next = [...prev]; next[selected.index] = { r, c, upgrade: unit.upgrade || (r == linhas - 1) }; return next })
                                                    setWhiteUnits(prev => prev.filter(u => !(u.r == UnitPos.r && u.c == UnitPos.c)))
                                                    setCaptWhite(c => c + 1)
                                                    setSelected({ color: 'black', index: selected.index })
                                                    return
                                                }
                                            }
                                            if (Units.length == 0 && !ocup) {
                                                setBlackUnits(prev => { const next = [...prev]; next[selected.index] = { r, c, upgrade: unit.upgrade || (r == linhas - 1) }; return next })
                                                setSelected(null)
                                                setTurn('white')
                                                return
                                            } 
                                        }
                                    }
                                    if (ocup && ocup.color == 'white') {
                                        const r2 = r + dr
                                        const c2 = c + dc
                                        const dentro = r2 >= 0 && r2 < linhas && c2 >= 0 && c2 < colunas
                                        const landingEmpty = dentro && !procurarUnit(r2, c2)
                                        if (landingEmpty) {
                                            // logica de captura + upgrade
                                            setBlackUnits(prevBU => { const next = [...prevBU]; next[selected.index] = { r: r2, c: c2, upgrade: unit.upgrade || (r2 == linhas - 1) }; return next })
                                            setWhiteUnits(prevWU => prevWU.filter(u => !(u.r == r && u.c == c)))
                                            setCaptWhite(c => c + 1)
                                            setSelected({ color: 'black', index: selected.index })
                                            // permite capurar dnv
                                            return
                                        }
                                    }
                                    const promote = (r == linhas - 1)
                                    setBlackUnits(prevBU => { const next = [...prevBU]; next[selected.index] = { r, c, upgrade: unit.upgrade || promote }; return next })
                                    setSelected(null)
                                    setTurn('white')
                                }

                                const disabled = !(checkWhitePos || checkBlackPos || Available)

                                return (
                                    <Square
                                        key={column.key}
                                        onPress={onPress}
                                        disabled={disabled || jogoTerm}
                                        style={{ backgroundColor: color }}
                                    >
                                        {checkWhitePos && (
                                            <View style={styles.WhiteUnit}>
                                                {whiteUnits[ocupant.index].upgrade && (
                                                    <Text style={styles.upgradeMark}>K</Text>
                                                )}
                                            </View>
                                        )}
                                        {checkBlackPos && (
                                            <View style={styles.BlackUnit}>
                                                {blackUnits[ocupant.index].upgrade && (
                                                    <Text style={styles.upgradeMark}>K</Text>
                                                )}
                                            </View>
                                        )}
                                    </Square>
                                )
                            })}
                        </TableLines>
                    ))}
                    </ScrollView>                
                </ScrollView>
            </View>
        </View>
    )
}
export default ChessTable