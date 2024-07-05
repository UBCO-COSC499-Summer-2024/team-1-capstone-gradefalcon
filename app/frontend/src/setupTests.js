// setupTests.js
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import { configure } from '@testing-library/react';

// Enable fetchMock globally
fetchMock.enableMocks();

// Example of custom configuration
configure({ testIdAttribute: 'data-testid' });
