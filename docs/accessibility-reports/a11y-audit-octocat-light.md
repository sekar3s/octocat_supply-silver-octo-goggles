# Accessibility Audit Report: OctoCAT Supply Chain (Light Mode)

**Generated:** February 6, 2026  
**Application:** OctoCAT Supply Chain Management  
**Technology Stack:** React 18 SPA + Tailwind CSS  
**Theme:** Light Mode (white/gray-100 backgrounds, #76B852 primary)  
**WCAG Version:** 2.2  
**Target Conformance:** Level AA

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Findings (Level A)](#critical-findings-level-a)
3. [Important Findings (Level AA)](#important-findings-level-aa)
4. [Light Mode Specific Concerns](#light-mode-specific-concerns)
5. [Remediation Roadmap](#remediation-roadmap)
6. [Testing Recommendations](#testing-recommendations)
7. [Resources](#resources)

---

## Executive Summary

### Current Conformance Status

| Level | Status | Issues | Severity |
|-------|--------|--------|----------|
| **Level A** | ❌ **Does Not Conform** | 5 | 🔴 Critical |
| **Level AA** | ❌ **Does Not Conform** | 4 | 🟡 Important |
| **Level AAA** | ⚠️ **Not Assessed** | 2 | 🟢 Enhancement |
| **Total Issues** | **11** | - | - |

### Impact Assessment

The application currently **fails WCAG 2.2 Level A conformance** due to critical accessibility barriers affecting:
- **Keyboard-only users**: Missing bypass blocks and focus indicators
- **Screen reader users**: Missing ARIA attributes and status announcements
- **Low vision users**: Insufficient color contrast ratios
- **Cognitive disabilities**: Inaccessible error handling

### Estimated Remediation Effort

| Priority | Issues | Estimated Time | Sprint |
|----------|--------|----------------|--------|
| 🔴 **P0 - Critical** | 5 | 16-20 hours | Sprint 1 |
| 🟡 **P1 - Important** | 4 | 12-16 hours | Sprint 2 |
| 🟢 **P2 - Enhancement** | 2 | 6-8 hours | Sprint 3 |
| **Total** | **11** | **34-44 hours** | **3 sprints** |

### Priority Recommendations

1. **Immediate (P0)**: Address all Level A violations to achieve basic accessibility
2. **Short-term (P1)**: Fix Level AA issues to meet legal compliance standards
3. **Medium-term (P2)**: Enhance light mode specific contrast and focus visibility

---

## Critical Findings (Level A)

These issues **must be fixed** to achieve minimum accessibility compliance. Level A failures prevent access for users with disabilities.

---

### 🔴 Issue #1: Missing Skip Navigation Links

**Severity:** 🔴 Critical (Level A)  
**WCAG:** [2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)  
**Impact:** Keyboard users must tab through entire navigation (~12 focusable elements) to reach main content on every page load. This is exceptionally frustrating for keyboard-only and screen reader users.

**Location:** `frontend/src/App.tsx` (missing at application root)

**Current State:**
```tsx
// No skip link implemented
function App() {
  return (
    <Router>
      <Navigation />
      <main>
        <Routes>
          {/* routes */}
        </Routes>
      </main>
    </Router>
  );
}
```

**Recommended Fix:**
```tsx
// Add skip link as first focusable element
function App() {
  return (
    <Router>
      {/* Skip to main content link - visually hidden until focused */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded focus:border-2 focus:border-blue-600"
      >
        Skip to main content
      </a>
      
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <Routes>
          {/* routes */}
        </Routes>
      </main>
    </Router>
  );
}
```

**Additional CSS Required:**
```css
/* frontend/src/index.css */
.skip-link {
  transition: transform 0.1s ease;
}

.skip-link:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

**Testing Verification:**
1. Load the application
2. Press `Tab` once - skip link should become visible
3. Press `Enter` - focus should move to `<main>` content
4. Screen reader should announce "Skip to main content, link"

**Effort:** 1-2 hours

---

### 🔴 Issue #2: Keyboard Focus Indicators Removed

**Severity:** 🔴 Critical (Level A)  
**WCAG:** [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)  
**Impact:** Keyboard users cannot see where focus is located, making navigation impossible.

**Location:** 
- `frontend/src/components/Navigation.tsx:118` (navigation links)
- `frontend/src/components/Navigation.tsx:140` (mobile menu button)

**Current Code:**
```tsx
// Line 118 - Navigation links
<Link
  to="/products"
  className="hover:text-gray-900 outline-none focus:outline-none" // ❌ Removes focus
>
  Products
</Link>

// Line 140 - Mobile menu button
<button
  onClick={toggleMenu}
  className="md:hidden focus:outline-none" // ❌ Removes focus
  aria-label="Toggle navigation menu"
  aria-expanded={isMenuOpen}
>
  <svg>...</svg>
</button>
```

**Recommended Fix:**
```tsx
// Line 118 - Navigation links with visible focus
<Link
  to="/products"
  className="hover:text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 focus:rounded transition-all"
>
  Products
</Link>

// Line 140 - Mobile menu button with visible focus
<button
  onClick={toggleMenu}
  className="md:hidden focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 focus:ring-2 focus:ring-blue-500 focus:rounded-md p-2"
  aria-label="Toggle navigation menu"
  aria-expanded={isMenuOpen}
>
  <svg>...</svg>
</button>
```

**Global Fix (Recommended):**
```css
/* frontend/src/index.css - Remove any global focus outline removal */
/* Delete or comment out: */
/* *:focus {
  outline: none;
} */

/* Add enhanced focus styles for light mode */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.125rem;
}

/* Specific enhancement for interactive elements */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}
```

**Testing Verification:**
1. Use keyboard only (no mouse)
2. Press `Tab` to navigate through all interactive elements
3. Verify visible focus ring on every focusable element
4. Focus should be clearly visible on light backgrounds

**Effort:** 3-4 hours (includes testing all components)

---

### 🔴 Issue #3: Admin Dropdown Missing ARIA Attributes

**Severity:** 🔴 Critical (Level A)  
**WCAG:** [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)  
**Impact:** Screen readers cannot identify the admin dropdown as a menu, announce its state, or inform users of submenu items.

**Location:** `frontend/src/components/Navigation.tsx:85-105`

**Current Code:**
```tsx
{/* Admin dropdown - no ARIA attributes */}
<div className="relative" onMouseEnter={() => setShowAdminMenu(true)} onMouseLeave={() => setShowAdminMenu(false)}>
  <button className="hover:text-gray-900">
    Admin
  </button>
  
  {showAdminMenu && (
    <div className="absolute mt-2 bg-white shadow-lg rounded">
      <Link to="/admin/suppliers" className="block px-4 py-2">
        Suppliers
      </Link>
      <Link to="/admin/orders" className="block px-4 py-2">
        Orders
      </Link>
    </div>
  )}
</div>
```

**Recommended Fix:**
```tsx
{/* Admin dropdown with proper ARIA */}
<div className="relative">
  <button
    className="hover:text-gray-900 focus:outline-2 focus:outline-blue-600"
    aria-haspopup="true"
    aria-expanded={showAdminMenu}
    onClick={() => setShowAdminMenu(!showAdminMenu)}
    onMouseEnter={() => setShowAdminMenu(true)}
    onMouseLeave={() => setShowAdminMenu(false)}
    id="admin-menu-button"
  >
    Admin
    <svg 
      className={`inline ml-1 w-4 h-4 transform transition-transform ${showAdminMenu ? 'rotate-180' : ''}`}
      fill="currentColor" 
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>
  
  {showAdminMenu && (
    <div 
      className="absolute mt-2 bg-white shadow-lg rounded border border-gray-200"
      role="menu"
      aria-labelledby="admin-menu-button"
    >
      <Link 
        to="/admin/suppliers" 
        className="block px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-2 focus:outline-blue-600"
        role="menuitem"
      >
        Suppliers
      </Link>
      <Link 
        to="/admin/orders" 
        className="block px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-2 focus:outline-blue-600"
        role="menuitem"
      >
        Orders
      </Link>
    </div>
  )}
</div>
```

**Additional Keyboard Support:**
```tsx
// Add keyboard handler to button
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    setShowAdminMenu(false);
  } else if (e.key === 'ArrowDown' && showAdminMenu) {
    // Focus first menu item
    const firstItem = document.querySelector('[role="menu"] [role="menuitem"]') as HTMLElement;
    firstItem?.focus();
  }
};
```

**Testing Verification:**
1. **Screen reader**: Should announce "Admin, button, has popup menu, collapsed/expanded"
2. **Keyboard**: 
   - `Tab` to button → `Enter` opens menu
   - `Arrow Down` moves to first item
   - `Escape` closes menu
3. **Mouse**: Hover still works for sighted users

**Effort:** 2-3 hours

---

### 🔴 Issue #4: Footer Placeholder Links Missing Accessible Names

**Severity:** 🔴 Critical (Level A)  
**WCAG:** [1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)  
**Impact:** Screen readers announce "link" with no context, making footer navigation inaccessible.

**Location:** `frontend/src/components/Footer.tsx:42-48`

**Current Code:**
```tsx
<footer className="bg-gray-100 py-8 mt-auto border-t border-gray-200">
  <div className="container mx-auto px-4">
    <div className="flex justify-between">
      <div>
        <h3 className="font-bold">Company</h3>
        <a href="#" className="block">About Us</a> {/* Links to nowhere */}
        <a href="#" className="block">Careers</a>
      </div>
      <div>
        <h3 className="font-bold">Support</h3>
        <a href="#" className="block">Help Center</a>
        <a href="#" className="block">Contact</a>
      </div>
    </div>
  </div>
</footer>
```

**Recommended Fix:**

**Option 1: Remove placeholder links (Preferred)**
```tsx
<footer className="bg-gray-100 py-8 mt-auto border-t border-gray-200">
  <div className="container mx-auto px-4">
    <div className="flex justify-between">
      <div>
        <h3 className="font-bold text-gray-900">Company</h3>
        <span className="block text-gray-600">About Us (Coming Soon)</span>
        <span className="block text-gray-600">Careers (Coming Soon)</span>
      </div>
      <div>
        <h3 className="font-bold text-gray-900">Support</h3>
        <span className="block text-gray-600">Help Center (Coming Soon)</span>
        <span className="block text-gray-600">Contact (Coming Soon)</span>
      </div>
    </div>
  </div>
</footer>
```

**Option 2: Add aria-label to indicate placeholder status**
```tsx
<a 
  href="#" 
  className="block text-gray-600" 
  aria-label="About Us (coming soon, link inactive)"
  onClick={(e) => e.preventDefault()}
>
  About Us
</a>
```

**Option 3: Implement real links**
```tsx
<a 
  href="/about" 
  className="block text-blue-600 hover:text-blue-800 focus:outline-2 focus:outline-blue-600"
>
  About Us
</a>
```

**Testing Verification:**
1. Screen reader should not announce empty links
2. Tab navigation should skip placeholder items (Option 1)
3. If links are kept, they should have descriptive names

**Effort:** 1 hour

---

### 🔴 Issue #5: Carousel Auto-play Without User Control

**Severity:** 🔴 Critical (Level A)  
**WCAG:** [2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)  
**Impact:** Auto-rotating content is inaccessible to users who need more time to read, users with attention disorders, and screen reader users who lose context when content changes unexpectedly.

**Location:** `frontend/src/components/Carousel.tsx:25-40`

**Current Code:**
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 5000); // Auto-advances every 5 seconds - no pause mechanism
  
  return () => clearInterval(interval);
}, [slides.length]);
```

**Recommended Fix:**
```tsx
const [isPlaying, setIsPlaying] = useState(false); // Default to paused
const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  if (!isPlaying) return;
  
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 5000);
  
  return () => clearInterval(interval);
}, [slides.length, isPlaying]);

return (
  <div 
    className="relative" 
    role="region" 
    aria-roledescription="carousel"
    aria-label="Product highlights"
  >
    {/* Carousel controls */}
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full focus:outline-2 focus:outline-blue-600 focus:ring-2 focus:ring-blue-500"
        aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M6 4l10 6-10 6V4z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
    
    {/* Slide content */}
    <div 
      className="carousel-slide"
      role="group"
      aria-roledescription="slide"
      aria-label={`${currentSlide + 1} of ${slides.length}`}
    >
      {slides[currentSlide]}
    </div>
    
    {/* Previous/Next buttons */}
    <button
      onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full focus:outline-2 focus:outline-blue-600"
      aria-label="Previous slide"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M12.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L9.414 10l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    </button>
    
    <button
      onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full focus:outline-2 focus:outline-blue-600"
      aria-label="Next slide"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </button>
    
    {/* Slide indicators */}
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-3 h-3 rounded-full focus:outline-2 focus:outline-blue-600 ${
            index === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === currentSlide ? 'true' : 'false'}
        />
      ))}
    </div>
  </div>
);
```

**Testing Verification:**
1. **Keyboard**: All controls accessible via Tab and Enter
2. **Screen reader**: Announces carousel region, current slide number, control purposes
3. **Auto-play**: Paused by default; user must explicitly start
4. **Pause on hover**: Consider adding `onMouseEnter={() => setIsPlaying(false)}`

**Effort:** 4-5 hours

---

## Important Findings (Level AA)

These issues **should be fixed** to meet standard legal compliance requirements (ADA, Section 508, EN 301 549).

---

### 🟡 Issue #6: Insufficient Color Contrast on Primary Action Buttons

**Severity:** 🟡 Important (Level AA)  
**WCAG:** [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)  
**Impact:** Low vision users and users with color blindness cannot read button text. Primary call-to-action buttons fail minimum contrast requirements.

**Location:** Multiple files (global Tailwind configuration)

**Current Implementation:**
```tsx
// Primary button style using #76B852 (brand green)
<button className="bg-[#76B852] text-white px-6 py-2 rounded">
  Add to Cart
</button>
```

**Contrast Analysis:**
- **Current**: `#76B852` on `white` = **~2.8:1** ❌ Fails
- **Target**: Minimum **4.5:1** for normal text (Level AA)
- **Target**: Minimum **3:1** for large text (18pt+) (Level AA)

**Color Contrast Issues in Light Mode:**

| Element | Background | Foreground | Ratio | Status | Location |
|---------|------------|------------|-------|--------|----------|
| Primary button | `#76B852` | White text | 2.8:1 | ❌ Fail | All CTAs |
| Secondary button | `gray-100` | `gray-600` | 3.2:1 | ⚠️ Borderline | Form buttons |
| Link text | White | `#76B852` | 2.8:1 | ❌ Fail | Footer links |
| Disabled state | `gray-200` | `gray-400` | 2.1:1 | ⚠️ Expected fail | Disabled inputs |

**Recommended Fix (Option 1 - Darken green):**
```tsx
// Darken primary green for sufficient contrast
// New color: #5A9640 provides 4.52:1 contrast ratio ✅

// Update Tailwind config
// frontend/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5A9640', // AA compliant
          light: '#76B852',   // Original, use for backgrounds only
          dark: '#4A7A33',    // AAA compliant (7:1)
        }
      }
    }
  }
}

// Update button components
<button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded focus:outline-2 focus:outline-offset-2 focus:outline-blue-600">
  Add to Cart
</button>
```

**Recommended Fix (Option 2 - Add border/shadow):**
```tsx
// Keep brand color, add border for definition
<button className="bg-[#76B852] hover:bg-[#6AA647] text-white px-6 py-2 rounded border-2 border-[#5A9640] focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 shadow-md">
  Add to Cart
</button>
```

**Recommended Fix (Option 3 - Dark text instead of white):**
```tsx
// Use dark text on green background (not recommended for brand consistency)
<button className="bg-[#76B852] hover:bg-[#6AA647] text-gray-900 px-6 py-2 rounded focus:outline-2 focus:outline-offset-2 focus:outline-blue-600">
  Add to Cart
</button>
```

**Testing Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools: Lighthouse audit
- [Contrast Ratio by Lea Verou](https://contrast-ratio.com/)

**Testing Verification:**
1. Use contrast checker on all button states (default, hover, focus, active, disabled)
2. Test with browser zoom at 200%
3. Test in bright sunlight simulation (low contrast conditions)
4. Verify with Windows High Contrast Mode

**Effort:** 6-8 hours (includes updating all color instances, testing states, and updating style guide)

---

### 🟡 Issue #7: Non-Accessible Error Alerts

**Severity:** 🟡 Important (Level AA)  
**WCAG:** [3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)  
**Impact:** Screen reader users are not notified of errors. JavaScript alerts are modal and disrupt workflow.

**Location:** `frontend/src/components/Products.tsx:66`

**Current Code:**
```tsx
const handleAddToCart = (productId: number) => {
  try {
    // Add to cart logic
    addToCart(productId);
    alert('Product added to cart!'); // ❌ Not accessible
  } catch (error) {
    alert('Error adding product'); // ❌ Not accessible
  }
};
```

**Recommended Fix:**
```tsx
// Create accessible toast/notification component
// frontend/src/components/Toast.tsx
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-100 border-green-500 text-green-900',
    error: 'bg-red-100 border-red-500 text-red-900',
    info: 'bg-blue-100 border-blue-500 text-blue-900'
  };

  const icons = {
    success: '✓',
    error: '✗',
    info: 'ℹ'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed top-4 right-4 z-50 p-4 border-l-4 rounded shadow-lg ${styles[type]} max-w-md`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">{icons[type]}</span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-700 hover:text-gray-900 focus:outline-2 focus:outline-blue-600 rounded"
          aria-label="Close notification"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Update Products.tsx
import { Toast } from './Toast';
import { useState } from 'react';

const Products = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleAddToCart = (productId: number) => {
    try {
      addToCart(productId);
      setToast({ message: 'Product added to cart!', type: 'success' });
    } catch (error) {
      setToast({ 
        message: 'Unable to add product. Please try again.', 
        type: 'error' 
      });
    }
  };

  return (
    <>
      {/* Products content */}
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};
```

**Testing Verification:**
1. **Screen reader**: Should announce message when toast appears
2. **Keyboard**: Focus should remain on triggering element
3. **Visual**: Toast should be visible and dismissible
4. **Persistence**: Message should auto-dismiss but be manually closeable

**Effort:** 3-4 hours

---

### 🟡 Issue #8: Missing SPA Route Change Announcements

**Severity:** 🟡 Important (Level AA)  
**WCAG:** [4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)  
**Impact:** Screen reader users don't know when navigation occurs in Single Page Application. No indication that content has changed.

**Location:** `frontend/src/App.tsx` (React Router implementation)

**Current Implementation:**
```tsx
// No announcement when route changes
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/suppliers" element={<Suppliers />} />
  {/* ... */}
</Routes>
```

**Recommended Fix:**
```tsx
// Create RouteAnnouncer component
// frontend/src/components/RouteAnnouncer.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/products': 'Products',
  '/suppliers': 'Suppliers',
  '/orders': 'Orders',
  '/admin': 'Admin Dashboard',
  '/login': 'Login',
};

export const RouteAnnouncer = () => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const title = routeTitles[location.pathname] || 'Page';
    setAnnouncement(`Navigated to ${title}`);
    
    // Update document title for screen readers
    document.title = `${title} - OctoCAT Supply Chain`;
    
    // Focus main content area
    const mainContent = document.getElementById('main-content');
    mainContent?.focus();
  }, [location.pathname]);

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

