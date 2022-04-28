/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config')

module.exports = (async () => {
	const {
		resolver: { sourceExts, assetExts },
	} = await getDefaultConfig()

	return {
		transformer: {
			babelTransformerPath: require.resolve('react-native-svg-transformer'),
			getTransformOptions: async () => ({
				transform: {
					experimentalImportSupport: false,
					inlineRequires: true,
				},
			}),
		},
		resolver: {
			assetExts: assetExts.filter((ext) => ext !== 'svg'),
			sourceExts: [
				...sourceExts,
				'svg',
				'js', // note this has to be defined first or you get an error
				'json',
				'jsx',
				'mjs',
				// required because the react-native cli ignores `resolverMainFields`
				'ts',
				'tsx',
			],
		},
	}
})()
