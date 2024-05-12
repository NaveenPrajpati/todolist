import React, {useState, useEffect} from 'react';
import {View, Text, Button, Modal, StyleSheet} from 'react-native';
import Voice from '@react-native-voice/voice';

const ListenVoice = ({onPress, visible, setVisible}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  let timer = null;

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setVisible(true);
      resetTimer();
    };
    Voice.onSpeechEnd = () => {
      setIsListening(false);
      setVisible(false);
      clearTimeout(timer);
    };
    Voice.onSpeechResults = event => {
      console.log('text--', event.value[0]);
      setText(event.value[0]);
      resetTimer();
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    startListening();
  }, []);

  const startListening = () => {
    Voice.start('en-US');
  };

  const stopListening = () => {
    Voice.stop();
    clearTimeout(timer);
  };

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (isListening) {
        Voice.stop();
      }
    }, 5000); // 5 seconds
  };

  return (
    <>
      {visible && (
        <View style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              stopListening();
              setVisible(!visible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  App is listening, you can speak...
                </Text>
                <Button
                  title="Stop Listening"
                  onPress={() => {
                    stopListening();
                    setVisible(false);
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
    color: 'black',
  },
});

export default ListenVoice;
