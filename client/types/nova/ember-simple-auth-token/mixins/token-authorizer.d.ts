declare module 'ember-simple-auth-token/mixins/token-authorizer' {
    import Mixin from '@ember/object/mixin';

    interface TokenAuthorizer {
        authenticator: string | null;
    }

    const TokenAuthorizerMixin: Mixin<TokenAuthorizer>;

    export default TokenAuthorizerMixin;
}
