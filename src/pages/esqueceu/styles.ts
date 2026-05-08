import { StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        height: 195,
        width: '100%',
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 20
    },
    backButton: {
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
        lineHeight: 34,
        marginTop: 10
    },
    curvaSvg: {
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    content: {
        paddingHorizontal: 20,
        marginTop: 30
    },
    descrição: {
        fontSize: 14,
        fontFamily: temas.fonts.regular,
        color: temas.colors.minititulos,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10
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
    botão_enviar: {
        width: 353,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    texto_botão_enviar: {
        color: temas.colors.goiabada,
        fontSize: 20,
        fontFamily: temas.fonts.medium
    }
});