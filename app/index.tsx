import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Theme } from '@/constants/Theme';

export default function Index() {
    const [isReady, setIsReady] = useState(false);
    const { user, loading } = useAuth();

useEffect(() => {
    // Simulate minimum loading time (you can remove this if not needed)
    const timer = setTimeout(() => {
        setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
}, []);

    // If we're still loading auth state or the splash delay
if (loading || !isReady) {
    return (
        <View style={styles.container}>
            <Text style={styles.appTitle}>My App</Text>
            <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
    );
}

    // Redirect based on auth state
    return <Redirect href={user ? '/(tabs)/home' : '/login'} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
    },
    appTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
        color: Theme.colors.text,
        marginBottom: 20,
    },
});