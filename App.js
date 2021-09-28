import React from 'react';
import price from 'crypto-price';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Everything} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const createTwoButtonAlert = () =>
  Alert.alert('Bitch get outta here', 'Tere baap ka app hai kya', [
    {
      text: 'Fuck You',

      style: 'cancel',
    },
    { text: 'Im sorry'},
  ]);

function Login({ navigation }) {
  const [tochange, onChange] = React.useState();
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.converter}
        onChangeText={onChange}
        value={tochange}></TextInput>
      <View style={{ paddingTop: 25 }}>
        <Button
          title="Login"
          onPress={() => {
            if (tochange == 'Hemang') {
              navigation.navigate('Home');
            }
            else{
              createTwoButtonAlert();
            }
          }}
        />
      </View>
    </View>
  );
}

class Everything extends React.Component {
  constructor() {
    super();
    this.cryptoIds = ['BTC', 'ETH', 'ADA', 'BNB', 'USDT', 'XRP', 'DOGE', 'SOL'];
    this.state = {
      cryptos: [
        { base: '', price: '' },
        { base: '', price: '' },
      ],
    };
  }
  async componentDidMount() {
    const getprice = (id) => price.getCryptoPrice('USD', id);
    const promises = [];
    this.cryptoIds.forEach((data) => {
      let temp = getprice(data);
      if (temp) {
        promises.push(temp);
      }
    });
    const values = await Promise.all(promises, getprice);
    const cryptos = values.map(({ base, price }) => ({ base, price }));
    this.setState({ cryptos: cryptos });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ paddingBottom: 50, textAlign: 'center', fontSize: 25 }}>
          BITUA
        </Text>
        <Child cryptos={this.state.cryptos}></Child>
      </View>
    );
  }
}

class Child extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: 0,
    };
  }
  render() {
    return (
      <View>
        <Picker
          onValueChange={(item, idx) =>
            this.setState({ ...this.state, selected: idx })
          }>
          {this.props.cryptos.map((obj, idx) => (
            <Picker.Item key={idx} label={obj.base} value={idx} />
          ))}
        </Picker>
        <Converter
          price={this.props.cryptos[this.state.selected].price}></Converter>
        <Counter base={this.props.cryptos[this.state.selected].base}> </Counter>
      </View>
    );
  }
}
let Converter = (props) => {
  const [tochange, onChange] = React.useState();
  return (
    <View style={{ paddingTop: 100 }}>
      <Text style={{ paddingBottom: 25 }}>
        conversion rate is {props.price} USD
      </Text>
      <TextInput
        style={styles.converter}
        onChangeText={onChange}
        value={tochange}></TextInput>
      <Text style={{ paddingLeft: 10, paddingTop: 25 }}>
        {tochange * props.price}
      </Text>
    </View>
  );
};

class Counter extends React.Component {
  constructor() {
    super();
    this.state = { '': '' };
  }
  update(change) {
    const changed = (this.state[this.props.base] || 0) + change;
    if (changed < 0) return;
    this.setState({
      ...this.state,
      [this.props.base]: changed,
    });
  }
  render() {
    return (
      <View style={{ paddingTop: 100 }}>
        <View style={{ paddingBottom: 25 }}>
          <Text>
            {this.props.base} in your wallet is{' '}
            {this.state[this.props.base] || 0}
          </Text>
        </View>
        <View style={{ paddingBottom: 25 }}>
          <Button title="add" onPress={() => this.update(1)}></Button>
        </View>
        <View>
          <Button title="sub" onPress={() => this.update(-1)}></Button>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: 100,
    flex: 1,
    backgroundColor: '#fff',
    textAlign: 'left',
  },
  converter: { borderWidth: 1, borderRadius: 1, paddingLeft: 10 },
});
