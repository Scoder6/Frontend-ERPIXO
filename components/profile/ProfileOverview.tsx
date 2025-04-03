import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useProfile } from '@/context/ProfileContext';

export default function ProfileOverview() {
    const { profile, loading } = useProfile();

    if (loading || !profile) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: profile.profilePicture }}
                style={styles.profileImage}
                defaultSource={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
            />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            {profile.phone && <Text style={styles.phone}>{profile.phone}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Poppins_600SemiBold',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
        fontFamily: 'Poppins_400Regular',
    },
    phone: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins_400Regular',
    },
});