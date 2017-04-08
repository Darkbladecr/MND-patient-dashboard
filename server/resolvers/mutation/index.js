import { activateUser, loginUser, registerUser, registerStripeToken } from './users';
import { admin, restricted } from '../restricted';

const Mutation = {
	registerUser,
	registerStripeToken,
	activateUser,
	loginUser,
	admin,
	restricted
};

export default Mutation;
