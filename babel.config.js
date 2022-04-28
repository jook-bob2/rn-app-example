module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['./src'],
				extensions: ['.ios.js', '.android.js', '.js', '.ios.jsx', '.android.jsx', '.jsx', '.js', '.json'],
				alias: {
					'@': './src',
					'@component': './src/components',
					'@container': './src/containers',
					'@module': './src/modules',
					'@screen': './src/screens',
					'@util': './src/utils',
					'@core': './src/core',
					'@api': './src/core/api',
					'@store': './src/core/store',
					'@theme': './src/theme',
					'@assets': './src/assets',
				},
			},
		],
		'react-native-reanimated/plugin',
	],
}
