# Test Execution API Contract

**Date**: 2025-12-11  
**Feature**: Comprehensive Test Suite

## Overview

This document defines the API contract for test execution in the BizFlow AI monorepo using Nx commands.

## Commands

### Run Tests for Specific Project

**Command**: `nx test <project-name>`

**Description**: Runs all tests for a specific Nx project

**Parameters**:

- `project-name`: string (required) - Name of the Nx project to test
  - Valid values: `ecommerce`, `realestate`, `pt`, `shared-types`, `shared-llm`, `shared-ui`, `web`

**Options**:

- `--coverage`: boolean (optional) - Generate coverage report
- `--watch`: boolean (optional) - Run tests in watch mode
- `--testPathPattern`: string (optional) - Run tests matching pattern
- `--testNamePattern`: string (optional) - Run tests matching name pattern
- `--passWithNoTests`: boolean (optional) - Pass if no tests found

**Response**:

- Exit code: 0 (success) or 1 (failure)
- Output: Test results, coverage report (if `--coverage`)

**Examples**:

```bash
# Run ecommerce module tests
nx test ecommerce

# Run tests with coverage
nx test ecommerce --coverage

# Run tests in watch mode
nx test ecommerce --watch

# Run specific test file
nx test ecommerce --testPathPattern=ecommerce-content-service
```

---

### Run All Tests

**Command**: `nx test --all`

**Description**: Runs all tests in the workspace

**Options**:

- `--coverage`: boolean (optional) - Generate coverage report
- `--parallel`: number (optional) - Number of parallel test runs

**Response**:

- Exit code: 0 (success) or 1 (failure)
- Output: Aggregated test results

**Examples**:

```bash
# Run all tests
nx test --all

# Run all tests with coverage
nx test --all --coverage

# Run all tests in parallel
nx test --all --parallel=3
```

---

### Run Affected Tests

**Command**: `nx affected:test`

**Description**: Runs tests only for projects affected by changes

**Options**:

- `--base`: string (optional) - Base branch/commit for comparison
- `--head`: string (optional) - Head branch/commit for comparison
- `--coverage`: boolean (optional) - Generate coverage report
- `--parallel`: number (optional) - Number of parallel test runs

**Response**:

- Exit code: 0 (success) or 1 (failure)
- Output: Test results for affected projects

**Examples**:

```bash
# Run affected tests
nx affected:test

# Run affected tests with coverage
nx affected:test --coverage

# Run affected tests compared to main branch
nx affected:test --base=main
```

---

### Run E2E Tests

**Command**: `npx playwright test` or `nx e2e web`

**Description**: Runs E2E tests using Playwright

**Options**:

- `--headed`: boolean (optional) - Run tests in headed mode
- `--browser`: string (optional) - Browser to use (chromium, firefox, webkit)
- `--project`: string (optional) - Run tests for specific project
- `--ui`: boolean (optional) - Run tests in UI mode

**Response**:

- Exit code: 0 (success) or 1 (failure)
- Output: E2E test results, trace files

**Examples**:

```bash
# Run all E2E tests
npx playwright test

# Run E2E tests in headed mode
npx playwright test --headed

# Run E2E tests for specific browser
npx playwright test --browser=firefox
```

---

## Test Target Configuration

Each project's `project.json` must define a test target:

```json
{
  "targets": {
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "<project-root>/jest.config.ts",
        "passWithNoTests": true
      }
    }
  }
}
```

## Error Codes

- `0`: Success - All tests passed
- `1`: Failure - One or more tests failed
- `2`: Error - Test execution error (configuration, setup, etc.)

## Response Format

### Success Response

```
Test Suites: 5 passed, 5 total
Tests:       25 passed, 25 total
Time:        3.456 s
```

### Failure Response

```
Test Suites: 4 passed, 1 failed, 5 total
Tests:       23 passed, 2 failed, 25 total
Time:        3.456 s
```

### Coverage Report

```
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   85.23 |    82.15 |   88.90 |   85.23 |
```

## Summary

The test execution API provides commands for running tests at project level, workspace level, and for affected projects. All commands support coverage reporting and various execution options. Test targets are configured in each project's `project.json` using the `@nx/jest:jest` executor.

