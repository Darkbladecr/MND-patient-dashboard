import { activateUser, loginUser, registerUser } from './users';
import { restricted } from '../restricted';

const Mutation = {
	registerUser,
	activateUser,
	loginUser,
	restricted
};

export default Mutation;
