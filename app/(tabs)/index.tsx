import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; 
import { Input } from '~/components/ui/input';
import * as React from 'react';

export default function Index() {

  const [value, setValue] = React.useState('');

  const onChangeText = (text: string) => {
    setValue(text);
    console.log("Input value: ", text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
      <Input
        placeholder='Write some stuff...'
        value={value}
        onChangeText={onChangeText}
        aria-labelledby='inputLabel'
        aria-errormessage='inputError'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});

