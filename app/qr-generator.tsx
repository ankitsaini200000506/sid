import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { QrCode, Download, Share } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRGeneratorScreen() {
  const [tableNumber, setTableNumber] = useState('');
  const [generatedQRs, setGeneratedQRs] = useState<Array<{ table: string; qrValue: string }>>([]);

  const generateQR = () => {
    if (!tableNumber.trim()) {
      Alert.alert('Error', 'Please enter a table number');
      return;
    }

    const qrValue = `TABLE:${tableNumber.trim()}`;
    const newQR = { table: tableNumber.trim(), qrValue };
    
    setGeneratedQRs(prev => {
      const exists = prev.find(qr => qr.table === tableNumber.trim());
      if (exists) {
        return prev;
      }
      return [...prev, newQR];
    });
    
    setTableNumber('');
  };

  const generateMultipleQRs = () => {
    const count = parseInt(tableNumber);
    if (isNaN(count) || count <= 0 || count > 50) {
      Alert.alert('Error', 'Please enter a valid number between 1 and 50');
      return;
    }

    const newQRs = [];
    for (let i = 1; i <= count; i++) {
      const qrValue = `TABLE:${i}`;
      newQRs.push({ table: i.toString(), qrValue });
    }

    setGeneratedQRs(newQRs);
    setTableNumber('');
  };

  const clearAll = () => {
    Alert.alert(
      'Clear All QR Codes',
      'Are you sure you want to clear all generated QR codes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setGeneratedQRs([]) },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'QR Code Generator', headerBackTitle: 'Admin' }} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Generate Table QR Codes</Text>
            <Text style={styles.sectionDescription}>
              Create QR codes for your restaurant tables. Customers can scan these to automatically set their table number.
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter table number or count"
                value={tableNumber}
                onChangeText={setTableNumber}
                keyboardType="numeric"
              />
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={generateQR}
                >
                  <QrCode size={20} color="#fff" />
                  <Text style={styles.buttonText}>Generate Single</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={generateMultipleQRs}
                >
                  <QrCode size={20} color="#d69e2e" />
                  <Text style={styles.secondaryButtonText}>Generate Multiple</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {generatedQRs.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Generated QR Codes ({generatedQRs.length})</Text>
                <TouchableOpacity onPress={clearAll}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.qrGrid}>
                {generatedQRs.map((qr, index) => (
                  <View key={index} style={styles.qrCard}>
                    <Text style={styles.qrTableNumber}>Table {qr.table}</Text>
                    
                    <View style={styles.qrCodeContainer}>
                      <QRCode
                        value={qr.qrValue}
                        size={120}
                        backgroundColor="white"
                        color="black"
                      />
                    </View>
                    
                    <View style={styles.qrActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          Alert.alert('Download', 'QR code download functionality would be implemented here');
                        }}
                      >
                        <Download size={16} color="#718096" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          Alert.alert('Share', 'QR code sharing functionality would be implemented here');
                        }}
                      >
                        <Share size={16} color="#718096" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionsList}>
              <Text style={styles.instruction}>1. Generate QR codes for each table in your restaurant</Text>
              <Text style={styles.instruction}>2. Print and place QR codes on respective tables</Text>
              <Text style={styles.instruction}>3. Customers scan the QR code to set their table number automatically</Text>
              <Text style={styles.instruction}>4. Orders will be linked to the correct table for easy service</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 16,
  },
  clearText: {
    fontSize: 14,
    color: '#e53e3e',
    fontWeight: '600',
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#d69e2e',
  },
  secondaryButton: {
    backgroundColor: '#fef5e7',
    borderWidth: 1,
    borderColor: '#d69e2e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#d69e2e',
    fontSize: 16,
    fontWeight: '600',
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  qrCard: {
    width: '48%',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qrTableNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  qrCodeContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  qrActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  instructionsList: {
    gap: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
  },
});