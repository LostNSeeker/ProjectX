# Fixing Webpack Errors in Next.js 15

## Problem
Getting `TypeError: Cannot read properties of undefined (reading 'call')` when using:
- Next.js Image component (`next/image`)
- Dynamic imports with heavy components (THREE.js, framer-motion, etc.)
- Processing and Project pages

## Solutions Applied

### 1. Use Turbopack (Recommended)
Changed dev script to use Turbopack instead of Webpack:
```json
"dev": "next dev --turbo"
```

Turbopack is Next.js's new bundler that handles dynamic imports and Image components much better than Webpack.

### 2. Created SafeImage Wrapper
Created `src/components/ui/safe-image.tsx` that:
- Only renders Image component on client side (after mount)
- Provides SSR-safe placeholder
- Has fallback to regular `<img>` tag if Image component fails
- Prevents webpack from analyzing Image component during build

### 3. Updated Next.js Config
- Added webpack fallbacks for Node.js modules
- Added ignoreWarnings for webpack errors
- Configured external packages (three, @splinetool/runtime)
- Added image remote patterns

### 4. Dynamic Import Pattern
Changed from `next/dynamic` to manual dynamic imports in `useEffect`:
- Components load only after client-side mount
- Prevents webpack from statically analyzing modules
- Better error handling

## How to Use

1. **Clear cache and rebuild:**
   ```bash
   rm -rf .next node_modules/.cache
   npm run dev
   ```

2. **If using Turbopack:**
   - Dev server will use Turbopack automatically
   - No webpack errors should occur
   - Faster builds and hot reload

3. **If errors persist:**
   - Clear browser cache and service workers
   - Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
   - Check browser console for specific errors

## Files Modified

- `package.json` - Added `--turbo` flag to dev script
- `next.config.ts` - Updated webpack config and image settings
- `src/components/ui/safe-image.tsx` - New safe Image wrapper
- `src/components/blocks/scroll-expansion-hero.tsx` - Uses SafeImage
- `src/app/processing/page.tsx` - Uses manual dynamic imports
- `src/app/project/page.tsx` - Uses manual dynamic imports

## Alternative Solutions

If Turbopack doesn't work:
1. Update Next.js to latest version: `npm install next@latest`
2. Use Next.js canary: `npm install next@canary`
3. Disable image optimization temporarily: `unoptimized: true` in next.config.ts

## References

Based on StackOverflow solutions for similar issues:
- https://stackoverflow.com/questions/74847894/nextjs-image-component-error-cannot-read-properties-of-undefined-reading-call

