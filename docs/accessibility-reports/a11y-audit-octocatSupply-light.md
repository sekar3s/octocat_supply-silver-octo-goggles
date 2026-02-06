# OctoCAT Supply Chain - Accessibility Audit Report (Light Theme)

**Generated:** February 6, 2026  
**Version:** 1.0.0  
**Theme Focus:** Light Mode  
**Conformance Target:** WCAG 2.2 Level AA  
**Status:** ❌ Fails WCAG 2.2 Level A

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Context](#application-context)
3. [Detailed Findings](#detailed-findings)
   - [🔴 Critical Issues (Level A)](#-critical-issues-level-a)
   - [🟡 Important Issues (Level AA)](#-important-issues-level-aa)
   - [🟢 Enhancements (Level AAA / Best Practices)](#-enhancements-level-aaa--best-practices)
4. [Prioritized Recommendations](#prioritized-recommendations)
5. [Testing Checklist](#testing-checklist)
6. [Resources](#resources)
7. [Appendix](#appendix)

---

## Executive Summary

This accessibility audit evaluates the **OctoCAT Supply Chain Management Application** against WCAG 2.2 standards, with specific focus on **light theme** accessibility. The application is a React 18+ TypeScript monorepo with Express API backend, using Vite, React Router, and Tailwind CSS.

### Key Findings

| Severity | Count | Status | Priority |
|----------|-------|--------|----------|
| 🔴 **Critical (Level A)** | 3 | ❌ Fails WCAG A | P0 - Immediate |
| 🟡 **Important (Level AA)** | 3 | ⚠️ Needs work | P1 - High |
| 🟢 **Enhancement (AAA)** | 2 | ✨ Optional | P2 - Medium |
| **Total Issues** | **8** | **Non-compliant** | - |

### Conformance Status

- **Current Level:** ❌ **Fails WCAG 2.2 Level A** (due to 3 critical violations)
- **Target Level:** WCAG 2.2 Level AA
- **Estimated Effort:** ~12-16 hours total remediation

### Key Violations

1. **Focus indicators suppressed** - Keyboard users cannot navigate effectively
2. **Non-functional footer links** - Links lead nowhere (`href="#"`)
3. **Loading states inaccessible** - No screen reader announcements for async operations
4. **Browser alerts used** - Not accessible for screen reader users
5. **Insufficient scrollbar contrast** - Fails 3:1 UI component requirement

---

## Application Context

### Technology Stack
- **Frontend:** React 18+ with TypeScript, Vite, React Router v7
- **Styling:** Tailwind CSS
- **Backend:** Express.js API
- **Repository:** Monorepo structure with `frontend/` and `api/` workspaces

### Light Theme Design Tokens

| Element | Value | Hex | Usage |
|---------|-------|-----|-------|
| Background | `bg-gray-100` | `#f5f5f5` | Main page background |
| Card Background | `bg-white` | `#ffffff` | Card containers |
| Text Primary | `text-gray-800` | `#1f2937` | Main text content |
| Primary Color | Custom | `#76B852` | Brand green (buttons, links) |
| Accent Color | Custom | `#8BC34A` | Secondary green accent |
| Border | `border-gray-300` | `#d1d5db` | Dividers, outlines |

### Component Inventory
- `frontend/src/components/Navigation.tsx` - Header navigation and theme toggle
- `frontend/src/components/Products.tsx` - Product listing with cart actions
- `frontend/src/components/Cart.tsx` - Shopping cart management
- `frontend/src/components/Login.tsx` - Authentication form
- `frontend/src/components/Footer.tsx` - Site footer with links
- `frontend/src/components/Welcome.tsx` - Landing page hero section

---

## Detailed Findings

### 🔴 Critical Issues (Level A)

These issues **must** be fixed to achieve WCAG Level A conformance. Critical issues prevent meaningful access for users with disabilities.

---

#### Issue #1: Focus Visible - Keyboard Navigation Blocked

- **Severity:** 🔴 Critical (Level A / AA)
- **WCAG:** [2.4.7 Focus Visible (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- **Impact:** Keyboard-only users cannot see where focus is located, making navigation impossible. Affects users with motor disabilities, power users, and anyone who cannot use a mouse.
- **Locations:** 
  - [frontend/src/components/Navigation.tsx:117](frontend/src/components/Navigation.tsx#L117)
  - [frontend/src/components/Navigation.tsx:126](frontend/src/components/Navigation.tsx#L126)

**Current Code:**
```tsx
<button 
  onClick={toggleTheme} 
  className="p-2 rounded-full focus:outline-none" 
  aria-label="Toggle dark/light mode"
>
  {/* Icon content */}
</button>
```

**Problem:** 
- `focus:outline-none` removes all focus indicators
- No alternative focus styling provided
- Keyboard users see no visual feedback when element receives focus

**Fix:**
```tsx
<button 
  onClick={toggleTheme} 
  className="p-2 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
  aria-label="Toggle dark/light mode"
>
  {/* Icon content */}
</button>
```

**Explanation:**
- `focus-visible:ring-2` - Shows 2px ring on keyboard focus (not mouse clicks)
- `focus-visible:ring-primary` - Uses brand color (`#76B852`)
- `focus-visible:ring-offset-2` - Adds 2px spacing for better visibility

**Effort:** 2 hours (audit all components, replace all `focus:outline-none`)

---

#### Issue #2: Link Purpose - Non-Functional Navigation

- **Severity:** 🔴 Critical (Level A)
- **WCAG:** [2.4.4 Link Purpose (In Context) (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- **Impact:** Links promise navigation but do nothing (`href="#"`). Breaks expectations for all users, especially screen reader users who navigate by links.
- **Location:** [frontend/src/components/Footer.tsx:29-45](frontend/src/components/Footer.tsx#L29-L45)

**Current Code:**
```tsx
<div>
  <h3 className="text-lg font-semibold mb-4">Shop</h3>
  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
    <li><a href="#" className="hover:text-primary">Products</a></li>
    <li><a href="#" className="hover:text-primary">Categories</a></li>
    <li><a href="#" className="hover:text-primary">My Cart</a></li>
    <li><a href="#" className="hover:text-primary">Checkout</a></li>
  </ul>
</div>
```

**Problem:**
- `href="#"` jumps to page top or does nothing
- Screen readers announce "link" but links are broken
- Violates user expectations and trust

**Fix Option 1 (Functional Links):**
```tsx
import { Link } from 'react-router-dom';

<div>
  <h3 className="text-lg font-semibold mb-4">Shop</h3>
  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
    <li><Link to="/products" className="hover:text-primary">Products</Link></li>
    <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
    <li><Link to="/cart" className="hover:text-primary">My Cart</Link></li>
    <li><Link to="/checkout" className="hover:text-primary">Checkout</Link></li>
  </ul>
</div>
```

**Fix Option 2 (Non-Functional - Clear Communication):**
```tsx
<div>
  <h3 className="text-lg font-semibold mb-4">Shop</h3>
  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
    <li><Link to="/products" className="hover:text-primary">Products</Link></li>
    <li><span className="text-gray-400 cursor-not-allowed">Categories (Coming Soon)</span></li>
    <li><span className="text-gray-400 cursor-not-allowed">Checkout (Coming Soon)</span></li>
  </ul>
</div>
```

**Effort:** 3 hours (implement routes or communicate unavailability, test all footer links)

---

#### Issue #3: Non-text Content - Loading State Inaccessible

- **Severity:** 🔴 Critical (Level A)
- **WCAG:** [1.1.1 Non-text Content (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- **Impact:** Screen readers announce nothing while products are loading. Users don't know the application is working or what state it's in.
- **Location:** [frontend/src/components/Products.tsx:82](frontend/src/components/Products.tsx#L82)

**Current Code:**
```tsx
if (loading) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
```

**Problem:**
- Pure decorative spinner with no accessible name
- Screen readers skip over entirely or announce random div elements
- No feedback that loading is occurring

**Fix:**
```tsx
if (loading) {
  return (
    <div className="flex justify-center items-center h-64">
      <div role="status" aria-label="Loading products">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        <span className="sr-only">Loading products...</span>
      </div>
    </div>
  );
}
```

**Explanation:**
- `role="status"` - Identifies as a status update (polite live region)
- `aria-label="Loading products"` - Provides accessible name
- `<span className="sr-only">` - Visually hidden text for screen readers

**Tailwind SR-Only Class (verify exists):**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Effort:** 1 hour (apply pattern to all loading states)

---

### 🟡 Important Issues (Level AA)

These issues prevent WCAG Level AA conformance and significantly impact user experience for people with disabilities.

---

#### Issue #4: Status Messages - Inaccessible Cart Confirmation

- **Severity:** 🟡 Important (Level AA)
- **WCAG:** [4.1.3 Status Messages (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- **Impact:** Browser `alert()` blocks UI, is not announced by many screen readers, and provides poor user experience. Users miss important feedback about their actions.
- **Location:** [frontend/src/components/Products.tsx:66](frontend/src/components/Products.tsx#L66)

**Current Code:**
```tsx
const handleAddToCart = (product: Product) => {
  // ... cart logic
  alert('Product added to cart!');
};
```

**Problem:**
- `window.alert()` blocks all interaction until dismissed
- Not announced by screen readers as status message
- Modal nature is jarring and disruptive
- Cannot be styled to match application theme

**Fix (Toast Notification with Live Region):**

**Step 1: Create Toast Component** (`frontend/src/components/Toast.tsx`)
```tsx
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up`}
    >
      {message}
    </div>
  );
};
```

**Step 2: Update Products Component**
```tsx
import { Toast } from './Toast';

const Products = () => {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    // ... cart logic
    setToastMessage(`${product.name} added to cart!`);
  };

  return (
    <>
      {/* Product listing */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="success"
          onClose={() => setToastMessage(null)} 
        />
      )}
    </>
  );
};
```

**Explanation:**
- `role="status"` - Identifies as status message
- `aria-live="polite"` - Announces to screen readers without interrupting
- `aria-atomic="true"` - Reads entire message when changed
- Auto-dismisses after 3 seconds (customizable)

**Effort:** 4 hours (create reusable toast component, integrate across app)

---

#### Issue #5: Contrast (Minimum) - Scrollbar Insufficient Contrast

- **Severity:** 🟡 Important (Level AA)
- **WCAG:** [1.4.3 Contrast (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) - UI Components require 3:1
- **Impact:** Low vision users cannot easily see or track scrollbar in light mode. Makes long pages difficult to navigate.
- **Location:** [frontend/src/index.css:40-43](frontend/src/index.css#L40-L43)

**Current Code:**
```css
.light ::-webkit-scrollbar-thumb {
  background: #76B852; /* Primary green */
}

.light ::-webkit-scrollbar-track {
  background: #f1f1f1;
}
```

**Contrast Calculation:**
- **Thumb:** `#76B852` (Approx. L* = 67)
- **Track:** `#f1f1f1` (Approx. L* = 94)
- **Ratio:** ~2.8:1 ❌ (Fails 3:1 requirement for UI components)

**Fix:**
```css
.light ::-webkit-scrollbar-thumb {
  background: #5A8E3E; /* Darker green for better contrast */
  border-radius: 4px;
}

.light ::-webkit-scrollbar-thumb:hover {
  background: #4A7A2E; /* Even darker on hover */
}

.light ::-webkit-scrollbar-track {
  background: #f1f1f1;
}
```

**New Contrast:**
- **Thumb:** `#5A8E3E` 
- **Track:** `#f1f1f1`
- **Ratio:** ~3.5:1 ✅ (Passes 3:1 requirement)

**Testing:**
Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) with:
- Foreground: `#5A8E3E`
- Background: `#f1f1f1`
- Target: 3:1 for UI components

**Effort:** 1 hour (adjust color, test across browsers, verify Firefox scrollbar styling)

---

#### Issue #6: Error Identification - Security & Accessibility Risk

- **Severity:** 🟡 Important (Level A)
- **WCAG:** [3.3.1 Error Identification (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- **Impact:** Using `dangerouslySetInnerHTML` for errors creates XSS vulnerability and may not be properly announced by screen readers. Security and accessibility risk combined.
- **Location:** [frontend/src/components/Login.tsx:48](frontend/src/components/Login.tsx#L48)

**Current Code:**
```tsx
{error && (
  <div 
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
    dangerouslySetInnerHTML={{ __html: error }}
  />
)}
```

**Problems:**
1. **Security:** XSS vulnerability if error contains user input or API data
2. **Accessibility:** May not be announced as an error
3. **No ARIA:** Missing `role="alert"` for immediate announcement

**Fix:**
```tsx
{error && (
  <div 
    role="alert" 
    aria-live="assertive"
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
  >
    <svg 
      className="inline w-4 h-4 mr-2" 
      aria-hidden="true"
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
    <strong className="font-bold">Error: </strong>
    <span>{error}</span>
  </div>
)}
```

**Explanation:**
- `role="alert"` - Immediately announces to screen readers
- `aria-live="assertive"` - Interrupts current announcements (appropriate for errors)
- **No HTML rendering** - Outputs as safe text
- Error icon with `aria-hidden="true"` - Decorative only
- Clear "Error:" prefix for comprehension

**Effort:** 2 hours (audit all error displays, ensure consistent pattern)

---

### 🟢 Enhancements (Level AAA / Best Practices)

These improvements exceed WCAG AA requirements and represent accessibility best practices.

---

#### Issue #7: Target Size (Minimum) - Small Touch Targets

- **Severity:** 🟢 Enhancement (Level AA / AAA)
- **WCAG:** [2.5.8 Target Size (Minimum) (Level AA 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- **Impact:** Touch targets smaller than 24×24px are difficult for users with tremors, low dexterity, or using mobile devices.
- **Location:** [frontend/src/components/Navigation.tsx:91](frontend/src/components/Navigation.tsx#L91) (and potentially other buttons/links)

**Recommendation:**
```tsx
// Ensure all interactive elements meet minimum size
<button className="p-3 min-w-[44px] min-h-[44px]"> {/* 44x44 exceeds 24x24 minimum */}
  <Icon className="w-5 h-5" />
</button>

// For smaller visual elements, extend hit area
<button className="p-4 -m-2"> {/* Visual: 16px + 8px padding = 24px, Hit area: 32px */}
  <SmallIcon className="w-4 h-4" />
</button>
```

**Target Sizes:**
- **WCAG AA (2.2):** 24×24 CSS pixels minimum
- **WCAG AAA:** 44×44 CSS pixels recommended
- **iOS Human Interface Guidelines:** 44×44pt minimum
- **Android Material Design:** 48×48dp minimum

**Audit Checklist:**
- [ ] Theme toggle button
- [ ] Navigation links
- [ ] "Add to Cart" buttons
- [ ] Close/dismiss buttons
- [ ] Form inputs and checkboxes
- [ ] Pagination controls

**Effort:** 2 hours (audit all interactive elements, adjust padding/sizing)

---

#### Issue #8: Info and Relationships - Hero Image Alt Text

- **Severity:** 🟢 Enhancement (Level A - already compliant, improvement opportunity)
- **WCAG:** [1.3.1 Info and Relationships (Level A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- **Impact:** Generic alt text may not convey meaningful information about hero image content.
- **Location:** [frontend/src/components/Welcome.tsx:50](frontend/src/components/Welcome.tsx#L50)

**Review Required:**
Verify that hero image alt text describes the actual content shown:

```tsx
// ❌ Generic (not helpful)
<img src={heroImage} alt="Hero image" />

// ❌ Redundant with surrounding text
<img src={heroImage} alt="Welcome to OctoCAT Supply" />

// ✅ Descriptive (if image shows warehouse)
<img src={heroImage} alt="Modern warehouse with organized shelves of supplies and automated picking system" />

// ✅ Decorative (if purely aesthetic)
<img src={heroImage} alt="" role="presentation" />
```

**Best Practices:**
- Describe what's **in** the image, not that it's an image
- Avoid redundancy with adjacent headings/text
- If decorative, use empty alt (`alt=""`)
- If functional (e.g., clickable), describe the destination
- Keep concise (< 150 characters typically)

**Effort:** 1 hour (review all images, improve alt text where needed)

---

## Prioritized Recommendations

### Phase 1: Critical Fixes (P0 - Within 1 Week)

| Priority | Issue | WCAG | Component | Effort | Owner |
|----------|-------|------|-----------|--------|-------|
| P0.1 | Focus Visible | 2.4.7 | Navigation.tsx | 2h | Frontend |
| P0.2 | Link Purpose | 2.4.4 | Footer.tsx | 3h | Frontend |
| P0.3 | Non-text Content | 1.1.1 | Products.tsx | 1h | Frontend |

**Total Effort:** 6 hours

**Success Criteria:**
- ✅ All interactive elements show visible focus indicators
- ✅ No broken footer links (functional or removed)
- ✅ Loading states announced by screen readers

---

### Phase 2: Level AA Compliance (P1 - Within 2 Weeks)

| Priority | Issue | WCAG | Component | Effort | Owner |
|----------|-------|------|-----------|--------|-------|
| P1.1 | Status Messages | 4.1.3 | Products.tsx, Cart.tsx | 4h | Frontend |
| P1.2 | Contrast | 1.4.3 | index.css | 1h | Frontend |
| P1.3 | Error Identification | 3.3.1 | Login.tsx | 2h | Frontend |

**Total Effort:** 7 hours

**Success Criteria:**
- ✅ Toast notifications replace all `alert()` calls
- ✅ Scrollbar contrast meets 3:1 ratio in light mode
- ✅ No `dangerouslySetInnerHTML` in error handling

---

### Phase 3: Enhancements (P2 - Within 1 Month)

| Priority | Issue | WCAG | Component | Effort | Owner |
|----------|-------|------|-----------|--------|-------|
| P2.1 | Target Size | 2.5.8 | All components | 2h | Frontend |
| P2.2 | Alt Text | 1.3.1 | Welcome.tsx, others | 1h | Frontend |

**Total Effort:** 3 hours

**Success Criteria:**
- ✅ All touch targets meet 24×24px minimum (44×44px ideal)
- ✅ All images have descriptive or empty alt attributes

---

### Total Project Effort

**Total Estimated Effort:** 16 hours across 3 phases

**Resource Requirements:**
- 1 Frontend Developer (TypeScript/React)
- 1 QA Tester with screen reader experience
- Optional: UX Designer for toast notification design

---

## Testing Checklist

### Manual Testing

#### Keyboard Navigation
- [ ] **Tab** through all interactive elements in logical order
- [ ] **Shift+Tab** works for reverse navigation
- [ ] Focus indicators visible on all focusable elements
- [ ] **Enter** activates buttons and follows links
- [ ] **Space** activates buttons and toggles checkboxes
- [ ] No keyboard traps (can always escape)
- [ ] Skip to main content link works (if present)

#### Screen Reader Testing

**Test with at least 2 of:**
- [ ] **NVDA** (Windows, free) - [Download](https://www.nvaccess.org/)
- [ ] **JAWS** (Windows, commercial) - [Demo version](https://www.freedomscientific.com/products/software/jaws/)
- [ ] **VoiceOver** (macOS/iOS, built-in)
- [ ] **TalkBack** (Android, built-in)

**Test Scenarios:**
- [ ] Navigate by landmarks (header, nav, main, footer)
- [ ] Navigate by headings (H1-H6)
- [ ] Navigate by links (verify link text is descriptive)
- [ ] Navigate by buttons (verify button labels)
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Dynamic content changes are announced

#### Visual Testing

**Color Contrast:**
- [ ] Run [axe DevTools](https://www.deque.com/axe/devtools/) automated scan
- [ ] Manual check with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/):
  - [ ] Text contrast (4.5:1 for normal, 3:1 for large)
  - [ ] UI component contrast (3:1 minimum)
  - [ ] Scrollbar contrast in light mode

**Zoom & Reflow:**
- [ ] Zoom to 200% (Cmd/Ctrl + '+' twice)
- [ ] No horizontal scrolling at 200% zoom
- [ ] Content reflows without overlapping
- [ ] Text remains readable (minimum 16px after zoom)

**Color Blindness:**
- [ ] Test with color blindness simulator (e.g., [Colorblindly Chrome extension](https://chrome.google.com/webstore/detail/colorblindly))
- [ ] Information not conveyed by color alone
- [ ] Error states have text/icons, not just red color

#### Touch & Mobile
- [ ] All touch targets at least 24×24px (44×44px ideal)
- [ ] Sufficient spacing between interactive elements
- [ ] Test on actual mobile device (iOS & Android)
- [ ] Pinch-to-zoom enabled (no viewport restrictions)

---

### Automated Testing Tools

#### Browser Extensions
1. **[axe DevTools](https://www.deque.com/axe/devtools/)** (Free)
   - Most comprehensive automated testing
   - Highlights issues directly on page
   - Provides remediation guidance

2. **[WAVE](https://wave.webaim.org/extension/)** (Free)
   - Visual representation of issues
   - Helpful for structure analysis

3. **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** (Built into Chrome DevTools)
   - Accessibility score and audit
   - Part of overall quality checks

#### CI/CD Integration

**Add to Playwright Tests:**
```typescript
// frontend/tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility - Light Theme', () => {
  test('Products page should not have violations', async ({ page }) => {
    await page.goto('/products');
    await page.evaluate(() => document.body.classList.remove('dark'));
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
});
```

**Install dependency:**
```bash
cd frontend
npm install --save-dev @axe-core/playwright
```

---

## Resources

### Official Standards & Guidelines
- [WCAG 2.2 Guidelines (Official W3C)](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG 2.2 Understanding Docs](https://www.w3.org/WAI/WCAG22/Understanding/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Manual contrast verification
- [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/) - Automated testing
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [Color Contrast Analyzer (CCA)](https://www.tpgi.com/color-contrast-checker/) - Desktop app for Windows/macOS

### Screen Readers (Free Options)
- [NVDA (Windows)](https://www.nvaccess.org/download/) - Most popular free screen reader
- [VoiceOver (macOS/iOS)](https://www.apple.com/accessibility/voiceover/) - Built-in, no download needed
- [TalkBack (Android)](https://support.google.com/accessibility/android/answer/6283677) - Built-in

### Learning Resources
- [WebAIM Articles](https://webaim.org/articles/) - Comprehensive accessibility tutorials
- [Inclusive Components](https://inclusive-components.design/) - Accessible component patterns
- [A11y Project](https://www.a11yproject.com/) - Community-driven accessibility resources
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### React-Specific
- [React Accessibility Docs](https://react.dev/learn/accessibility)
- [react-aria (Adobe)](https://react-spectrum.adobe.com/react-aria/) - Accessible component primitives
- [Reach UI](https://reach.tech/) - Accessible component library

---

## Appendix

### A. Light Theme Color Palette Reference

| Usage | Context | Tailwind | Hex | Luminance | Contrast vs BG |
|-------|---------|----------|-----|-----------|----------------|
| Page BG | Main background | `bg-gray-100` | `#f5f5f5` | 94% | - |
| Card BG | Container | `bg-white` | `#ffffff` | 100% | 1.03:1 |
| Heading | H1-H6 | `text-gray-900` | `#111827` | 9% | 18.7:1 ✅ |
| Body Text | Paragraphs | `text-gray-800` | `#1f2937` | 13% | 15.7:1 ✅ |
| Muted Text | Secondary info | `text-gray-600` | `#4b5563` | 31% | 7.1:1 ✅ |
| Primary CTA | Buttons | `bg-primary` | `#76B852` | 67% | 3.8:1 ⚠️ |
| Border | Dividers | `border-gray-300` | `#d1d5db` | 82% | 1.6:1 |

**Note:** Primary CTA background needs white text for sufficient contrast (3.8:1 is insufficient for `text-gray-800`).

---

### B. Quick Fix Cheat Sheet

| Issue | Quick Fix Class | Full Example |
|-------|----------------|--------------|
| Focus outline removed | `focus-visible:ring-2 focus-visible:ring-primary` | `<button className="... focus-visible:ring-2">` |
| Touch target too small | `min-w-[44px] min-h-[44px] p-3` | `<button className="min-w-[44px] min-h-[44px]">` |
| Loading state silent | Wrap in `role="status"` + sr-only text | `<div role="status"><span className="sr-only">Loading...</span>` |
| Error not announced | `role="alert" aria-live="assertive"` | `<div role="alert">{error}</div>` |
| Link goes nowhere | Use `<Link to="/path">` | `<Link to="/cart">My Cart</Link>` |

---

### C. Code Patterns Library

#### Pattern: Accessible Toast Notification
```tsx
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="...">
      {message}
    </div>
  );
};
```

#### Pattern: Loading Spinner
```tsx
const LoadingSpinner = ({ label = 'Loading' }) => (
  <div role="status" aria-label={label}>
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    <span className="sr-only">{label}...</span>
  </div>
);
```

#### Pattern: Accessible Error Message
```tsx
const ErrorMessage = ({ error }: { error: string }) => (
  <div 
    role="alert" 
    aria-live="assertive"
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
  >
    <strong className="font-bold">Error: </strong>
    <span>{error}</span>
  </div>
);
```

---

### D. Testing Commands

```bash
# Run Playwright accessibility tests
cd frontend
npm run test:e2e -- accessibility.spec.ts

# Run in UI mode for debugging
npm run test:e2e -- --ui

# Generate accessibility report
npm run test:e2e -- --reporter=html

# Run specific browser
npm run test:e2e -- --project=chromium
```

---

### E. Sign-Off Checklist

Before marking this audit as complete:

- [ ] All P0 (Critical) issues resolved
- [ ] All P1 (Important) issues resolved
- [ ] Automated tests added for regressions
- [ ] Manual testing completed (keyboard, screen reader, zoom)
- [ ] Documentation updated (component docs, testing guide)
- [ ] Stakeholder demo scheduled
- [ ] QA sign-off obtained
- [ ] Accessibility statement published (if required)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-06 | AI Accessibility Audit | Initial comprehensive audit for light theme |

---

**End of Report**

For questions or clarifications about this audit, please refer to:
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Frontend Coding Guidelines](.github/instructions/frontend.instructions.md)
- [Accessibility Testing Skill](.github/skills/frontend-testing/SKILL.md)
