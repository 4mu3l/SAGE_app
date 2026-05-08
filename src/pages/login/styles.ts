import { StyleSheet } from "react-native";  // pasta para editar todos os componentes
import { temas } from "../../global/themes";
export const style = StyleSheet.create({    //
    container:{
        flex: 1,                            //
        backgroundColor: '#ffffff'
    },                                      //
    header:{
        height: 195,                        //
        width: '100%',
        overflow: 'hidden',                 //
        //borderWidth: 1                    // só pra ver até onde o header vai
    },
    título:{                                //
        //fontWeight:'bold',
        marginTop: 0,
        fontSize: 32,                       //
        color: temas.colors.goiabada,
        textAlign: 'center',                //
        fontFamily: temas.fonts.bold,
        lineHeight: 34
    },
    linha_do_título:{
        width: 226,                         // largura da linha
        height: 1,                          // espessura
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        opacity: 0.5
    },
    subtítulo:{
        //fontWeight: '200',                  //
        fontSize: 16,
        //textAlign: 'center',
        color: temas.colors.goiabada,
        opacity: 0.8,
        fontFamily: temas.fonts.light
        
    },
    caixa:{
        width: 353,
        height: 50,
        borderWidth: 2,
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: temas.colors.bordas,
        marginTop: 10,
        alignSelf: 'center'
    },
    minitítulo_email:{
        marginLeft: 5,
        color: temas.colors.minititulos,
        marginTop: 66,
        fontWeight: 'medium',
        fontSize: 14,
        textAlign: 'left',
        fontFamily: temas.fonts.medium,
        paddingLeft: 16
    },
    input_do_email:{
        width: 352,
        height: 49,
        //backgroundColor: 'red',
        borderRadius: 10,
        textAlign: 'left',
        fontWeight: 'regular',
        fontFamily: temas.fonts.regular,
        fontSize: 14
    },
    minitítulo_senha:{
        marginLeft: 5,
        color: temas.colors.minititulos,
        fontWeight: 'medium',
        fontSize: 14,
        fontFamily: temas.fonts.medium,
        marginTop: 17,
        textAlign: 'left',
        paddingLeft: 16
    },
    input_da_senha:{
        width: 353,
        height: 49,
        //backgroundColor: 'red',
        borderRadius: 10,
        fontWeight: 'regular',
        fontSize: 14,
        fontFamily: temas.fonts.regular,
        alignSelf: 'center'             // faz com que ele se alinhe sozinho
    },
    botão_entrar:{
        width: 353,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        //borderWidth: 1                // só pra ver a largura do botão
    },
    texto_botão_entrar:{
        color: temas.colors.goiabada,
        fontSize: 32,
        marginTop: 3,
        //fontWeight: 'medium',
        fontFamily: temas.fonts.medium
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    curvaSvg: {
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    botãoEsqueceuSenha:{
        width: 138,
        marginLeft: 20,
        marginTop: 17
    },
    textoEsqueceuSenha:{
        fontSize: 14,
        fontWeight: 'regular',
        fontFamily: temas.fonts.regular,
        color: temas.colors.limãozin,
        opacity: 0.7,
        lineHeight: 18
    },
    linha_do_esqueceu:{
        width: 139,
        height: 1,
        backgroundColor: temas.colors.limãozin,
        opacity: 0.7,
        marginLeft: -1
    },
    botão_criar_conta:{
        paddingBottom: 10,
        alignItems: 'center'
    },
    criar_conta:{
        //textAlign: 'center',
        fontWeight: 'medium',
        fontFamily: temas.fonts.medium,
        color: temas.colors.limãozin,
        lineHeight: 17
    },
    linha_criar:{
        width: 87,
        height: 1,
        backgroundColor: temas.colors.limãozin,
        opacity: 0.7
    },
    sóprochavão:{
        justifyContent: 'flex-end',
        //borderWidth: 1,
        //borderColor: 'red',
        alignItems: 'center',
        flex: 1                                     // faz o minicontainer só pro chavão ocupar todo o espaço restante do container pai
    },
    linha_cinza:{
        width: 391,
        height: 1,
        backgroundColor: temas.colors.bordas,
        alignSelf: 'center',
        marginBottom: 7
    }
})