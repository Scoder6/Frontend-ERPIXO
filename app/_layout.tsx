import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { View, StyleSheet, Image, Text } from 'react-native'; // Added Image and Text imports
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';

function CustomDrawerContent(props: DrawerContentComponentProps) {
    const router = useRouter();
    const { logout, user } = useAuth();

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.drawerContainer}
        >
            <View style={styles.drawerContent}>
                {user && (
                    <View style={styles.userInfo}>
                        {user.profilePicture && (
                            <Image
                                source={{ uri: user.profilePicture }}
                                style={styles.profileImage}
                            />
                        )}
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                )}

                <DrawerItem
                    label="Home"
                    onPress={() => router.push('/(tabs)/home')}
                    icon={({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    )}
                    labelStyle={styles.drawerLabel}
                />
                <DrawerItem
                    label="Profile"
                    onPress={() => router.push('/(tabs)/profile')}
                    icon={({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    )}
                    labelStyle={styles.drawerLabel}
                />
                <DrawerItem
                    label="Settings"
                    onPress={() => router.push('/(tabs)/settings')}
                    icon={({ color, size }) => (
                        <MaterialIcons name="settings" size={size} color={color} />
                    )}
                    labelStyle={styles.drawerLabel}
                />

                <View style={styles.logoutContainer}>
                    <DrawerItem
                        label="Logout"
                        onPress={() => {
                            logout();
                            router.replace('/login');
                        }}
                        icon={({ color, size }) => (
                            <MaterialIcons name="logout" size={size} color={color} />
                        )}
                        labelStyle={[styles.drawerLabel, styles.logoutLabel]}
                    />
                </View>
            </View>
        </DrawerContentScrollView>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <ProfileProvider>
                <Drawer
                    drawerContent={(props) => <CustomDrawerContent {...props} />}
                    screenOptions={{
                        headerShown: false,
                        drawerHideStatusBarOnOpen: true,
                        drawerType: 'slide',
                        drawerActiveTintColor: Theme.colors.primary,
                        drawerInactiveTintColor: Theme.colors.textSecondary,
                        drawerStyle: {
                            width: 280,
                            backgroundColor: Theme.colors.background,
                        },
                    }}
                >
                    <Drawer.Screen
                        name="(tabs)"
                        options={{
                            drawerLabel: 'Home',
                            title: 'Home',
                        }}
                    />
                    <Drawer.Screen
                        name="(auth)"
                        options={{
                            drawerItemStyle: { display: 'none' }
                        }}
                    />
                </Drawer>
            </ProfileProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        paddingTop: 20,
    },
    drawerContent: {
        flex: 1,
        paddingHorizontal: 10,
    },
    userInfo: {
        padding: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        color: Theme.colors.text,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    drawerLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        marginLeft: -6,
    },
    logoutContainer: {
        marginTop: 'auto',
        marginBottom: 20,
    },
    logoutLabel: {
        color: Theme.colors.text,
    },
});