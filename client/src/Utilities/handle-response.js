import { authenticationService } from '../Services/authenticationService';
import { useSnackbar } from 'notistack';

const useHandleResponse = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleResponse = response => {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    authenticationService.logout();
                    enqueueSnackbar('User Unauthorized', {
                        variant: 'error',
                    });
                }
                else if (response.status === 400) {
                    enqueueSnackbar('Bad Request', {
                        variant: 'error',
                    });
                }
                else if (response.status === 404) {
                    enqueueSnackbar('Not Found', {
                        variant: 'error',
                    });
                }
                else if (response.status >= 500) {
                    enqueueSnackbar('Server Error', {
                        variant: 'error',
                    });
                }

                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }

            return data;
        });
    };

    return handleResponse;
};

export default useHandleResponse;
