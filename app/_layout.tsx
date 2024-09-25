import { useState } from 'react'
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider
} from '@react-navigation/native'
import { Stack } from 'expo-router'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useColorScheme } from '@/hooks/use-color-scheme'

import 'react-native-reanimated'

import '../global.css'

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const [client] = useState(() => new QueryClient())

	return (
		<ThemeProvider
			value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<QueryClientProvider client={client}>
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="+not-found" />
				</Stack>
			</QueryClientProvider>
		</ThemeProvider>
	)
}
