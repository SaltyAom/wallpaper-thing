import { SafeAreaView, Text, View } from 'react-native'

export default function TabTwoScreen() {
	return (
		<SafeAreaView>
			<View className="px-4">
			<View className="h-14 justify-center mb-2">
				<Text className="text-3xl font-bold dark:text-white">
					Wallpaper Thing
				</Text>
				</View>
				<Text className="dark:text-white text-lg">
					Free wallpaper app thingy w/o ads, tracking, or any other BS
				</Text>
				<Text className="dark:text-white text-lg">
					Just do whatever you want with it, idc
				</Text>
			</View>
		</SafeAreaView>
	)
}