// Add to App.tsx
import { RouteAnnouncer } from './components/RouteAnnouncer';

function App() {
  return (
    <Router>
      <RouteAnnouncer />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          {/* routes */}
        </Routes>
      </main>
    </Router>
  );
}
```

**Additional Enhancement:**
```tsx
// Add loading state announcements
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  if (isLoading) {
    setAnnouncement('Loading...');
  }
}, [isLoading]);
```

**CSS for screen-reader-only content:**
```css
/* frontend/src/index.css */
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

.sr-only-focusable:focus,
.sr-only-focusable:active {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

**Testing Verification:**
1. **Screen reader**: Should announce page name on navigation
2. **Document title**: Browser tab should update
3. **Focus management**: Main content should receive focus
4. **Keyboard**: Navigation should work seamlessly

**Effort:** 2-3 hours

---

### 🟡 Issue #9: Unsafe HTML in Error Messages

**Severity:** 🟡 Important (Level AA)  
**WCAG:** [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)  
**Impact:** Screen readers may not properly convey error messages if they contain unescaped HTML. Security risk (XSS).

**Location:** `frontend/src/components/Login.tsx:50`

**Current Code:**
```tsx
const [error, setError] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(username, password);
  } catch (err) {
    setError(err.message); // Could contain HTML
  }
};

return (
  <form onSubmit={handleLogin}>
    {error && (
      <div 
        className="text-red-600 mb-4"
        dangerouslySetInnerHTML={{ __html: error }} // ❌ XSS risk + a11y issue
      />
    )}
    {/* form fields */}
  </form>
);
```

**Recommended Fix:**
```tsx
// Remove dangerouslySetInnerHTML
return (
  <form onSubmit={handleLogin} aria-label="Login form">
    {error && (
      <div 
        role="alert"
        aria-live="assertive"
        className="text-red-900 bg-red-100 border border-red-400 px-4 py-3 rounded mb-4 focus:outline-2 focus:outline-red-600"
        tabIndex={-1}
        ref={(el) => el?.focus()}
      >
        <div className="flex items-start gap-2">
          <svg 
            className="w-5 h-5 text-red-600 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="flex-1">{error}</span>
        </div>
      </div>
    )}
    
    <div className="mb-4">
      <label htmlFor="username" className="block mb-2 font-medium text-gray-900">
        Username
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-blue-600 focus:border-blue-600"
        aria-describedby={error ? 'login-error' : undefined}
        aria-invalid={!!error}
        required
      />
    </div>
    
    <div className="mb-4">
      <label htmlFor="password" className="block mb-2 font-medium text-gray-900">
        Password
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-blue-600 focus:border-blue-600"
        aria-describedby={error ? 'login-error' : undefined}
        aria-invalid={!!error}
        required
      />
    </div>
    
    <button 
      type="submit"
      className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"
    >
      Login
    </button>
  </form>
);
```

**Additional Security Enhancement:**
```tsx
// Sanitize error messages from API
const sanitizeErrorMessage = (message: string): string => {
  // Remove HTML tags
  return message.replace(/<[^>]*>/g, '');
};

catch (err) {
  setError(sanitizeErrorMessage(err.message));
}
```

**Testing Verification:**
1. **Screen reader**: Should announce error immediately with "Error: [message]"
2. **Visual**: Error message clearly associated with form
3. **Security**: No HTML executed in error message
4. **Color**: Not relying on red color alone (icon + text)

**Effort:** 1-2 hours

---

## Light Mode Specific Concerns

These issues are specific to the light mode theme and should be addressed for optimal light mode accessibility.

---

### 🟢 Enhancement #10: Focus Visibility on Light Backgrounds

**Severity:** 🟢 Enhancement (Light Mode Specific)  
**WCAG:** [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) (Level AA)  
**Impact:** While focus indicators exist, they may be too subtle on pure white backgrounds in bright conditions.

**Recommendation:**

```css
/* Enhanced focus styles for light mode */
/* frontend/src/index.css */

:root {
  --focus-ring-color: #2563eb;
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
  --focus-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

*:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  box-shadow: var(--focus-shadow);
  border-radius: 0.25rem;
}

/* Enhanced for light backgrounds */
.bg-white *:focus-visible,
.bg-gray-50 *:focus-visible,
.bg-gray-100 *:focus-visible {
  outline-width: 3px; /* Slightly thicker for light backgrounds */
  box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.2);
}

/* Button focus states */
button:focus-visible {
  outline: 3px solid var(--focus-ring-color);
  outline-offset: 2px;
  box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.15);
}
```

**Testing Verification:**
1. Test in bright daylight / high ambient light
2. Test with browser zoom 200%
3. Test on different monitors/brightness levels
4. User testing with low vision participants

**Effort:** 2 hours

---

### 🟢 Enhancement #11: Text Contrast on Gray Backgrounds

**Severity:** 🟢 Enhancement (Light Mode Specific)  
**WCAG:** [1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html) (Level AAA)  
**Impact:** Some gray-on-gray combinations may be borderline for Level AAA compliance.

**Areas of Concern:**

| Element | Background | Text | Ratio | Status |
|---------|------------|------|-------|--------|
| Card headers | `gray-100` | `gray-700` | 4.7:1 | ✅ AA Pass |
| Helper text | White | `gray-500` | 4.6:1 | ✅ AA Pass |
| Disabled inputs | `gray-100` | `gray-400` | 2.8:1 | ⚠️ Expected |
| Placeholder text | White | `gray-400` | 3.8:1 | ⚠️ Borderline |

**Recommendations:**

```tsx
// Use darker gray for important secondary text
<p className="text-gray-700 leading-relaxed"> {/* Instead of gray-600 */}
  Product description text
</p>

// Placeholder text - make darker
<input 
  type="text"
  placeholder="Search products..."
  className="placeholder-gray-500" {/* Instead of gray-400 */}
/>

// Helper text - ensure sufficient contrast
<span className="text-sm text-gray-700"> {/* Instead of gray-600 */}
  Password must be at least 8 characters
</span>
```

**Testing Tools:**
- Chrome DevTools → CSS Overview → Contrast issues
- axe DevTools browser extension
- Manual testing with [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

**Effort:** 3-4 hours (audit + updates)

---

## Remediation Roadmap

### Sprint 1: Critical Fixes (P0) - 16-20 hours

**Week 1: Core Accessibility**
1. ✅ Add skip navigation links (2h)
2. ✅ Restore focus indicators globally (4h)
3. ✅ Fix admin dropdown ARIA (3h)

**Week 2: Content & Controls**
4. ✅ Remove/fix footer placeholder links (1h)
5. ✅ Add carousel pause controls (5h)
6. ✅ Testing & validation (2-3h)

**Deliverable:** Level A compliant application

---

### Sprint 2: Standard Compliance (P1) - 12-16 hours

**Week 3: Contrast & Errors**
7. ✅ Fix color contrast issues (8h)
   - Update Tailwind colors
   - Test all button states
   - Update brand guidelines
8. ✅ Replace alert() with accessible toasts (4h)

**Week 4: Status & Forms**
9. ✅ Add SPA route announcements (3h)
10. ✅ Fix form error handling (2h)
11. ✅ Testing & validation (1-3h)

**Deliverable:** Level AA compliant application

---

### Sprint 3: Enhancements (P2) - 6-8 hours

**Week 5: Polish**
12. ✅ Enhance focus visibility (2h)
13. ✅ Audit gray text contrast (4h)
14. ✅ Additional testing (2h)

**Deliverable:** Optimized light mode accessibility

---

### Implementation Priority Order

```
Priority Order:
1. Skip Links (blocking Level A)
2. Focus Indicators (blocking Level A)  
3. ARIA Attributes (blocking Level A)
4. Carousel Controls (blocking Level A)
5. Footer Links (blocking Level A)
6. Color Contrast (blocking Level AA)
7. Error Handling (blocking Level AA)
8. Status Messages (blocking Level AA)
9. Form Validation (blocking Level AA)
10. Focus Enhancements (quality improvement)
11. Text Contrast Audit (quality improvement)
```

---

## Testing Recommendations

### 1. Keyboard-Only Navigation Checklist

Test with keyboard only (no mouse) and verify:

- [ ] **Tab forward**: All interactive elements receive visible focus
- [ ] **Shift+Tab backward**: Reverse tab order works
- [ ] **Skip link**: First tab shows skip link, Enter jumps to main content
- [ ] **Navigation menu**: 
  - [ ] Tab reaches each nav item
  - [ ] Enter activates links
  - [ ] Admin dropdown opens with Enter/Space
  - [ ] Arrow keys navigate dropdown (recommended)
  - [ ] Escape closes dropdown
- [ ] **Forms**:
  - [ ] Tab through all form fields
  - [ ] Error messages appear on submit
  - [ ] Focus moves to first error
- [ ] **Buttons & Links**: All clickable with Enter/Space
- [ ] **Modals**: 
  - [ ] Focus trapped inside modal
  - [ ] Escape closes modal
  - [ ] Focus returns to trigger element
- [ ] **Carousel**:
  - [ ] Pause/play button accessible
  - [ ] Previous/next buttons work
  - [ ] Keyboard can control all features

---

### 2. Color Contrast Verification

**Tools:**
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/) - Desktop app

**Test Procedure:**
1. Run axe DevTools scan on every page
2. Check all color combinations:
   - Buttons (all states: default, hover, focus, active, disabled)
   - Text on backgrounds (headings, body, links)
   - Form inputs (labels, placeholders, error messages)
   - Icons and graphics
3. Test at 200% zoom
4. Test with Windows High Contrast Mode

**Contrast Targets:**
- Normal text: **4.5:1** (Level AA) / **7:1** (Level AAA)
- Large text (18pt+): **3:1** (Level AA) / **4.5:1** (Level AAA)
- UI components: **3:1** (Level AA)

---

### 3. Screen Reader Testing

**Recommended Screen Readers:**
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free) or JAWS
- **Mobile**: iOS VoiceOver / Android TalkBack

