import ApiRequestService from './ApiRequestService';

class CategoryService {
    /**
     * Registration endpoint
     */
    public static async list() {
        return ApiRequestService.get('/categories');
    }
}

export default CategoryService;
