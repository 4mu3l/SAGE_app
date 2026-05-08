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
    // Botão Definir Nova Meta
    botaoNovaMeta: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    botaoNovaMetaText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: temas.fonts.bold,
    },
    // Cards de Metas
    cardsContainer: {
        gap: 15,
        marginBottom: 25,
    },
    cardMeta: {
        backgroundColor: '#E8E8E8',
        borderRadius: 15,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    cardTitulo: {
        fontSize: 16,
        color: '#333333',
        fontFamily: temas.fonts.bold,
    },
    barraContainer: {
        width: '100%',
        marginBottom: 10,
    },
    barraFundo: {
        width: '100%',
        height: 20,
        backgroundColor: '#D0D0D0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    barraPreenchimento: {
        height: '100%',
        borderRadius: 10,
    },
    cardValor: {
        fontSize: 14,
        color: '#666666',
        fontFamily: temas.fonts.medium,
    },
    // Detalhes
    detalheContainer: {
        marginBottom: 20,
    },
    detalheTitulo: {
        fontSize: 18,
        color: '#333333',
        fontFamily: temas.fonts.bold,
        marginBottom: 15,
    },
    detalheCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
    },
    detalheHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    detalheNome: {
        fontSize: 20,
        color: '#333333',
        fontFamily: temas.fonts.bold,
    },
    progressoCircularContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    progressoInfo: {
        alignItems: 'center',
    },
    progressoPercentual: {
        fontSize: 48,
        fontFamily: temas.fonts.bold,
    },
    progressoLabel: {
        fontSize: 14,
        color: '#999999',
        fontFamily: temas.fonts.regular,
    },
    detalheValores: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 25,
        marginBottom: 20,
        width: '100%',
    },
    valorBox: {
        alignItems: 'center',
    },
    valorLabel: {
        fontSize: 12,
        color: '#999999',
        fontFamily: temas.fonts.medium,
        marginBottom: 4,
    },
    valorNumero: {
        fontSize: 28,
        fontFamily: temas.fonts.bold,
    },
    valorUnidade: {
        fontSize: 12,
        color: '#999999',
        fontFamily: temas.fonts.regular,
    },
    barraDetalheContainer: {
        width: '100%',
        marginBottom: 15,
    },
    barraDetalheFundo: {
        width: '100%',
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    barraDetalhePreenchimento: {
        height: '100%',
        borderRadius: 6,
    },
    detalheStatus: {
        fontSize: 14,
        color: '#666666',
        fontFamily: temas.fonts.medium,
        textAlign: 'center',
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
        borderRadius: 24,
        padding: 24,
    },

    modalTitle: {
        fontSize: 22,
        fontFamily: temas.fonts.bold,
        color: '#333333',
        textAlign: 'center',
        marginBottom: 10,
    },

    modalTipo: {
        fontSize: 18,
        fontFamily: temas.fonts.medium,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 18,
    },

    modalInput: {
        backgroundColor: '#F1F1F1',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: temas.fonts.regular,
        marginBottom: 14,
    },

    modalButton: {
        backgroundColor: '#43A047',
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: 'center',
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
    cardPreco: {
        fontSize: 14,
        fontFamily: temas.fonts.bold,
        marginTop: 4,
    },
    precoTotalDetalhe: {
        fontSize: 18,
        fontFamily: temas.fonts.bold,
        marginTop: 6,
    },
    });