import { AdminMutation, RestrictedMutation } from './mutation/restricted';
import { AdminQuery, RestrictedQuery } from './query/restricted';
import { DateScalar as Date, JWTScalar as JWT } from './scalars';
import { UserResolve, PictureResolve, QuestionResolve, RecallResolve, TopicResolve, CategoryResolve, ConceptResolve, MarksheetResolve, TodoResolve } from './population';

import Mutation from './mutation';
import Query from './query';

const resolvers = {
	Query,
	Mutation,
	Question: QuestionResolve,
	Recall: RecallResolve,
	Marksheet: MarksheetResolve,
	Todo: TodoResolve,
	Topic: TopicResolve,
	Category: CategoryResolve,
	Concept: ConceptResolve,
	Picture: PictureResolve,
	User: UserResolve,
	RestrictedQuery,
	RestrictedMutation,
	AdminQuery,
	AdminMutation,
	Date,
	JWT
};
export default resolvers;
