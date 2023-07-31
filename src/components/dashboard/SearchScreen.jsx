import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useState } from "react"
import LoadingModal from "../LoadingModal"
import styles from "../style"
import { supabase } from "../../lib/supabase"
import { DataTable } from 'react-native-paper'

const searchHandle = async (result,value, setResult, setMessage) => {
  if(value === '')return

  setMessage('please wait...')
  let { data: users, error } = await supabase.from('users').select('name').ilike('name', `%${value}%`)
  if(error){
    setResult([])
  }
  console.log(result)
  setResult(users)
  setMessage('')
}

function SearchScreen({session}){
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [result, setResult] = useState([])
    const [message, setMessage] = useState('')

    return (
      <View style={[styles.container, {padding: 10}]}>
        <LoadingModal visible={loading} />
        <TextInput
            maxLength={200}
            style={styles.input}
            onChangeText={setSearch}
            onSubmitEditing={()=>searchHandle(result,search, setResult, setMessage)}
            value={search}
            placeholder="Search user"
        />

        {message 
        ? <Text>{message}</Text>
        : !result.length ? null 
        : <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>No</DataTable.Title>
                <DataTable.Title>Username</DataTable.Title>
              </DataTable.Header>
              {result.map((e, idx)=><>
                <TouchableOpacity key={idx}>
                  <DataTable.Row>
                        <DataTable.Cell>{idx+1}</DataTable.Cell>
                        <DataTable.Cell>{e.name}</DataTable.Cell>
                  </DataTable.Row>
                </TouchableOpacity>
              </>)}
          </DataTable>
        </ScrollView>
        }
      </View>
    )
  }

  export default SearchScreen