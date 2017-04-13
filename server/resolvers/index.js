import { RestrictedMutation } from './mutation/restricted';
import { RestrictedQuery } from './query/restricted';
import { DateScalar as Date, JWTScalar as JWT } from './scalars';
import { UserResolve, PatientResolve } from './population';

import Mutation from './mutation';
import Query from './query';

const resolvers = {
	Query,
	Mutation,
	User: UserResolve,
	Patient: PatientResolve,
	RestrictedQuery,
	RestrictedMutation,
	Date,
	JWT
};
export default resolvers;
