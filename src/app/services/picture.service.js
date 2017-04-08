import deletePicture from '../graphql/admin/pictures/deletePicture.gql';
import editPicture from '../graphql/admin/pictures/editPicture.gql';
import searchPictures from '../graphql/admin/pictures/searchPictures.gql';

export default class pictureService {
	constructor(apollo, $http, AuthService, toastService, graphqlService) {
		'ngInject';
		this.apollo = apollo;
		this.AuthService = AuthService;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	search(topics = null) {
		return this.apollo.query({
				query: searchPictures,
				variables: {
					token: this.AuthService.getToken(),
					topic: topics
				},
				fetchPolicy: 'network-only'
			}).then(this.graphqlService.extract)
			.then(result => {
				return result.pictures;
			}, err => this.graphqlService.error(err));
	}
	update(_id, data) {
		return this.apollo.mutate({
				mutation: editPicture,
				variables: {
					token: this.AuthService.getToken(),
					_id,
					data
				}
			}).then(this.graphqlService.extract)
			.then(result => {
				return result.pictures;
			}, err => this.graphqlService.error(err));
	}
	delete(_id) {
		return this.apollo.mutate({
				mutation: deletePicture,
				variables: {
					token: this.AuthService.getToken(),
					_id
				}
			}).then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple(result.deletePicture);
				return;
			}, err => this.graphqlService.error(err));
	}
}
