import { activateUser, loginUser, registerUser } from './users';
import { admin, restricted } from '../restricted';

const Mutation = {
	registerUser,
	activateUser,
	loginUser,
	admin,
	restricted
};

export default Mutation;
