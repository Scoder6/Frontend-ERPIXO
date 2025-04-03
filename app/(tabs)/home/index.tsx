import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={Theme.container}>
            {/* Custom Header with Menu Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                    <Ionicons name="menu" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Home</Text>
            </View>

            {/* Page Content */}
            <View style={styles.content}>
                {user.profilePicture && (
                    <Image
                        source={{ uri: user.profilePicture }}
                        style={styles.profileImage}
                    />
                )}
                <Text style={styles.title}>Welcome {user.name}!</Text>
                <Text style={styles.subtitle}>
                    Email: {user.email}
                </Text>
                {user.phone && (
                    <Text style={styles.subtitle}>
                        Phone: {user.phone}
                    </Text>
                )}
                <Text style={styles.navigationHint}>
                    Use the side drawer, bottom tabs, or profile tabs to navigate
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 10,
        color: Theme.colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 8,
        color: Theme.colors.textSecondary,
        textAlign: 'center',
    },
    navigationHint: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        marginTop: 30,
        color: Theme.colors.textSecondary,
        textAlign: 'center',
    },
});