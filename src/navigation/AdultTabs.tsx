import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants/tokens';
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
        tabBarStyle: {
          backgroundColor: Colors.adultCard,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.adultAccent,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Hjem"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Familie"
        component={FamilyScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👨‍👩‍👧</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Oppgaver"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>✅</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Godkjenninger"
        component={ApprovalScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
