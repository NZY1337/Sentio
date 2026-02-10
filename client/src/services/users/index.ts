import { BACKEND_URL } from '../../helpers/constants';

const getUsers = async (token: string) => {
    const response = await fetch(BACKEND_URL + '/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

const updateUserRole = async (userId: string, role: string, token: string) => {
    const response = await fetch(BACKEND_URL + '/users' + '/metadata/updateRole', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, userId }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

const deleteUser = async (userId: string, token: string) => {
    const response = await fetch(BACKEND_URL + '/users', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
    }
    return response.json();
}

const getUserCredits = async (userId: string, token: string) => {
    const response = await fetch(`${BACKEND_URL}/users/credits?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


export { getUsers, updateUserRole, deleteUser, getUserCredits };