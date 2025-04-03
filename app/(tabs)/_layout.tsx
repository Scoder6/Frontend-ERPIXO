import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Theme } from '@/constants/Theme';
import { Redirect } from 'expo-router';

export default function TabLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // Or a loading spinner
    }

    if (!user) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Theme.colors.primary,
                tabBarInactiveTintColor: Theme.colors.textSecondary,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="home/index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'home' : 'home-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarAccessibilityLabel: 'Home tab',
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'account' : 'account-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarAccessibilityLabel: 'Profile tab',
                }}
            />
            <Tabs.Screen
                name="settings/index"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'cog' : 'cog-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarAccessibilityLabel: 'Settings tab',
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: Platform.select({
            ios: 80,
            android: 60,
            web: 70,
        }),
        paddingTop: Platform.select({
            ios: 8,
            android: 8,
            web: 12,
        }),
        paddingBottom: Platform.select({
            ios: 24,
            android: 8,
            web: 16,
        }),
        backgroundColor: Theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
    },
    tabBarLabel: {
        fontSize: Platform.select({
            ios: 12,
            android: 12,
            web: 14,
        }),
        fontFamily: 'Poppins_500Medium',
        marginBottom: Platform.select({
            ios: 4,
            android: 4,
            web: 8,
        }),
    },
    tabBarItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Platform.select({
            web: 8,
            default: 0,
        }),
    },
});