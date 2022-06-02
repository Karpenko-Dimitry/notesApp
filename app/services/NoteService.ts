import ApiRequestService from './ApiRequestService';

class NoteService {

    public static async list(data = {per_page: 20}) {
        return ApiRequestService.get('/notes', data);
    }
    
    public static async read(uid) {
        return ApiRequestService.get('/notes/' + uid);
    }
    
    public static async remove(uid) {
        return ApiRequestService._delete('/notes/' + uid);
    }

    public static async store(data, headers = {}) {
        return ApiRequestService.post('/notes', data, headers);
    }
    
    public static async update(uid, data) {
        return ApiRequestService.put('/notes/' + uid, data);
    }
}

export default NoteService;
