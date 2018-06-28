import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from 'nova/config/environment';

export default OAuth2PasswordGrantAuthenticator.extend({
	serverTokenEndpoint: config.ENV.host + '/api/login'
});