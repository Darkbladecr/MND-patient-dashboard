var hljs = require('highlightjs/highlight.pack');
import 'highlightjs/styles/default.css';
import angular from 'angular';

function hljsDirective($timeout, $q, $interpolate) {
	'ngInject';
	return {
		restrict: 'E',
		compile: (element, attr) => {
			let code;
			//No attribute? code is the content
			if(!attr.code) {
				code = element.html();
				element.empty();
			}

			return(scope, element, attr) => {

				if(attr.code) {
					// Attribute? code is the evaluation
					code = scope.$eval(attr.code);
				}
				const shouldInterpolate = scope.$eval(attr.shouldInterpolate);

				$q.when(code).then(function(code) {
					if(code) {
						if(shouldInterpolate) {
							code = $interpolate(code)(scope);
						}
						const contentParent = angular.element(
							'<pre><code class="highlight" ng-non-bindable></code></pre>'
						);
						element.append(contentParent);
						// Defer highlighting 1-frame to prevent GA interference...
						$timeout(() => {
							render(code, contentParent);
						}, 34, false);
					}
				});

				function render(contents, parent) {

					const codeElement = parent.find('code');
					let lines = contents.split('\n');

					// Remove empty lines
					lines = lines.filter(line => line.trim().length);

					// Make it so each line starts at 0 whitespace
					const firstLineWhitespace = lines[0].match(/^\s*/)[0];
					const startingWhitespaceRegex = new RegExp('^' + firstLineWhitespace);
					lines = lines.map(line =>
						line
						.replace(startingWhitespaceRegex, '')
						.replace(/\s+$/, '')
					);

					const highlightedCode = hljs.highlight(attr.language || attr.lang, lines.join('\n'), true);
					highlightedCode.value = highlightedCode.value
						.replace(/=<span class="hljs-value">""<\/span>/gi, '')
						.replace('<head>', '')
						.replace('<head/>', '');
					codeElement.append(highlightedCode.value).addClass('highlight');
				}
			};
		}
	};
}
export default hljsDirective;
