# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-03-09

### Breaking Changes
None - fully backward compatible.

### Added

#### Batch Operations
- New `useOptimisticBatch` hook for grouping multiple mutations
- Start a batch, queue operations, then commit them together
- Useful for bulk operations and multi-select actions

#### Retry Logic
- New `useOptimisticQueue` hook with automatic retry
- Configurable max retries and delay
- Exponential backoff strategy
- Queue size tracking and status monitoring

#### Undo/Redo
- New `useOptimisticUndo` hook for history management
- Configurable history size (default 50 states)
- `canUndo` and `canRedo` flags for UI controls

#### Middleware System
- Extensible middleware architecture
- Built-in middleware: logging, analytics, validation
- `createMiddleware` helper for custom middleware chains

### Fixed

#### Multiple Rapid Mutation Rollback
- Fixed bug where only one item would rollback when deleting multiple items rapidly in failure mode
- Root cause: Each mutation stored its own snapshot, but only the last rollback would apply
- Solution: Baseline state tracking properly restores all items when mutations fail
- Affects all hooks: `useOptimisticList`, `useOptimisticValue`, `useOptimisticMap`, `useOptimisticSet`

### Improved

- Better state management with baseline state tracking
- Improved error handling for partial rollbacks with concurrent mutations
- Enhanced TypeScript types for better inference
- Performance optimizations to reduce re-renders
- Comprehensive documentation and examples

## [1.0.0] - 2024-03-01

### Initial Release

- `useOptimisticList` - List operations with add/remove/update
- `useOptimisticValue` - Single value updates
- `useOptimisticMap` - Map data structure operations
- `useOptimisticSet` - Set data structure operations
- Automatic rollback on failure
- TypeScript support
- Zero dependencies
