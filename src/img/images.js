export const imagesAssets = {
	hermonmanLogo: require('./hermonmanLogo.png'),
	hermonmanLogoEn: require('./hermonmanLogo-en.png'),
	hermonmanLogoHe: require('./hermonmanLogo-he.png'),
	facebook: require('./facebook.png'),
	gmail: require('./gmail.png'),
	hermonHeader: require('./hermon_header.png'),
	loading: require('./loadingGif.gif'),
};

export function getImage(imageName) {
	return imagesAssets[imageName];
}
