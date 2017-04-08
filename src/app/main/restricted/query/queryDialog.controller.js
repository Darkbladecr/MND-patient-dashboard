class controller {
	constructor($ngRedux, $mdDialog, metadata, MarksheetActions, $state, $scope) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.metadata = metadata;
		this.$state = $state;
		this.unsubscribe = $ngRedux.connect(this.mapStateToThis, MarksheetActions)(this);

		this.totals = {
			numUnseen: this.metadata.unseen.length,
			numSeenIncorrect: this.metadata.seenIncorrect.length,
			numSeenCorrect: this.metadata.seenCorrect.length
		};

		this.numQuestions = 20 > this.totals.numUnseen ? this.totals.numUnseen : 20;
		this.unseen = true;
		this.seenIncorrect = false;
		this.seenCorrect = false;
		this.numUnseen = this.numQuestions;
		this.numSeenIncorrect = 0;
		this.numSeenCorrect = 0;
		$scope.$watchGroup(['$ctrl.numQuestions', '$ctrl.unseen', '$ctrl.seenIncorrect', '$ctrl.seenCorrect'], (newValues, oldValues) => {
			return this.numberWatcher(newValues[0], oldValues[0]);
		});
	}
	mapStateToThis(state) {
		return {
			test: state.test
		};
	}
	$onDestroy() {
		this.unsubscribe();
	}
	numberReducer(choice, selection) {
		const total = this.totals[choice];
		const remaining = selection - total;
		this[choice] = remaining > 0 ? total : selection;
		return remaining;
	}
	numberWatcher(newVal, oldVal) {
		if (newVal && newVal !== oldVal) {
			let remaining;
			if (this.unseen) {
				remaining = this.numberReducer('numUnseen', newVal);
				if (remaining > 0 && this.seenIncorrect) {
					remaining = this.numberReducer('numSeenIncorrect', remaining);
					if (remaining > 0 && this.seenCorrect) {
						remaining = this.numberReducer('numSeenCorrect', remaining);
					} else {
						this.numSeenCorrect = 0;
					}
				} else if (remaining > 0 && this.seenCorrect) {
					this.numSeenIncorrect = 0;
					remaining = this.numberReducer('numSeenCorrect', remaining);
				} else {
					this.numSeenIncorrect = 0;
					this.numSeenCorrect = 0;
				}
			} else if (this.seenIncorrect) {
				this.numUnseen = 0;
				remaining = this.numberReducer('numSeenIncorrect', newVal);
				if (remaining > 0 && this.seenCorrect) {
					remaining = this.numberReducer('numSeenCorrect', remaining);
				} else {
					this.numSeenCorrect = 0;
				}
			} else if (this.seenCorrect) {
				this.numUnseen = 0;
				this.numSeenIncorrect = 0;
				remaining = this.numberReducer('numSeenCorrect', newVal);
			} else {
				this.numUnseen = 0;
				this.numSeenIncorrect = 0;
				this.numSeenCorrect = 0;
			}
		} else if (!this.unseen && !this.seenIncorrect && !this.seenCorrect) {
			this.numUnseen = 0;
			this.numSeenIncorrect = 0;
			this.numSeenCorrect = 0;
		}
	}
	startTest() {
		const limit = this.numUnseen + this.numSeenIncorrect + this.numSeenCorrect;
		let questions = [];
		if (this.unseen) {
			questions = [...questions, ...this.metadata.unseen];
		}
		if (this.seenIncorrect) {
			questions = [...questions, ...this.metadata.seenIncorrect];
		}
		if (this.seenCorrect) {
			questions = [...questions, ...this.metadata.seenCorrect];
		}

		const search = {
			questions: questions.slice(0, limit),
			topics: this.metadata.topics,
			categories: this.metadata.categories
		};
		this.buildTest(search).then(() => {
			this.$state.go('app.restricted_test');
			this.$mdDialog.hide();
		});
	}
	cancel() {
		this.$mdDialog.cancel();
	}
}

export default controller;
