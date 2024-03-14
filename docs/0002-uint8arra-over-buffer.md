# 2. Uint8Arra-over-Buffer

Date: 2024-03-14

## Status

Accepted

## Context

I read an article on unsafety and compatibility issues of using `Buffer` and decided to use `Uint8Array` instead. The article is [here](https://sindresorhus.com/blog/goodbye-nodejs-buffer).

## Decision

Wherever possible use native `Uint8Array` methods instead of `Buffer` methods.
When not possible use package `uint8array-extras` to fill the gap.

## Consequences

The code will be safer and easier to make friendly for multiple environments.