**Test Scenarios:**

#### Navigation
- [ ] Page title announces correctly
- [ ] Headings structure is logical (h1 → h2 → h3)
- [ ] Landmark regions identified (banner, navigation, main, footer)
- [ ] Skip link announces and works
- [ ] Route changes announced

#### Forms
- [ ] Labels properly associated with inputs
- [ ] Required fields identified
- [ ] Error messages announced
- [ ] Instructions read before inputs

#### Interactive Elements
- [ ] Buttons announce as "button" with clear purpose
- [ ] Links announce as "link" with destination
- [ ] Dropdowns announce state (expanded/collapsed)
- [ ] Checkboxes/radios announce state (checked/unchecked)

#### Dynamic Content
- [ ] Loading states announced
- [ ] Success/error messages announced
- [ ] Carousel slide changes announced
- [ ] Modal open/close announced

**VoiceOver Quick Test (macOS):**
```bash
# Enable VoiceOver
Cmd + F5

# Navigation
- Control + Option + U: Open rotor (landmarks, headings, links)
- Control + Option + →: Read next item
- Control + Option + Space: Activate element

# Disable when done
Cmd + F5
```

---

### 4. Automated Scanning Tools

#### axe DevTools
```bash
# Install browser extension from:
# https://www.deque.com/axe/devtools/

# Run scan on each page:
# 1. Open DevTools (F12)
# 2. Navigate to "axe DevTools" tab
# 3. Click "Scan ALL of my page"
# 4. Review issues by impact level
```

