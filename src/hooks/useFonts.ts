import { useFonts as useExpoFonts } from 'expo-font';

export function useFonts() {
    const [fontsLoaded] = useExpoFonts({
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    });

    return [fontsLoaded];
}