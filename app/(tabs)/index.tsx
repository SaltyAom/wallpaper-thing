import { useEffect, useReducer, useRef, useState } from 'react'
import {
	View,
	Text,
	SafeAreaView,
	Pressable,
	ActivityIndicator,
	Button,
	TextInput,
	useColorScheme,
	useWindowDimensions
} from 'react-native'
import { Image } from 'expo-image'
import Feather from '@expo/vector-icons/Feather'
import { MasonryFlashList } from '@shopify/flash-list'

import { useQuery } from '@tanstack/react-query'

import * as Haptics from 'expo-haptics'
import * as MediaLibrary from 'expo-media-library'

import { useThemeColor } from '@/hooks/use-theme-color'

interface API {
	version: string
	data: {
		[key: string]: {
			[key: string]: string
		}
	}
}

interface Wallpaper {
	name: string
	src: string
	width: number
	height: number
}

export default function Home() {
	const colorScheme = useColorScheme()
	const { width } = useWindowDimensions()

	const [search, setSearch] = useState('')
	const [isSearchShowing, toggleSearch] = useReducer((value) => {
		Haptics.selectionAsync()

		return !value
	}, false)
	const [isDownloaded, setDownloaded] = useState(false)

	useEffect(() => {
		if (!isDownloaded) return

		const dismiss = setTimeout(() => {
			setDownloaded(false)
		}, 3000)

		return () => {
			clearTimeout(dismiss)
		}
	}, [isDownloaded])

	const {
		data: images,
		isError,
		isPending,
		refetch
	} = useQuery({
		queryKey: ['getWallpaper'],
		queryFn: () =>
			fetch(
				'https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s'
			)
				.then((x) => x.json())
				.then((x: API) => {
					const results: Wallpaper[] = []

					for (const assets of Object.values(x.data)) {
						for (const link of Object.values(assets)) {
							if (!link.includes('/content/')) continue

							const query = new URLSearchParams(link)
							if (!query.get('w')) continue

							results.push({
								name: link
									.split('/')
									.at(-1)!
									.split('?')
									.at(0)!
									.toLowerCase(),
								src: link,
								width: +query.get('w')!,
								height: +query.get('h')!
							})

							break
						}
					}

					return results
				})
	})

	const colors = useThemeColor()

	return (
		<SafeAreaView className="relative flex flex-col flex-1">
			<View
				className="items-center z-10 absolute w-full bottom-2 pointer-events-none transition-opacity"
				style={{
					opacity: isDownloaded ? 1 : 0
				}}
			>
				<View
					className="px-8 py-2.5 rounded-full shadow-lg"
					style={{
						backgroundColor: colors.loading
					}}
				>
					<Text
						className="font-medium text-lg"
						style={{
							color: colors.text
						}}
					>
						Image saved
					</Text>
				</View>
			</View>
			<View className="flex flex-row justify-between items-center h-14">
				{isSearchShowing && (
					<View
						className="z-10 absolute w-full flex flex-row items-center h-14 z-1"
						style={{
							backgroundColor: colors.background
						}}
					>
						<Pressable
							className="flex justify-center items-center w-14 h-14 active:opacity-50"
							onPress={() => {
								toggleSearch()
								setSearch('')
							}}
						>
							<Feather name="x" size={24} color={colors.text} />
						</Pressable>
						<TextInput
							className="flex-1 h-14 text-xl dark:text-white -translate-y-0.5"
							placeholder="Search"
							value={search}
							onChangeText={(value) => {
								setSearch(value.toLowerCase())
							}}
							autoFocus
						/>
					</View>
				)}

				<Text className="text-3xl font-bold dark:text-white pl-4">
					Wallpaper Thing
				</Text>
				<Pressable
					className="justify-center items-center w-14 h-14 active:opacity-50"
					onPress={toggleSearch}
				>
					<Feather name="search" size={24} color={colors.text} />
				</Pressable>
			</View>

			{isPending ? (
				<ActivityIndicator className="my-auto" />
			) : isError ? (
				<View className="flex flex-1 justify-center items-center gap-4">
					<Text className="text-xl">Unable to load images</Text>
					<Button
						title="Retry"
						onPress={() => {
							refetch()
						}}
					/>
				</View>
			) : (
				images && (
					<MasonryFlashList
						data={
							!search
								? images
								: images.filter((x) => x.name.includes(search))
						}
						estimatedItemSize={300}
						numColumns={width <= 568 ? 2 : ~~(width / 256)}
						refreshing={isPending}
						onRefresh={refetch}
						renderItem={({
							columnIndex,
							item: { src, width, height }
						}) => (
							<Pressable
								onPressIn={() => {
									Haptics.selectionAsync()
								}}
								onPress={async () => {
									await MediaLibrary.saveToLibraryAsync(src)
									setDownloaded(true)
									Haptics.notificationAsync(
										Haptics.NotificationFeedbackType.Success
									)
								}}
								className={
									'transform active:scale-95 transition-transform duration-200 py-1 ' +
									(columnIndex === 0
										? 'pr-1 pl-2'
										: 'pl-1 pr-2')
								}
							>
								<Image
									key={src}
									source={{
										uri: src
									}}
									cachePolicy="memory-disk"
									style={{
										borderRadius: 12,
										aspectRatio: width / height,
										backgroundColor: colors.loading
									}}
								/>
							</Pressable>
						)}
					/>
				)
			)}
		</SafeAreaView>
	)
}

// <ScrollView className="flex flex-col px-4 gap-4">
// 	{images &&
// 		images.map(({ src, width, height }) => {
// 			return (
// 				<Image
// 					key={src}
// 					source={{
// 						uri: src,
// 					}}
// 					style={{
// 						aspectRatio: width / height,
// 					}}
// 					className="w-full bg-gray-200"
// 				/>
// 			)
// 		})}
// </ScrollView>
