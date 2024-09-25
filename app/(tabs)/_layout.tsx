import { Tabs } from 'expo-router'

import Feather from '@expo/vector-icons/Feather'

import { useThemeColor } from '@/hooks/use-theme-color'

export default function TabLayout() {
	const colors = useThemeColor()

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.tint,
				headerShown: false,
				tabBarShowLabel: false
			}}
			sceneContainerStyle={{
				backgroundColor: colors.background
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Gallery',
					tabBarIcon: ({ color, focused }) => (
						<Feather name="home" size={24} color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: 'Settings',
					tabBarIcon: ({ color, focused }) => (
						<Feather name="tool" size={24} color={color} />
					)
				}}
			/>
		</Tabs>
	)
}
