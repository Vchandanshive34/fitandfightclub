# 🚀 Quick Start: Fit & Fight Club CRM Integration

## 3-Minute Setup

### Step 1️⃣: Get Your Supabase Credentials (2 minutes)

1. Go to: https://supabase.com/dashboard/org/jcghtyksaaarlyfcjeti
2. Click on your project
3. Go to **Settings → API**
4. Copy:
   ```
   Project URL: https://YOUR_PROJECT_ID.supabase.co
   Anon Public Key: eyJ...
   ```

### Step 2️⃣: Create Visitors Table in Supabase (1 minute)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create visitors table
CREATE TABLE IF NOT EXISTS public.visitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_visited text,
  visitor_email text,
  visitor_phone text,
  referrer text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON public.visitors
  FOR INSERT
  WITH CHECK (true);
```

### Step 3️⃣: Add Tracking to Your Website (30 seconds)

In your fitness club website's HTML `<head>` tag, add:

```html
<script src="https://YOUR_DOMAIN/visitor-tracker.js"></script>
<link rel="stylesheet" href="https://YOUR_DOMAIN/lead-capture-form.css">
<script src="https://YOUR_DOMAIN/lead-capture-form.js"></script>
```

Or copy-paste the full script from `visitor-tracker.js`, replacing:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';
```

### Step 4️⃣: Test It! (30 seconds)

1. Visit your fitness club website
2. Open browser console (F12)
3. You should see: ✓ Visitor logged successfully
4. Go to Supabase → Table Editor → `visitors`
5. Verify your visit appears! ✅

---

## Files Included

| File | Purpose |
|------|---------|
| `visitor-tracker.js` | Core tracking script (add to all pages) |
| `lead-capture-form.html` | Optional popup form for email/phone |
| `crm-dashboard-widget.html` | Display leads in Pulse CRM dashboard |
| `supabase-setup-guide.md` | Detailed setup instructions |

---

## 📁 Implementation Examples

### Example 1: Minimal Setup (Tracking Only)
```html
<!DOCTYPE html>
<html>
<head>
  <title>Fit & Fight Club</title>
  
  <!-- Add tracking script -->
  <script>
    const SUPABASE_URL = 'https://jcghtyksaaarlyfcjeti.supabase.co';
    const SUPABASE_ANON_KEY = 'your_anon_key_here';
    
    (function() {
      function captureVisitor() {
        fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            page_visited: document.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent
          })
        });
      }
      document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', captureVisitor)
        : captureVisitor();
    })();
  </script>
</head>
<body>
  <h1>Welcome to Fit & Fight Club</h1>
</body>
</html>
```

### Example 2: With Lead Capture Form
```html
<!DOCTYPE html>
<html>
<head>
  <script src="visitor-tracker.js"></script>
</head>
<body>
  <!-- Your website content -->
  
  <!-- Add lead form at bottom of body -->
  <div id="lead-popup"></div>
  <script src="lead-capture-form.html"></script>
</body>
</html>
```

---

## 🔗 Connect to Your CRM

Add this to your Pulse CRM dashboard:

1. Copy code from `crm-dashboard-widget.html`
2. Replace Supabase credentials
3. Paste into a dashboard page
4. Done! Real-time visitor tracking appears 📊

---

## ✅ Verification Checklist

- [ ] Supabase project accessible
- [ ] `visitors` table created with RLS policies
- [ ] Tracking script added to website
- [ ] Page loads without errors (check console)
- [ ] Visitor data appears in Supabase table
- [ ] Lead form appears after 10 seconds
- [ ] Form submission works
- [ ] CRM dashboard displays visitors

---

## 🆘 Troubleshooting

**"Visitors not appearing?"**
- Check Supabase credentials are correct
- Verify RLS policy allows anonymous inserts
- Check browser console for errors (F12)

**"Form not showing?"**
- Check if JavaScript is enabled
- Verify form HTML is added to page
- Check browser console for errors

**"CRM widget not updating?"**
- Verify Supabase credentials in widget code
- Check browser network tab for API errors
- Try clicking "Refresh" button

**"CORS errors?"**
- Use public `anon` key (not service key)
- Supabase handles CORS automatically
- Check API key format is correct

---

## 🎯 Next Steps

1. **Email Notifications**: Set up emails when visitors submit contact info
2. **CRM Automation**: Auto-create leads in Pulse CRM
3. **Analytics**: Track which pages convert most
4. **Custom Branding**: Adjust form colors to match brand
5. **Lead Qualification**: Add scoring based on page visits

---

## 📞 Support

For issues or questions:
1. Check the detailed guide: `supabase-setup-guide.md`
2. Review Supabase docs: https://supabase.com/docs
3. Check browser console (F12) for error messages

**Happy tracking! 🎉**
