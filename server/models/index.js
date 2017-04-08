import CategorySchema from './category';
import ConceptSchema from './concept';
import MarksheetSchema from './marksheet';
import PictureSchema from './picture';
import QuestionSchema from './question';
import RecallSchema from './recall';
import TodoSchema from './todo';
import TempUserSchema from './tempuser';
import TopicSchema from './topic';
import UserSchema from './user';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ques');

const Question = mongoose.model('Question', QuestionSchema, 'questions');
const Recall = mongoose.model('Recall', RecallSchema, 'recalls');
const Topic = mongoose.model('Topic', TopicSchema, 'topics');
const Category = mongoose.model('Category', CategorySchema, 'categories');
const Concept = mongoose.model('Concept', ConceptSchema, 'concepts');
const User = mongoose.model('User', UserSchema, 'users');
const TempUser = mongoose.model('TempUser', TempUserSchema, 'tempusers');
const Marksheet = mongoose.model('Marksheet', MarksheetSchema, 'marksheets');
const Todo = mongoose.model('Todo', TodoSchema, 'todos');
const Picture = mongoose.model('Picture', PictureSchema, 'pictures');

export { Question, Recall, Topic, Category, Concept, User, TempUser, Marksheet, Todo, Picture };

if (process.env.NODE_ENV === 'production') {
	require('./questionCleanUp');
	require('./userCleanUp');
}
