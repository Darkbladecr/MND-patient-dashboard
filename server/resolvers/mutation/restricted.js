import { preBuildTest, buildTest, upvoteChoice, saveMarksheet } from './restricted/marksheet';
import { buildTodo, scoreRecall, saveTodo } from './restricted/todo';
import { resetProgress, progressReport, addSubscription, reenableSubscription, cancelSubscription, updateCard } from './restricted/users';

import { addCategory, deleteCategory, editCategory } from './admin/categories';
import { addConcept, deleteConcept, editConcept } from './admin/concepts';
import { addQuestion, deleteQuestion, editQuestion } from './admin/questions';
import { addRecall, deleteRecall, editRecall } from './admin/recalls';
import { deletePicture, editPicture } from './admin/pictures';
import { deleteUser, resetPassword, resetPasswordPrep, updateUser } from './admin/users';

const RestrictedMutation = {
	resetPasswordPrep,
	resetPassword,
	updateUser,
	addSubscription,
	reenableSubscription,
	cancelSubscription,
	updateCard,

	preBuildTest,
	buildTest,
	upvoteChoice,
	saveMarksheet,
	buildTodo,
	scoreRecall,
	saveTodo,
	progressReport,
	resetProgress
};

const AdminMutation = {
	deleteUser,
	addQuestion,
	editQuestion,
	deleteQuestion,
	addRecall,
	editRecall,
	deleteRecall,
	addCategory,
	editCategory,
	deleteCategory,
	addConcept,
	editConcept,
	deleteConcept,
	editPicture,
	deletePicture
};

export { RestrictedMutation, AdminMutation };
