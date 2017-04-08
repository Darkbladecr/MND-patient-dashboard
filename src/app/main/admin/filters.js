const htmlToPlainText = () => {
	return function(text) {
		return text ? String(text).replace(/<[^>]+>/gm, '') : '';
	};
}
export { htmlToPlainText };
