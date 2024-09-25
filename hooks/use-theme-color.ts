import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'

export function useThemeColor() {
	return Colors[useColorScheme() ?? 'light']
}
