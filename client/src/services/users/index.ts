import { BACKEND_URL } from '../../helpers/constants';

const getUsers = async () => {
    const response = await fetch(BACKEND_URL + '/users');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

const updateUserRole = async (userId: string, role: string) => {
    const response = await fetch(BACKEND_URL + '/users' + '/metadata/updateRole', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, userId }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

const deleteUser = async (userId: string) => {
    const response = await fetch(BACKEND_URL + '/users', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
    }
    return response.json();
}

const getUserCredits = async (userId: string) => {
    const response = await fetch(`${BACKEND_URL}/users/credits?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


export { getUsers, updateUserRole, deleteUser, getUserCredits };