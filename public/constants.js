angular.module('levelPad').constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	loginRefreshed: 'auth-login-refreshed',
	logoutSuccess: 'auth-logout-success',
	logoutFailed: 'auth-logout-failed',
	signupSuccess: 'auth-signup-success',
	signupFailed: 'auth-signup-failed',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});


angular.module('levelPad').constant('USER_ROLES', {
	all: '*',
	administrator: 'administrator',
	lecturer: 'lecturer',
	assistent: 'assistent',
	student: 'student',
	guest: 'guest',
	public: 'public',
});