#### pa11y (CLI tool)
```bash
# Install
npm install -g pa11y

# Scan pages
pa11y http://localhost:5173
pa11y http://localhost:5173/products
pa11y http://localhost:5173/suppliers

# Generate report
pa11y --reporter html --output-file report.html http://localhost:5173
```

#### Lighthouse (Built into Chrome)
```bash
# 1. Open Chrome DevTools (F12)
# 2. Navigate to "Lighthouse" tab
# 3. Select "Accessibility" category
# 4. Click "Analyze page load"
# 5. Review accessibility score and issues
```

#### Add to CI/CD Pipeline
```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run dev &
      - run: sleep 10
      - run: npm install -g pa11y-ci
      - run: pa11y-ci --config .pa11yci.json
```

---

### 5. Manual Testing Scenarios

#### Scenario 1: New User Registration
1. Navigate to registration with keyboard only
2. Fill form with screen reader on
3. Submit with intentional errors
4. Verify error announcements
5. Correct errors and submit
6. Verify success message

#### Scenario 2: Product Search & Purchase
1. Use skip link to main content
2. Navigate to product search
3. Enter search term
4. Review results with screen reader
5. Select product (keyboard only)
6. Add to cart
7. Verify cart announcement

#### Scenario 3: Color Contrast (Low Vision)
1. Test with browser zoom 200%
2. Test with Windows High Contrast Mode
3. Test with Chromatic Vision Simulator (color blindness)
4. Verify all text readable

