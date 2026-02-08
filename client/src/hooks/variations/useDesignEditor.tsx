import { useMutation } from '@tanstack/react-query';
import { designEditor } from '../../services/builder';
import { useNotifications } from '@toolpad/core';

const useDesignEditor = () => {
    const notifications = useNotifications();
    const { isPending, mutate } = useMutation({
        mutationFn: designEditor,
        onError: (error) => {
            notifications.show(error.message, {
                severity: 'error',
                autoHideDuration: 3000
            })
        }
    });

    return { isPending, mutate };
}

export default useDesignEditor