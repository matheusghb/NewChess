import { StyleSheet, Text, View, Image, Button} from 'react-native' // importa os elementos da tela.
import { Link } from 'expo-router'

import img from '../assets/splash-icon.png' // transforma o arquivo em um objeto que pode ser lido pela tag image.
import ThemedView from '../components/themedview'
import Title from '../components/title'
import ChessTable from '../components/chesstable'

const Home = () => { // cria uma função que será usada pra renderizar os elementos.

    return (
        <ThemedView style={styles.container}>
            <Title title_text={'NewChess'}/>
            <Link href={"/newpage"}>Newpage</Link>
            <ChessTable>

            </ChessTable>
        </ThemedView>
    )
}
export default Home
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        position: 'absolute',
        zIndex: 0,
        position: 'static',
        objectFit: 'contain',
        height: '50%'
    },
})

