import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Overview from '../../../components/profile/ProfileOverview';
import Settings from '../../../components/profile/ProfileSettings';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();

export default function ProfilePage() {
    const { colors } = useTheme();
    const { user, loading } = useAuth();
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>User not found. Please login again.</Text>
            </View>
        );
    }

    return (
        <View style={Theme.container}>
            {/* Custom Header with Menu Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                    <Ionicons name="menu" size={28} color={Theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            {/* Profile Content */}
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: {
                        fontSize: 16,
                        fontFamily: 'Poppins_600SemiBold',
                        textTransform: 'none',
                    },
                    tabBarActiveTintColor: Theme.colors.primary,
                    tabBarInactiveTintColor: Theme.colors.textSecondary,
                    tabBarIndicatorStyle: {
                        backgroundColor: Theme.colors.primary,
                        height: 3,
                    },
                    tabBarStyle: {
                        backgroundColor: Theme.colors.background,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: Theme.colors.border,
                    },
                    tabBarPressColor: Theme.colors.touchFeedback,
                }}
            >
                <Tab.Screen
                    name="Overview"
                    component={Overview}
                    options={{
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={[
                                styles.tabLabel,
                                { color },
                                focused && styles.activeTabLabel
                            ]}>
                                Overview
                            </Text>
                        ),
                    }}
                    initialParams={{ user }}
                />
                <Tab.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={[
                                styles.tabLabel,
                                { color },
                                focused && styles.activeTabLabel
                            ]}>
                                Settings
                            </Text>
                        ),
                    }}
                    initialParams={{ user }}
                />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
    },
    errorText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: Theme.colors.text,
        textAlign: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 50,
        backgroundColor: Theme.colors.headerBackground,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    menuButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        color: Theme.colors.text,
    },
    tabLabel: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 8,
    },
    activeTabLabel: {
        color: Theme.colors.primary,
    },
});