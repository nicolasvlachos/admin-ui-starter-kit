/**
 * useApi — generic data-fetching hook with cancellation, transform, and typed
 * error reporting. The HTTP client is pluggable: by default it uses axios with
 * `withCredentials: true` (suitable for Sanctum / cookie-session APIs), but any
 * adapter conforming to `HttpAdapter` can be injected via the `httpAdapter`
 * option.
 *
 * Apps wire their HTTP client at the app boundary and pass it in (or rely on
 * the default). Components consuming the library MUST NOT import axios
 * directly — they take an instance of `useApi` or the adapter through props /
 * context. This keeps `base/` and `composed/` framework-agnostic.
 */
import axios, {
	type AxiosRequestConfig,
	AxiosError,
	type CancelTokenSource,
} from 'axios';
import { useState, useCallback, useRef } from 'react';

export interface ApiError {
	message: string;
	errors?: Record<string, string[]>;
	status?: number;
}

export interface UseApiState<T> {
	data: T | null;
	isLoading: boolean;
	error: ApiError | null;
}

/**
 * HTTP method shape consumers can target without importing axios. Mirrors the
 * subset of axios config the hook actually uses.
 */
export interface HttpRequest {
	url: string;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	data?: unknown;
	headers?: Record<string, string>;
	params?: Record<string, unknown>;
	timeout?: number;
	signal?: AbortSignal;
}

export interface HttpResponse<T = unknown> {
	data: T;
	status: number;
}

export interface HttpAdapter {
	request: <T = unknown>(req: HttpRequest) => Promise<HttpResponse<T>>;
	/** Throw if a request was aborted; used to skip error handling. */
	isCancel?: (err: unknown) => boolean;
}

/**
 * Default adapter wrapping axios. Apps that prefer fetch / ky / a custom
 * client can pass their own adapter to `useApi`.
 */
export const axiosAdapter: HttpAdapter = {
	async request<T>(req: HttpRequest): Promise<HttpResponse<T>> {
		const config: AxiosRequestConfig = {
			url: req.url,
			method: req.method,
			data: req.data,
			headers: req.headers,
			params: req.params,
			timeout: req.timeout,
			signal: req.signal,
			withCredentials: true,
		};
		const response = await axios(config);
		return { data: response.data as T, status: response.status };
	},
	isCancel: axios.isCancel,
};

export interface UseApiOptions<T> {
	immediate?: boolean;
	onSuccess?: (data: T) => void;
	onError?: (error: ApiError) => void;
	transform?: (data: unknown) => T;
	/** Override the HTTP client. Defaults to the bundled axios adapter. */
	httpAdapter?: HttpAdapter;
}

export interface UseApiReturn<T> extends UseApiState<T> {
	setData: (data: T | null) => void;
	resetData: () => void;
	get: (url: string) => Promise<T>;
	post: (url: string, data?: Record<string, unknown>) => Promise<T>;
	put: (url: string, data?: Record<string, unknown>) => Promise<T>;
	patch: (url: string, data?: Record<string, unknown>) => Promise<T>;
	delete: (url: string) => Promise<T>;
	request: (url: string, options?: Omit<HttpRequest, 'url'>) => Promise<T>;
}

export function useApi<T = unknown>(
	options: UseApiOptions<T> = {},
): UseApiReturn<T> {
	const adapter = options.httpAdapter ?? axiosAdapter;
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const cancelTokenRef = useRef<CancelTokenSource | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	const makeRequest = useCallback(
		async (
			url: string,
			requestOptions: Omit<HttpRequest, 'url'> = {},
		): Promise<T> => {
			// Cancel any in-flight request.
			if (cancelTokenRef.current) {
				cancelTokenRef.current.cancel('Request cancelled');
				cancelTokenRef.current = null;
			}
			if (abortRef.current) {
				abortRef.current.abort();
			}

			const controller = new AbortController();
			abortRef.current = controller;
			// Keep axios CancelToken in sync for axios adapter consumers.
			cancelTokenRef.current = axios.CancelToken.source();

			setIsLoading(true);
			setError(null);

			const headers: Record<string, string> = {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				...requestOptions.headers,
			};

			try {
				const response = await adapter.request<unknown>({
					...requestOptions,
					url,
					headers,
					signal: controller.signal,
				});

				const transformedData = options.transform
					? options.transform(response.data)
					: (response.data as T);

				setData(transformedData);
				options.onSuccess?.(transformedData);
				return transformedData;
			} catch (err) {
				const cancelled = adapter.isCancel?.(err) ?? false;
				if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) {
					throw err;
				}

				let apiError: ApiError;
				if (err instanceof AxiosError) {
					apiError = {
						message:
							((err.response?.data as Record<string, unknown> | undefined)?.message as
								| string
								| undefined) ||
							err.message ||
							'Request failed',
						errors:
							((err.response?.data as Record<string, unknown> | undefined)?.errors as
								| Record<string, string[]>
								| undefined) || {},
						status: err.response?.status || 0,
					};
				} else if (err instanceof Error) {
					apiError = { message: err.message, status: 0 };
				} else {
					apiError = { message: 'Network error occurred', status: 0 };
				}

				setError(apiError);
				options.onError?.(apiError);
				throw apiError;
			} finally {
				setIsLoading(false);
				abortRef.current = null;
				cancelTokenRef.current = null;
			}
		},
		[adapter, options],
	);

	const get = useCallback(
		(url: string) => {
			if (!url) throw new Error('URL is required');
			return makeRequest(url, { method: 'GET' });
		},
		[makeRequest],
	);

	const post = useCallback(
		(url: string, data?: Record<string, unknown>) =>
			makeRequest(url, { method: 'POST', data }),
		[makeRequest],
	);

	const put = useCallback(
		(url: string, data?: Record<string, unknown>) =>
			makeRequest(url, { method: 'PUT', data }),
		[makeRequest],
	);

	const patch = useCallback(
		(url: string, data?: Record<string, unknown>) =>
			makeRequest(url, { method: 'PATCH', data }),
		[makeRequest],
	);

	const deleteRequest = useCallback(
		(url: string) => {
			if (!url) throw new Error('URL is required');
			return makeRequest(url, { method: 'DELETE' });
		},
		[makeRequest],
	);

	const resetData = useCallback(() => {
		setData(null);
		setError(null);
	}, []);

	return {
		data,
		setData,
		resetData,
		isLoading,
		error,
		get,
		post,
		put,
		patch,
		delete: deleteRequest,
		request: makeRequest,
	};
}
