type ErrorKey<T> = Extract<keyof T, string>;

type ErrorBag<T> = Partial<Record<ErrorKey<T> | 'server' | 'general', string>>;

export const useFormErrors = <T extends Record<string, unknown> = Record<string, unknown>>(
    errors?: ErrorBag<T>,
) => {

    const getError = (error: ErrorKey<T>) => {
        if (!errors) {
            return undefined;
        }

        return errors[error];
    };

    const hasError = (error: ErrorKey<T>) => {
        return errors !== undefined && errors[error] !== undefined;
    };

    return {
        getError,
        hasError,
    };
};
