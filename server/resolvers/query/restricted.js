import { user as adminUser, authors, users } from './admin/users';
import { question, questions } from './admin/questions';
import { recall, recalls } from './admin/recalls';
import { topic, topics } from './restricted/topics';
import { marksheets, marksheet } from './restricted/marksheets';
import { todos, todo } from './restricted/todos';
import { questions as restrictedQuestions } from './restricted/questions';
import { recalls as restrictedRecalls } from './restricted/recalls';
import { user } from './restricted/user';

import { categories } from './admin/categories';
import { concepts } from './admin/concepts';
import { pictures } from './admin/pictures';

const RestrictedQuery = {
	topic,
	topics,
	categories,
	user,
	marksheet,
	marksheets,
	todo,
	todos,
	questions: restrictedQuestions,
	recalls: restrictedRecalls
};

const AdminQuery = {
	question,
	questions,
	recall,
	recalls,
	user: adminUser,
	users,
	authors,
	concepts,
	pictures
}

export { RestrictedQuery, AdminQuery };
