import ApiRequestService from './ApiRequestService';

class FileService {
    /**
     * Registration endpoint
     */
    public static async store(data, headers = {}) {
        return ApiRequestService.post('/files', data, {...headers, ...{'Content-Type': 'multipart/form-data'}});
    }

    public static async download(id) {
        return ApiRequestService.get('/files/' + id);
    }

    /**
     * Registration endpoint
     */
    public static async remove(id) {
        return ApiRequestService._delete('/files/' + id);
    }
}

export default FileService;
