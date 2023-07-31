import { View, Text, TouchableOpacity } from "react-native"
import { useState } from "react"
import LoadingModal from "../LoadingModal"
import styles from "../style"
import { supabase } from "../../lib/supabase"

function HomeScreen({session}){
    const [loading, setLoading] = useState(false)
    const email = session?.user?.email
    const signOut = async () => {
      setLoading(true)
      await supabase.auth.signOut()
      setLoading(false)
    }
  
    return (
      <View style={[styles.container, {padding: 10}]}>
        <LoadingModal visible={loading} />
        <Text>Home</Text>
      </View>
    )
  }

  export default HomeScreen