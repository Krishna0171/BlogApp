// src/test/mockMuiIcons.ts
import { vi } from 'vitest';

vi.mock('@mui/icons-material', () => ({
  __esModule: true,
  // Provide a mock implementation for each icon used in the tests
  SettingsInputComponentOutlined: () => 'SettingsInputComponentOutlined',
  SettingsInputComponentRounded: () => 'SettingsInputComponentRounded',
  GitHub: () => 'GitHub', 
  Visibility: () => 'Visibility'
  // Add more icons as needed
}));
