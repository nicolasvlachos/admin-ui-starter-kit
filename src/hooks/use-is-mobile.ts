import { useState, useEffect, useCallback } from 'react';

/**
 * Options for useIsMobile hook
 */
interface UseIsMobileOptions {
	/** Whether to check on window resize (default: true) */
	runOnResize?: boolean;
	/** Whether to run callback immediately if not mobile (default: true) */
	runImmediately?: boolean;
	/** Max width to consider as mobile (default: 768px) */
	mobileMaxWidth?: number;
}

/**
 * A comprehensive React hook that checks if the device is mobile using various methods.
 * Executes a callback function when the device is determined to NOT be mobile.
 *
 * @param notMobileCallback - Callback to execute when device is not mobile
 * @param options - Configuration options
 * @returns Whether the current device is mobile
 */
const useIsMobile = (
	notMobileCallback: () => void,
	options: UseIsMobileOptions = {},
): boolean => {
	const {
		runOnResize = true,
		runImmediately = true,
		mobileMaxWidth = 768,
	} = options;

	const [isMobile, setIsMobile] = useState(false);

	const checkIsMobile = useCallback(() => {
		// Method 1: User agent string check
		const userAgentCheck = (): boolean => {
			const ua = navigator.userAgent.toLowerCase();
			const mobileKeywords = [
				'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone',
				'opera mini', 'mobile', 'tablet', 'mobi',
			];
			return mobileKeywords.some(keyword => ua.includes(keyword));
		};

		// Method 2: Screen size check
		const screenSizeCheck = (): boolean => {
			return window.innerWidth <= mobileMaxWidth;
		};

		// Method 3: Touch capability check
		const touchCapabilityCheck = (): boolean => {
			return 'ontouchstart' in window ||
				navigator.maxTouchPoints > 0;
		};

		// Method 4: Device mobile check via userAgent for IEMobile
		const mobileDeviceCheck = (): boolean => {
			return navigator.userAgent.indexOf('IEMobile') !== -1;
		};

		// Method 5: Media query check
		const mediaQueryCheck = (): boolean => {
			return window.matchMedia(`(max-width: ${mobileMaxWidth}px)`).matches;
		};

		// Combined check (device is considered mobile if 3 or more methods return true)
		const checks = [
			userAgentCheck(),
			screenSizeCheck(),
			touchCapabilityCheck(),
			mobileDeviceCheck(),
			mediaQueryCheck(),
		];

		const mobileScore = checks.filter(check => check).length;
		const newIsMobile = mobileScore >= 3;

		// If device is not mobile and state changes, execute callback
		if (!newIsMobile && (isMobile || runImmediately)) {
			notMobileCallback();
		}

		setIsMobile(newIsMobile);
	}, [isMobile, mobileMaxWidth, notMobileCallback, runImmediately]);

	useEffect(() => {
		// Run check immediately
		checkIsMobile();

		// Set up resize listener if enabled
		let timeoutId: number | undefined;

		const handleResize = () => {
			// Debounce to avoid excessive checks
			if (timeoutId) {
				window.clearTimeout(timeoutId);
			}
			timeoutId = window.setTimeout(checkIsMobile, 250);
		};

		if (runOnResize) {
			window.addEventListener('resize', handleResize);
		}

		// Clean up event listener on unmount
		return () => {
			if (runOnResize) {
				window.removeEventListener('resize', handleResize);
				if (timeoutId) {
					window.clearTimeout(timeoutId);
				}
			}
		};
	}, [checkIsMobile, runOnResize]);

	return isMobile;
};

export default useIsMobile;