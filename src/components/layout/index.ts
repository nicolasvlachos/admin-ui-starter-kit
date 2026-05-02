/**
 * Layout — framework-neutral app shell primitives.
 *
 * Consumers compose these into app-specific shells and provide framework
 * navigation through `renderLink`, e.g.:
 *
 *   <AppSidebar
 *     navigationGroups={groups}
 *     renderLink={({ href, children, className }) => (
 *       <AppLink href={href ?? '#'} className={className}>{children}</AppLink>
 *     )}
 *   />
 */
export * from './layout.types';
export * from './hooks';
export * from './containers';
export * from './page';
export * from './header';
export * from './sidebar';
