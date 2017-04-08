import { Kind } from 'graphql/language';

const DateScalar = {
	__parseValue(value) {
		return new Date(value); // value from the client
	},
	__serialize(value) {
		return value.getTime(); // value sent to the client
	},
	__parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			return parseInt(ast.value, 10); // ast value is always in string format
		}
		return null;
	},
};

const JWTScalar = {
	__parseValue: (value)=>value,
	__serialize: (value)=>value,
	__parseLiteral: (ast) => ast.value
};

export { DateScalar, JWTScalar };
