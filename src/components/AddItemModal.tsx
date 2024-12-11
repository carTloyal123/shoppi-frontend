import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Image } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ListItem } from '@/utils/supabase/service';

interface AddItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddItem: (item: ListItem) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isVisible, onClose, onAddItem }) => {
  const { colors } = useTheme();
  const [itemName, setItemName] = useState('');
  const [isAmazon, setIsAmazon] = useState(false);
  const [amazonLink, setAmazonLink] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleAddItem = () => {
    if (itemName.trim()) {
      onAddItem({
        item_name: itemName.trim(),
        item_description: isAmazon ? 'Amazon' : 'Other',
        item_id: Date.now(), // or any unique identifier
        created_at: new Date().toISOString(),
        is_purchased: false,
        list_id: null,
        purchased_by: null,
        quantity: 1,
        ...(isAmazon && { amazonLink: amazonLink.trim() }),
        ...(image && { image }),
      });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setItemName('');
    setIsAmazon(false);
    setAmazonLink('');
    setImage(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Item</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.text }]}
            placeholder="Item Name"
            placeholderTextColor={colors.text}
            value={itemName}
            onChangeText={setItemName}
          />
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: colors.text }]}>Amazon Item</Text>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={isAmazon ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsAmazon}
              value={isAmazon}
            />
          </View>
          {isAmazon && (
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.text }]}
              placeholder="Amazon Link"
              placeholderTextColor={colors.text}
              value={amazonLink}
              onChangeText={setAmazonLink}
            />
          )}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary, marginTop: 20 }]}
            onPress={handleAddItem}
          >
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginTop: 10,
    borderRadius: 8,
  },
});

