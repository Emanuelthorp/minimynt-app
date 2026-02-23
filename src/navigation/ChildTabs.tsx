import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight } from '../constants/tokens';

import TasksScreen from '../screens/child/TasksScreen';
import WaitingScreen from '../screens/child/WaitingScreen';
import ProfileScreen from '../screens/child/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function ChildTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.childPrimary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.bgPrimary,
          borderTopWidth: 1,
          borderTopColor: Colors.borderDefault,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.caption,
          fontWeight: FontWeight.medium,
        },
      }}
    >
      <Tab.Screen
        name="Oppgaver"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Venter"
        component={WaitingScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="clock" size={size} color={color} />,
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
