export const Colors = {
    primary: '#2563eb', // Blue-600
    secondary: '#64748b', // Slate-500
    accent: '#facc15', // Yellow-400
    danger: '#dc2626', // Red-600
    success: '#16a34a', // Green-600
    warning: '#f97316', // Orange-500
    background: '#f8fafc', // Slate-50
    text: '#1e293b', // Slate-800
    textSecondary: '#64748b', // Slate-500
    headerBackground: '#e2e8f0', // Slate-200
    border: '#cbd5e1', // Slate-300
    touchFeedback: '#1e293b',
};

import { StyleSheet } from 'react-native';

export const Theme = {
    colors: Colors,
    text: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#1e293b', // Slate-800
    },
    heading: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#1e293b',
        marginBottom: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Slate-50
        padding: 20,
    },
}
