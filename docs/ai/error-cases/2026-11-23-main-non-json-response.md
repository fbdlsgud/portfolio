# Main page crashes with an HTML API response

## Symptom

During a local production-build check, the main page became blank and lost its navigation after loading project and comment data.

## Root Cause

The local build used relative API URLs. The SPA host returned its HTML fallback for those URLs. The frontend stored the responses as lists and crashed when React tried to render them with `map`.

## Fix

Only update the project and comment lists with arrays, and only update the visit counts when both fields are numeric.

## Validation

The app test passes with an HTML API response and verifies that the navigation, project heading, and comment heading still render.

## Lesson

When an SPA host can return its HTML fallback for an API path, check response shapes before storing data that affects rendering.