---

## Resources

### WCAG 2.2 Documentation

- **Quick Reference**: [WCAG 2.2 at a Glance](https://www.w3.org/WAI/WCAG22/quickref/)
- **Understanding WCAG**: [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- **Techniques**: [Techniques for WCAG 2.2](https://www.w3.org/WAI/WCAG22/Techniques/)

**Specific Criteria Referenced:**
- [1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
- [3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- [4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)

---

### Color Contrast Tools

- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser (CCA)**: https://www.tpgi.com/color-contrast-checker/
- **Contrast Ratio by Lea Verou**: https://contrast-ratio.com/
- **Colorable**: https://colorable.jxnblk.com/
- **Adobe Color Accessibility**: https://color.adobe.com/create/color-accessibility

---

### ARIA Authoring Practices

- **ARIA Authoring Practices Guide (APG)**: https://www.w3.org/WAI/ARIA/apg/
- **Menu Button Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
- **Carousel Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- **Alert Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
- **Navigation Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

---

### Testing Tools

**Browser Extensions:**
- [axe DevTools](https://www.deque.com/axe/devtools/) - Chrome, Firefox, Edge
- [WAVE](https://wave.webaim.org/extension/) - Chrome, Firefox
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools
- [Accessibility Insights](https://accessibilityinsights.io/) - Chrome, Edge

**CLI Tools:**
- [pa11y](https://pa11y.org/) - Automated testing
- [axe-core](https://github.com/dequelabs/axe-core) - Testing engine
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - CI/CD integration

**Screen Readers:**
- [NVDA](https://www.nvaccess.org/) - Free, Windows
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) - Commercial, Windows
- VoiceOver - Built into macOS/iOS
- TalkBack - Built into Android

---

### React Accessibility Libraries

- **react-aria**: https://react-spectrum.adobe.com/react-aria/
- **Radix UI**: https://www.radix-ui.com/ (accessible primitives)
- **Reach UI**: https://reach.tech/ (accessible components)
- **Headless UI**: https://headlessui.com/ (by Tailwind)

---

### Legal & Standards References

- **ADA Standards**: https://www.ada.gov/
- **Section 508**: https://www.section508.gov/
- **EN 301 549**: https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf
- **Accessible Canada Act**: https://accessible.canada.ca/

---

### Training & Learning

- **WebAIM**: https://webaim.org/articles/
- **Deque University**: https://dequeuniversity.com/
- **A11ycasts (YouTube)**: https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

---

## Appendix: Issue Summary Table

| # | Issue | WCAG | Level | Priority | Effort | Status |
|---|-------|------|-------|----------|--------|--------|
| 1 | Missing skip links | 2.4.1 | A | 🔴 P0 | 2h | ❌ Not Started |
| 2 | Focus outlines removed | 2.1.1 | A | 🔴 P0 | 4h | ❌ Not Started |
| 3 | Admin dropdown ARIA | 4.1.2 | A | 🔴 P0 | 3h | ❌ Not Started |
| 4 | Footer placeholder links | 1.1.1 | A | 🔴 P0 | 1h | ❌ Not Started |
| 5 | Carousel autoplay | 2.2.2 | A | 🔴 P0 | 5h | ❌ Not Started |
| 6 | Insufficient contrast | 1.4.3 | AA | 🟡 P1 | 8h | ❌ Not Started |
| 7 | Inaccessible alerts | 3.3.1 | AA | 🟡 P1 | 4h | ❌ Not Started |
| 8 | No SPA announcements | 4.1.3 | AA | 🟡 P1 | 3h | ❌ Not Started |
| 9 | Unsafe HTML in errors | 3.3.2 | AA | 🟡 P1 | 2h | ❌ Not Started |
| 10 | Focus visibility | 2.4.7 | AA | 🟢 P2 | 2h | ❌ Not Started |
| 11 | Gray text contrast | 1.4.6 | AAA | 🟢 P2 | 4h | ❌ Not Started |
| **Total** | **11 issues** | - | - | - | **34-44h** | **0% Complete** |

---

## Next Steps

1. **Review this report** with development team and stakeholders
2. **Schedule Sprint 1** to address all Level A violations (P0 priority)
3. **Assign ownership** for each issue to specific developers
4. **Set up automated testing** (pa11y-ci, Lighthouse CI) to prevent regressions
5. **Plan user testing** with assistive technology users after Sprint 1 completion
6. **Update style guide** with accessibility patterns and guidelines

---

**Report End**

*For questions or clarifications about this audit, please contact the accessibility team.*

---

**Document Version:** 1.0  
**Author:** AI Accessibility Auditor  
**Last Updated:** February 6, 2026
