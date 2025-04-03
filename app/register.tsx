import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/Theme';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        level: 0,
        message: '',
        color: 'gray'
    });
    const { register, error } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const checkPasswordStrength = (password: string) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        if (strongRegex.test(password)) {
            return { level: 3, message: 'Strong', color: 'green' };
        } else if (mediumRegex.test(password)) {
            return { level: 2, message: 'Medium', color: 'orange' };
        } else {
            return { level: 1, message: 'Weak', color: 'red' };
        }
    };

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(password));
    }, [password]);

    const handleRegister = async () => {
        if (isSubmitting) return;

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        if (passwordStrength.level < 3) {
            Alert.alert('Weak Password', 'Please use a stronger password');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('Starting registration for:', email);
            await register({ name, email, password, phone });
            console.log('Registration successful, navigating home');
            router.replace('/(tabs)/home');
        } catch (error: unknown) {
            if (error instanceof Error && !error.message.includes('canceled')) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'Registration failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="person" size={20} color="#64748b" style={styles.icon} />
                        <TextInput
                            placeholder="Enter your full name"
                            placeholderTextColor="#94a3b8"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputContainer, emailError ? styles.inputContainerError : null]}>
                        <MaterialIcons name="email" size={20} color="#64748b" style={styles.icon} />
                        <TextInput
                            placeholder="Enter your email"
                            placeholderTextColor="#94a3b8"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setEmailError(validateEmail(text) ? '' : 'Please enter a valid email');
                            }}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={20} color="#64748b" style={styles.icon} />
                        <TextInput
                            placeholder="Create a password"
                            placeholderTextColor="#94a3b8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.passwordStrengthContainer}>
                        <Text style={styles.passwordStrengthText}>Password Strength: </Text>
                        <Text style={{ color: passwordStrength.color, fontWeight: 'bold' }}>
                            {passwordStrength.message}
                        </Text>
                    </View>
                    <Text style={styles.passwordHint}>
                        Strong passwords have at least 8 characters with uppercase, lowercase, numbers and symbols.
                    </Text>
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Phone (optional)</Text>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="phone" size={20} color="#64748b" style={styles.icon} />
                        <TextInput
                            placeholder="Enter your phone number"
                            placeholderTextColor="#94a3b8"
                            value={phone}
                            onChangeText={setPhone}
                            style={styles.input}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, (passwordStrength.level < 3 || isSubmitting) ? styles.buttonDisabled : null]}
                    onPress={handleRegister}
                    disabled={passwordStrength.level < 3 || isSubmitting}
                >
                    <Text style={styles.buttonText}>
                        {isSubmitting ? 'Registering...' : 'Create Account'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <Link href="/login" style={styles.loginLink}>
                        <Text style={styles.loginLinkText}>Sign In</Text>
                    </Link>
                </View>
            </View>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8fafc',
    },
    formContainer: {
        width: '100%',
        maxWidth: 480,
        padding: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Theme.colors.primary,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    inputContainerError: {
        borderColor: '#ef4444',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#334155',
    },
    errorText: {
        color: '#ef4444',
        textAlign: 'center',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
    },
    fieldErrorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    passwordStrengthContainer: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
    },
    passwordStrengthText: {
        color: '#64748b',
        fontSize: 14,
    },
    passwordHint: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    button: {
        backgroundColor: Theme.colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#cbd5e1',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    loginText: {
        color: '#64748b',
    },
    loginLink: {
        marginLeft: 4,
    },
    loginLinkText: {
        color: Theme.colors.primary,
        fontWeight: 'bold',
    },
});