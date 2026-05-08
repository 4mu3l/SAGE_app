import { StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderWidth: 1
    },
    header: {
        height: 195,
        width: '100%',
        overflow: 'hidden',
        //borderWidth: 1                            // ver até onde vai o header
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 20
    },
    voltar: {
        position: 'absolute',
        left: 20,
        top: 50,
        zIndex: 10,
        padding: 8
    },
    título: {
        fontSize: 28,
        color: temas.colors.goiabada,
        textAlign: 'center',
        fontFamily: temas.fonts.bold,
        marginTop: 10
    },
    curvaSvg: {
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 20
    },
    minitítulo: {
        marginLeft: 5,
        color: temas.colors.minititulos,
        marginTop: 17,
        fontWeight: 'medium',
        fontSize: 14,
        textAlign: 'left',
        fontFamily: temas.fonts.medium,
        paddingLeft: 0
    },
    caixa: {
        width: 353,
        height: 50,
        borderWidth: 2,
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: temas.colors.bordas,
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: 12
    },
    input: {
        flex: 1,
        height: '100%',
        borderRadius: 10,
        fontFamily: temas.fonts.regular,
        fontSize: 14
    },
    botão_criar: {
        width: 353,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    texto_botão_criar: {
        color: temas.colors.goiabada,
        fontSize: 20,
        fontFamily: temas.fonts.medium
    }
});