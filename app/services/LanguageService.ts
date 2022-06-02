import ApiRequestService from './ApiRequestService';

class LanguageService {
    /**
     * Registration endpoint
     */
    public static async list() {
        return ApiRequestService.get('/languages');
    }
}

export default LanguageService;
