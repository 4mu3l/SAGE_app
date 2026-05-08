import { StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: 100,
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
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    userName: {
        fontSize: 18,
        color: '#333333',
        fontFamily: temas.fonts.bold,
    },
    userEmail: {
        fontSize: 14,
        color: '#666666',
        fontFamily: temas.fonts.regular,
    },
    editar_foto: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    editText: {
        fontSize: 16,
        color: '#333333',
        fontFamily: temas.fonts.medium,
        marginLeft: 15,
    },
});