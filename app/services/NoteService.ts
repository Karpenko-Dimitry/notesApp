import ApiRequestService from './ApiRequestService';

class NoteService {
    /**
     * Registration endpoint
     */
    public static async list(data = {per_page: 20}) {
        return ApiRequestService.get('/notes', data);
    }
}

export default NoteService;
