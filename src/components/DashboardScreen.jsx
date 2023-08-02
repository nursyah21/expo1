import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { supabase } from '../lib/supabase'
import styles, { color } from './style'
import LoadingModal from './LoadingModal'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './dashboard/HomeScreen'
import SettingsScreen from './dashboard/SettingsScreen'
import FollowScreen from './dashboard/FollowScreen'
import SearchScreen from './dashboard/SearchScreen'

const Tab = createBottomTabNavigator();

const Header = () => {
  const logoLogin = require('../assets/logoLogin.png')

  return <>
    <View style={{backgroundColor: 'white', padding: 5, borderBottomWidth: .5, borderColor: color.disableColor, flexDirection: 'row', alignItems: 'center'}}>
      <View>
        <Image source={logoLogin} style={[styles.logoLogin, {width:40, height:40}]} />
      </View>
      <View style={{marginHorizontal: 10}}>
        <Text style={{color: color.primaryColor, fontWeight: 'bold'}}>Pejalan Hijau</Text>
      </View>
    </View>
  </>
}

export default function DashboardScreen({session}) {

  return (
    <View style={[styles.container]}>
      <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let icon
            if(route.name == "Home") {
              icon = <Ionicons name={'home'} size={size} color={color} />
            } else if (route.name == "Search") {
              icon = <Ionicons name={'search'} size={size} color={color} />
            } else if (route.name == "Follow") {
              icon = <Ionicons name={'person'} size={size} color={color} />
            } else if (route.name == "Settings") {
              icon = <Ionicons name={'settings'} size={size} color={color} />
            }
            return icon
          },

          tabBarActiveTintColor: color.primaryColor,
          tabBarInactiveTintColor: color.disableColor,
        })}>


        <Tab.Screen name="Home" options={{header: ()=><Header />}}>
            {(props) => 
            <HomeScreen {...props}  key={session?.user?.id} session={session} />
           }
        </Tab.Screen>
        <Tab.Screen name="Search" options={{header: ()=><Header />}}>
            {(props) => <SearchScreen {...props}  key={session?.user?.id} session={session} /> }
        </Tab.Screen>
        <Tab.Screen name="Follow" options={{header: ()=><Header />}}>
            {(props) => <FollowScreen {...props}  key={session?.user?.id} session={session} /> }
        </Tab.Screen>
        <Tab.Screen name="Settings" options={{header: ()=><Header />}}>
            {(props) => <SettingsScreen {...props}  key={session?.user?.id} session={session} /> }
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  )
}