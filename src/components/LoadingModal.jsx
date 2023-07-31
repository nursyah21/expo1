import { View, Text, Modal } from 'react-native'
import styles from './style'

export default function LoadingModal({visible=false, message='Please wait...'}) {
  return (
    <Modal
        animationType="fade"
        visible={visible}
        onRequestClose={() => {}
    }>
        <View style={styles.center}>
            <Text style={{textAlign: 'center'}}>{message}</Text>
        </View>
    </Modal>
  )
}