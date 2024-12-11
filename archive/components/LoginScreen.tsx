import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { checkUserEmailExists } from "@/utils/supabase/service";
import { useAuth } from "./AuthContext";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setpasswordConfirmation] = useState("");
  const [showPasswordConfirmation, setshowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const [showPassword, setShowPassword] = useState(false);

  const { user, login, logout } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get the current color scheme (light or dark)
  const { isDarkColorScheme } = useColorScheme();

  // Determine if we're in dark mode
  const isDarkMode = isDarkColorScheme;

  const colors = {
    background: isDarkMode ? '#1f2937' : '#f3f4f6',
    text: isDarkMode ? '#f9fafb' : '#111827',
    subtext: isDarkMode ? '#9ca3af' : '#6b7280',
    input: {
      background: isDarkMode ? '#374151' : '#ffffff',
      text: isDarkMode ? '#f9fafb' : '#111827',
      border: isDarkMode ? '#4b5563' : '#d1d5db',
    },
    button: {
      background: '#3b82f6',
      text: '#ffffff',
    },
    error: '#ef4444',
  };

  // Simulated backend check (replace with actual API call)
  const checkUserExists = async (email: string): Promise<boolean> => {
    // use backend service to see if email is valid
    return await checkUserEmailExists(email);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      setErrorMessage('Please enter an email address');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    try {
      const userExists = await checkUserExists(email);
      setIsNewUser(!userExists);
      setStep('password');
    } catch (error) {
      setErrorMessage('Error checking email. Please try again.');
    }
    setIsLoading(false);
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setErrorMessage('Please enter a password');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login(email, password);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);

    // if user is logged in, reset login flow to original state
    if (user) {
      setEmail('');
      setPassword('');
      setIsLoading(false);
      setShowPassword(false);
      setStep('email');
    } else {
      // if user is not logged in, navigate to home
      console.log("not resetting login since user is not logged in");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome</Text>
      {!user && 
      <View>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Please login or create account to continue</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          {step === 'email' ? 'Enter your email to get started' : isNewUser ? 'Create a new password' : 'Enter your password to login'}
        </Text>

      {step === 'email' ? (
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input.background, borderColor: colors.input.border, color: colors.input.text }]}
            placeholder="name@example.com"
            placeholderTextColor={colors.subtext}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput, { backgroundColor: colors.input.background, borderColor: colors.input.border, color: colors.input.text }]}
              placeholder={isNewUser ? "Create a password" : "Enter your password"}
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color={colors.subtext}
              />
            </TouchableOpacity>
          </View>
          {isNewUser && 
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput, { backgroundColor: colors.input.background, borderColor: colors.input.border, color: colors.input.text }]}
                placeholder={"Confirm password"}
                placeholderTextColor={colors.subtext}
                value={passwordConfirmation}
                onChangeText={setpasswordConfirmation}
                secureTextEntry={!showPasswordConfirmation}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setshowPasswordConfirmation(!showPasswordConfirmation)}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPasswordConfirmation ? 'eye-off' : 'eye'}
                  size={24}
                  color={colors.subtext}
                />
              </TouchableOpacity>
              </View>
            } 
        </View>
      )}
      {errorMessage ? <Text style={[styles.errorMessage, { color: colors.error }]}>{errorMessage}</Text> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.button.background, opacity: isLoading ? 0.7 : 1 }]}
        onPress={step === 'email' ? handleEmailSubmit : handlePasswordSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.button.text} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.button.text }]}>
            {step === 'email' ? 'Continue' : isNewUser ? 'Sign Up' : 'Login'}
          </Text>
        )}
      </TouchableOpacity>

      {step === 'password' && (
        <TouchableOpacity style={styles.backButton} onPress={() => setStep('email')}>
          <Text style={[styles.backButtonText, { color: colors.subtext }]}>Back to email</Text>
        </TouchableOpacity>
      )}  
      </View>
    }

      {user && (
        <View>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>You are logged in as {user.shoppiUser.email}</Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.button.background }]} 
            onPress={logout}
          >
            <Text style={[styles.buttonText, { color: colors.button.text }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>Successfully logged in!</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose, { backgroundColor: colors.button.background }]}
              onPress={handleSuccessModalClose}
            >
              <Text style={[styles.buttonText, { color: colors.button.text }]}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 10,
  },
  button: {
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
  },
  errorMessage: {
    marginBottom: 12,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonClose: {
    marginTop: 10,
  },
});
