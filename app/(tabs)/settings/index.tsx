import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsPage() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>App Settings</Text>
            <Text style={styles.option}>Notification Settings</Text>
            <Text style={styles.option}>Theme Preferences</Text>
            <Text style={styles.option}>Privacy Settings</Text>
            <Text style={styles.option}>Account Management</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    option: {
        fontSize: 18,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});