import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight } from '../constants/tokens';

import HomeScreen from '../screens/adult/HomeScreen';
import FamilyScreen from '../screens/adult/FamilyScreen';
import TasksScreen from '../screens/adult/TasksScreen';
import ApprovalScreen from '../screens/adult/ApprovalScreen';
import ProfileScreen from '../screens/adult/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AdultTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.adultPrimary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.bgPrimary,
          borderTopWidth: 1,
          borderTopColor: Colors.borderSubtle,
          paddingBottom: 6,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.caption,
          fontWeight: FontWeight.semibold,
          marginTop: 1,
        },
      }}
    >
      <Tab.Screen
        name="Hjem"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Familie"
        component={FamilyScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Oppgaver"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Godkjenn"
        component={ApprovalScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="check-circle" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
