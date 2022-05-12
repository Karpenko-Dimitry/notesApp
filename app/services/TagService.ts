import ApiRequestService from './ApiRequestService';

class TagService {
    /**
     * Registration endpoint
     */
    public static async list() {
        return ApiRequestService.get('/tags');
    }
}

export default TagService;
