
# Smart Delivery Hub — Phase 1: Public Website

## What We'll Build
A polished public-facing website for "Smart Delivery Hub" with role-based authentication foundation for future phases.

## Pages & Sections

### 1. Landing / Home Page
- Hero section with tagline and call-to-action ("Join as Vendor", "Become a Rider", "Order Now")
- How It Works — 4-step visual flow (Vendor stocks → Customer orders → Rider delivers → Company monitors)
- Key stats section (placeholder numbers for now: vendors, riders, deliveries completed)
- Testimonials section (placeholder)

### 2. About Page
- Company story, mission, and vision
- Founder & Co-Founder profiles with photos (placeholder images), names, and bios
- Company values / what makes us different

### 3. Dashboard / Stats Page
- Charts showing company performance (using Recharts):
  - Orders over time (line chart)
  - Vendor growth (bar chart)
  - Rider activity (pie chart)
- All with placeholder data for now, will connect to real data later

### 4. Contact Page
- Contact form (name, email, message)
- Company address, email, phone
- Social media links

### 5. Navigation & Footer
- Responsive navbar with logo, links (Home, About, Stats, Contact), and Login button
- Footer with quick links, social icons, copyright

## Backend Setup (Lovable Cloud / Supabase)
- Set up Supabase connection for authentication
- Create a `profiles` table for user data
- Create a `user_roles` table with roles: `admin`, `vendor`, `rider`, `customer`
- Basic login/signup page with role selection (foundation for Phase 2)

## Design
- Modern, clean design with a delivery/logistics color theme (blue/green accents)
- Fully responsive (mobile-friendly)
- Smooth scroll animations between sections
