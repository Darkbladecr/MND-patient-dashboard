import moment from 'moment';

function config($provide, $compileProvider, $qProvider, $mdDateLocaleProvider) {
	'ngInject';
	'use strict';

	$mdDateLocaleProvider.formatDate = date => {
		return date ? moment(date).format('DD/MM/YYYY') : null;
	};
	$mdDateLocaleProvider.parseDate = dateString => {
		const m = moment(dateString, 'DD/MM/YYYY', true);
		return m.isValid() ? m.toDate() : new Date(NaN);
	};

	// ignore errors when rejected promises not handeled
	$qProvider.errorOnUnhandledRejections(false);

	// Might need this to fix Angular Material problems?
	$compileProvider.preAssignBindingsEnabled(true);
	if (process.env.NODE_ENV === 'production') {
		$compileProvider.debugInfoEnabled(false);
		$compileProvider.commentDirectivesEnabled(false);
		$compileProvider.cssClassDirectivesEnabled(false);
	}

	// Text Angular options
	$provide.decorator('taOptions', [
		'$delegate',
		function(taOptions) {
			taOptions.toolbar = [
				[
					'bold',
					'italics',
					'underline',
					'ul',
					'ol',
					'quote',
					'insertImage',
					'insertLink',
					'html',
				],
			];

			taOptions.forceTextAngularSanitize = false;

			taOptions.classes = {
				focussed: 'focussed',
				toolbar: 'ta-toolbar',
				toolbarGroup: 'ta-group',
				toolbarButton: 'md-button',
				toolbarButtonActive: 'active',
				disabled: '',
				textEditor: 'form-control',
				htmlEditor: 'form-control',
			};

			return taOptions;
		},
	]);

	// Text Angular tools
	$provide.decorator('taTools', [
		'$delegate',
		function(taTools) {
			taTools.quote.iconclass = 'icon-format-quote';
			taTools.bold.iconclass = 'icon-format-bold';
			taTools.italics.iconclass = 'icon-format-italic';
			taTools.underline.iconclass = 'icon-format-underline';
			taTools.strikeThrough.iconclass = 'icon-format-strikethrough';
			taTools.ul.iconclass = 'icon-format-list-bulleted';
			taTools.ol.iconclass = 'icon-format-list-numbers';
			taTools.redo.iconclass = 'icon-redo';
			taTools.undo.iconclass = 'icon-undo';
			taTools.clear.iconclass = 'icon-close-circle-outline';
			taTools.justifyLeft.iconclass = 'icon-format-align-left';
			taTools.justifyCenter.iconclass = 'icon-format-align-center';
			taTools.justifyRight.iconclass = 'icon-format-align-right';
			taTools.justifyFull.iconclass = 'icon-format-align-justify';
			taTools.indent.iconclass = 'icon-format-indent-increase';
			taTools.outdent.iconclass = 'icon-format-indent-decrease';
			taTools.html.iconclass = 'icon-code-tags';
			taTools.insertImage.iconclass = 'icon-file-image-box';
			taTools.insertLink.iconclass = 'icon-link';
			taTools.insertVideo.iconclass = 'icon-filmstrip';

			return taTools;
		},
	]);
}
export default config;
