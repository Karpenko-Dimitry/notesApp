import ApiRequestService from './ApiRequestService';

class AuthService {
    /**
     * Registration endpoint
     *
     * @param email
     * @param password
     */
    public static async signUp(data: {}) {
        return ApiRequestService.post('/users', data);
    }

    /**
     * Send SMS verification to phone number
     *
     * @param email
     * @param password
     */
    public static async phoneVerify(data: {}) {
        return ApiRequestService.post('/users/profile/phone-verify', data);
    }

    /**
     * Send SMS verification to phone number
     *
     * @param email
     * @param password
     */
    public static async phoneConfirm(code: string, data: object) {
        return ApiRequestService.post('/users/profile/phone-confirm', {
            ...{ code: code },
            ...data,
        });
    }

    /**
     * Registration validate endpoint
     *
     * @param data
     */
    public static async signUpValidate(data: {}) {
        return ApiRequestService.post('/users/validate', data);
    }

    /**
     * Authorization endpoint
     *
     * @param email
     * @param password
     */
    public static async signIn(email: string, password: string) {
        return ApiRequestService.post('/users/login', {
            email: email,
            password: password,
        });
    }

    /**
     * Fetch user profile
     *
     * @param data
     */
    public static async profile() {
        console.log('profile!');
        return ApiRequestService.get('/users/profile');
    }

    /**
     * Fetch user profile
     *
     * @param data
     */
    public static async updateProfile(data: object) {
        console.log('update profile!');
        return ApiRequestService.patch('/users/profile', data);
    }

    /**
     * Fetch user profile
     *
     * @param data
     */
    public static async addDeviceToken(type: string, token: string) {
        console.log('add device token!', '/users/profile/tokens', { type, token });
        return ApiRequestService.post('/users/profile/tokens', { type, token });
    }

    /**
     * Fetch user profile
     *
     * @param data
     */
    public static async signOut(type: string, token: string) {
        console.log('/users/sign-out', { type, token });
        return ApiRequestService._delete('/users/sign-out', { type, token });
    }
}

export default AuthService;
