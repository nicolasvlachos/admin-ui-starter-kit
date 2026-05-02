import {
    useCallback,
    useRef,
    useState,
    type ImgHTMLAttributes,
    type ReactNode,
} from 'react';
import { Skeleton } from '@/components/base/display/skeleton';
import { cn } from '@/lib/utils';

export interface LazyImageProps
    extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
    /** Fallback rendered on error (no src, or load failure). */
    fallback?: ReactNode;
    /** Class applied to the outer container that reserves layout space. */
    containerClassName?: string;
    /** Class applied to the skeleton placeholder. */
    skeletonClassName?: string;
    /** Callback after image loads successfully. */
    onLoaded?: () => void;
    /** Callback on load error. */
    onLoadError?: () => void;
}

/**
 * LazyImage — a layout-stable image component.
 *
 * Renders a container of fixed dimensions (driven by `containerClassName`)
 * with a Skeleton placeholder. Once the browser finishes loading the image,
 * the skeleton is removed and the image becomes visible.
 *
 * When the image is already in the browser cache (e.g. table re-render,
 * dialog close animation), it renders fully visible immediately — no
 * skeleton, no opacity transition, no flash.
 */
export function LazyImage({
    src,
    alt,
    className,
    containerClassName,
    skeletonClassName,
    fallback,
    onLoaded,
    onLoadError,
    ...rest
}: LazyImageProps) {
    // Track whether this was a cache hit on mount — if so, skip all transitions
    const wasCachedRef = useRef(false);
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);
    const prevSrcRef = useRef(src);

    // Reset state only when src actually changes to a different value
    if (src !== prevSrcRef.current) {
        prevSrcRef.current = src;
        wasCachedRef.current = false;
        setLoaded(false);
        setErrored(false);
    }

    const handleLoad = useCallback(() => {
        setLoaded(true);
        onLoaded?.();
    }, [onLoaded]);

    const handleError = useCallback(() => {
        setErrored(true);
        onLoadError?.();
    }, [onLoadError]);

    // Ref callback: detect browser cache hits synchronously on mount.
    // If cached, mark both loaded AND wasCached so we skip the transition.
    const imgRefCallback = useCallback(
        (node: HTMLImageElement | null) => {
            if (node && node.complete && node.naturalWidth > 0) {
                wasCachedRef.current = true;
                setLoaded(true);
            }
        },
        [],
    );

    // No src or error — render fallback
    if (!src || errored) {
        return (
            <div className={cn('relative overflow-hidden', containerClassName)}>
                {fallback ?? (
                    <Skeleton
                        className={cn('h-full w-full', skeletonClassName)}
                    />
                )}
            </div>
        );
    }

    const isCached = wasCachedRef.current;

    // Cache hit — render image directly, no container, no skeleton, no transition
    if (isCached && loaded) {
        return (
            <div className={cn('relative overflow-hidden', containerClassName)}>
                <img
                    ref={imgRefCallback}
                    src={src}
                    alt={alt ?? ''}
                    className={className}
                    {...rest}
                />
            </div>
        );
    }

    return (
        <div className={cn('relative overflow-hidden', containerClassName)}>
            {!loaded && (
                <Skeleton
                    className={cn(
                        'absolute inset-0 h-full w-full',
                        skeletonClassName,
                    )}
                />
            )}

            <img
                ref={imgRefCallback}
                src={src}
                alt={alt ?? ''}
                loading="lazy"
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                    'transition-opacity duration-150',
                    loaded ? 'opacity-100' : 'opacity-0',
                    className,
                )}
                {...rest}
            />
        </div>
    );
}

LazyImage.displayName = 'LazyImage';
