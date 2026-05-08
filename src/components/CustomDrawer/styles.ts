import { StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#2E7D32',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: temas.fonts.bold,
    },
    userEmail: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
        fontFamily: temas.fonts.regular,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333333',
        fontFamily: temas.fonts.medium,
        marginLeft: 15,
    },
    itemDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 20,
        marginLeft: 55,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 20,
        marginVertical: 10,
    },
});