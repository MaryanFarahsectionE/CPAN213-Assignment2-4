import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function ErrorModal({ visible, onClose, error, onRetry }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>✕</Text>
          </View>
          
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <View style={styles.divider} />
          <Text style={styles.errorMessage}>
            {error || 'Unable to load movies. Please check your connection.'}
          </Text>
          
          <View style={styles.buttonContainer}>
            {onRetry && (
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={onRetry}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>🔄 Retry</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function ConfirmationModal({ visible, onClose, onConfirm, title, message }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.confirmContainer}>
          <View style={styles.confirmIcon}>
            <Text style={styles.confirmIconText}>?</Text>
          </View>
          
          <Text style={styles.confirmTitle}>{title || 'Are you sure?'}</Text>
          <View style={styles.divider} />
          <Text style={styles.confirmMessage}>
            {message || 'This action cannot be undone.'}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>✓ Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 20,
    padding: 35,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  confirmContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 20,
    padding: 35,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e90ff',
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorIconText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmIconText: {
    fontSize: 45,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#333',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  confirmMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#1e90ff',
  },
  closeButton: {
    backgroundColor: '#333',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  confirmButton: {
    backgroundColor: '#1e90ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});