import { StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: 120,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    backButton: {
        padding: 8,
        marginRight: 15,
    },
    título: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: temas.fonts.bold,
        lineHeight: 28,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    // Botões de tipo (Elétrico, Aquático, Residual)
    tipoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 10,
    },
    tipoButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        minWidth: 90,
        alignItems: 'center',
    },
    tipoText: {
        fontSize: 14,
        color: '#666666',
        fontFamily: temas.fonts.medium,
    },
    // Gráfico
    graficoTitulo: {
        fontSize: 20,
        color: '#333333',
        fontFamily: temas.fonts.bold,
        textAlign: 'center',
        marginBottom: 20,
    },
    graficoContainer: {
        height: 200,
        flexDirection: 'row',
        marginBottom: 30,
    },
    graficoLinhas: {
        width: 30,
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    linhaReferencia: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linhaNumero: {
        fontSize: 12,
        color: '#999999',
        width: 20,
    },
    linhaTracejada: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    barrasContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingVertical: 10,
        paddingLeft: 10,
    },
    barraWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    barra: {
        width: 20,
        borderRadius: 10,
        minHeight: 5,
    },
    barraLabel: {
        fontSize: 12,
        color: '#999999',
        marginTop: 5,
    },
    // Resumo Mensal
    resumoTitulo: {
        fontSize: 18,
        color: '#333333',
        fontFamily: temas.fonts.bold,
        textAlign: 'center',
        marginBottom: 15,
    },
    resumoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        marginBottom: 10,
    },
    resumoMes: {
        fontSize: 16,
        color: '#333333',
        fontFamily: temas.fonts.medium,
    },
    resumoValor: {
        fontSize: 18,
        fontFamily: temas.fonts.bold,
    },
    botão_adicionar:{
        //borderWidth: 1,                 // só pra ver o tamanho
        height: 66,
        borderRadius: 15,
        marginBottom: 10,
        fontFamily: temas.fonts.bold,
        backgroundColor: '#F5F5F5',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    adicionar_consumo:{
        fontSize: 16,
        color: '#333333',
        fontFamily: temas.fonts.medium,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: temas.fonts.bold,
        color: '#333333',
        marginBottom: 18,
        textAlign: 'center',
    },
    modalInput: {
        backgroundColor: '#F1F1F1',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 12,
        fontFamily: temas.fonts.regular,
    },
    modalButton: {
        backgroundColor: '#43A047',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 6,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontFamily: temas.fonts.bold,
    },
    modalCancel: {
        marginTop: 14,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: 16,
        color: '#E53935',
        fontFamily: temas.fonts.medium,
    },
    resumoDireita: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    resumoTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
resumoTotalLabel: {
    fontSize: 16,
    fontFamily: temas.fonts.bold,
    color: '#333333',
},
resumoTotalValor: {
    fontSize: 18,
    fontFamily: temas.fonts.bold,
},
resumoEsquerda: {
    flexDirection: 'column',
    justifyContent: 'center',
},
resumoPreco: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
    fontFamily: temas.fonts.regular,
},

});