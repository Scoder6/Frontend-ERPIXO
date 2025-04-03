import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '@/context/ProfileContext';

export default function ProfileSettings() {
    const { profile, updateProfile, loading } = useProfile();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePicture: 'https://via.placeholder.com/150',
        password: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                profilePicture: profile.profilePicture,
                password: ''
            });
        }
    }, [profile]);

    const handleChange = (name: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email) {
            Alert.alert('Error', 'Name and email are required');
            return;
        }

        try {
            await updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                profilePicture: formData.profilePicture,
                password: formData.password || undefined
            });
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            handleChange('profilePicture', result.assets[0].uri);
        }
    };

    if (!profile && loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                <Image
                    source={{ uri: formData.profilePicture }}
                    style={styles.profileImage}
                />
                <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Phone (Optional)"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="New Password (Leave blank to keep current)"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Save Changes</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#e1e1e1'
    },
    changePhotoText: {
        marginTop: 8,
        color: '#007AFF'
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});