import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

import Paho from 'paho-mqtt';

client = new Paho.Client(
  'broker.hivemq.com',
  Number(8000),
  'estadoMotorPasos ${parseInt(Math.random() * 100)}'
)

export default function App() {

  const [estado, setEstado] = useState('OFF');
  const [pasos, setPasos] = useState(0);

  useEffect(() => {
    client.connect({
      onSuccess: () => {
        console.log("Connected!");
      },
      onFailure: () => {
        console.log("Failed to connect!");
      }
    });
  }, [])

  function enviarValores(e, p) {
    let mensaje1 = new Paho.Message(e.toString());
    let mensaje2 = new Paho.Message(p.toString());
    mensaje1.destinationName = 'estadoMotorPasos';
    mensaje2.destinationName = 'cantMotorPasos';
    try {
      client.send(mensaje1);
      console.log('Mensaje enviado');
    } catch (error) {
      console.log('Error al enviar mensaje: ', error);
    }

    try {
      client.send(mensaje2);
      console.log('Mensaje enviado');
    } catch (error) {
      console.log('Error al enviar mensaje: ', error);
    }
  }

  function cambiarEstado() {
    if (estado === 'OFF') {
      setEstado('ON');
    } else {
      setEstado('OFF');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>ESTADO:</Text>
      {/* <TextInput style={styles.entrada} placeholder="ON/OFF" onChangeText={setEstado}></TextInput> */}
      <TouchableOpacity style={estado === 'ON' ? styles.boton : styles.botonApagado} onPress={cambiarEstado}>
        <Text style={styles.textoBoton}>{estado}</Text>
      </TouchableOpacity>
      <Text style={styles.texto}>PASOS:</Text>
      <TextInput style={styles.entrada} placeholder="123..." onChangeText={setPasos}></TextInput>

      <TouchableOpacity style={styles.boton} onPress={() => enviarValores(estado, pasos)}>
        <Text style={styles.textoBoton}>ENVIAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entrada: {
    height: 40,
    borderColor: 'gray',
    borderRadius: 20,
    borderWidth: 1,
    width: 200,
    marginBottom: 10,
    textAlign: 'center'
  },
  texto: {
    color: 'blue',
    marginBottom: 10,
  },
  textoBoton: {
    color: 'white',
  },
  boton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 20,
    width: 200,
    alignItems: 'center',
    marginBottom: 10,
  },
  contBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  botonApagado: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
    width: 200,
    alignItems: 'center',
    marginBottom: 10,
  },
});
