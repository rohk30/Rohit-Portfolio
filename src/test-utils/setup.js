import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock matchMedia for tests that use responsive features
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock IntersectionObserver for components that use it
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
})

// Mock lucide-react icons to avoid resolution issues in tests
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  
  // Create a mock icon component factory
  const createMockIcon = (name) => {
    const MockIcon = ({ className, ...props }) => {
      return React.createElement('svg', { 
        'data-testid': `${name}-icon`, 
        className, 
        ...props 
      })
    }
    MockIcon.displayName = name
    return MockIcon
  }
  
  return {
    ...actual,
    ExternalLink: createMockIcon('ExternalLink'),
    Github: createMockIcon('Github'),
    Star: createMockIcon('Star'),
    X: createMockIcon('X'),
    Menu: createMockIcon('Menu'),
    ChevronRight: createMockIcon('ChevronRight'),
    Mail: createMockIcon('Mail'),
    Linkedin: createMockIcon('Linkedin'),
    Download: createMockIcon('Download'),
    Calendar: createMockIcon('Calendar'),
    MapPin: createMockIcon('MapPin'),
    Building2: createMockIcon('Building2'),
    BookOpen: createMockIcon('BookOpen'),
    Code: createMockIcon('Code'),
    FileText: createMockIcon('FileText'),
    Quote: createMockIcon('Quote'),
    Users: createMockIcon('Users'),
  }
})
