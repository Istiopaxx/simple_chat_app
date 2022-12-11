import { authenticationService } from '../Services/authenticationService';

function authHeader() {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.access_token) {
        return {
            Authorization: `Bearer ${currentUser.access_token}`,
            'Content-Type': 'application/json',
        };
    } else {
        return {};
    }
}

export default authHeader;
