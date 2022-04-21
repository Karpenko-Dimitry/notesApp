import ApiRequestService from './ApiRequestService';

class NoteService {
    /**
     * Registration endpoint
     */
    public static async list() {
        return ApiRequestService.get('/notes');
    }
}

export default NoteService;
