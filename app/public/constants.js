angular.module('levelPad').constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	logoutFailed: 'auth-logout-failed',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});


angular.module('levelPad').constant('USER_ROLES', {
	all: '*',
	admininstrator: 'admin',
	professor: 'professor',
	assistant: 'assistant',
	guest: 'guest',
	public: 'public',
});
