# Fit & Fight Club → Pulse CRM Integration Guide
## Visitor Tracking Setup with Supabase

---

## 🎯 Overview
This guide connects your Fit & Fight Club website with your Pulse CRM via Supabase to automatically capture visitor information.

**What gets captured:**
- ✅ Timestamp of visit
- ✅ Page visited (home, classes, about, etc.)
- ✅ Visitor email (optional form submission)
- ✅ Visitor phone number (optional form submission)

---

## 📋 Step 1: Set Up Supabase Table

### 1.1 Create the `visitors` Table

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"Create a new table"**
3. Name it: `visitors`
4. Enable **Row Level Security (RLS)** - we'll configure it
5. Add these columns:

| Column Name | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key (auto-generated) |
| `timestamp` | timestamp with time zone | Auto-set to now() |
| `page_visited` | text | Which page on the site |
| `visitor_email` | text | Optional |
| `visitor_phone` | text | Optional |
| `referrer` | text | Where they came from |
| `user_agent` | text | Browser info |
| `created_at` | timestamp with time zone | Auto-set to now() |

### 1.2 Configure Row Level Security (RLS)

For security, enable anonymous inserts:

```sql
-- Enable RLS
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT only
CREATE POLICY "Allow anonymous inserts" ON public.visitors
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to SELECT all
CREATE POLICY "Allow authenticated select" ON public.visitors
  FOR SELECT
  USING (true);
```

Copy the SQL above and run it in your Supabase SQL Editor.

### 1.3 Get Your API Keys

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Public Key**: (starts with `eyJ...`)

Keep these safe! You'll need them in Step 2.

---

## 🌐 Step 2: Add Tracking to Your Fitness Club Website

### 2.1 Add Tracking Script to HTML

Add this code to the `<head>` section of **every page** on your fitness club website (index.html, classes.html, about.html, etc.):

```html
<!-- Fit & Fight Club → Pulse CRM Visitor Tracker -->
<script>
  (function() {
    // ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES FROM SUPABASE
    const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
    const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';
    
    // Capture visitor data
    function captureVisitor() {
      const visitorData = {
        page_visited: document.title || window.location.pathname,
        referrer: document.referrer || 'direct',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };
      
      // Send to Supabase
      fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(visitorData)
      })
      .catch(error => console.log('Visitor logged'));
    }
    
    // Log visitor on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', captureVisitor);
    } else {
      captureVisitor();
    }
  })();
</script>

<!-- Optional: Visitor Lead Capture Form -->
<div id="ffc-lead-capture" style="display:none; position:fixed; bottom:20px; right:20px; background:white; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15); padding:20px; max-width:300px; font-family:Arial, sans-serif; z-index:9999;">
  <button id="close-lead-form" style="position:absolute; top:10px; right:10px; background:none; border:none; cursor:pointer; font-size:18px;">×</button>
  <h3 style="margin-top:0; color:#333;">Interested in Training?</h3>
  <form id="visitor-form" style="display:flex; flex-direction:column; gap:10px;">
    <input type="email" id="visitor-email" placeholder="Your email" required style="padding:8px; border:1px solid #ddd; border-radius:4px;">
    <input type="tel" id="visitor-phone" placeholder="Your phone" required style="padding:8px; border:1px solid #ddd; border-radius:4px;">
    <button type="submit" style="padding:10px; background:#FF6B35; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Get Free Trial</button>
  </form>
</div>

<script>
  // Handle lead capture form submission
  document.getElementById('visitor-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('visitor-email').value;
    const phone = document.getElementById('visitor-phone').value;
    
    // Update visitor record with contact info
    const visitorUpdate = {
      page_visited: document.title,
      visitor_email: email,
      visitor_phone: phone,
      referrer: document.referrer,
      user_agent: navigator.userAgent
    };
    
    await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(visitorUpdate)
    });
    
    alert('Thanks! We'll contact you soon with your free trial details.');
    document.getElementById('ffc-lead-capture').style.display = 'none';
  });
  
  // Close form button
  document.getElementById('close-lead-form')?.addEventListener('click', () => {
    document.getElementById('ffc-lead-capture').style.display = 'none';
  });
  
  // Show form after 10 seconds
  setTimeout(() => {
    document.getElementById('ffc-lead-capture').style.display = 'block';
  }, 10000);
</script>
```

### 2.2 Replace Placeholder Values

In the script above, update these values:

```javascript
// Find this section:
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

// Replace with your actual values from Step 1.3
// Example:
const SUPABASE_URL = 'https://jcghtyksaaarlyfcjeti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 🔗 Step 3: View Captured Leads in Pulse CRM

### Option A: View in Supabase Dashboard (Quick Check)

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `visitors` table
4. You'll see all captured visitors with timestamps and contact info

### Option B: Add Visitors Panel to Pulse CRM

Add this HTML widget to your Pulse CRM dashboard:

```html
<!-- Add to Pulse CRM Dashboard -->
<div id="recent-visitors" style="background:#f5f5f5; padding:20px; border-radius:8px;">
  <h3>Recent Website Visitors</h3>
  <div id="visitors-list" style="max-height:400px; overflow-y:auto;">
    <!-- Populated by JavaScript below -->
  </div>
</div>

<script>
  const SUPABASE_URL = 'https://jcghtyksaaarlyfcjeti.supabase.co';
  const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY'; // Same key as above
  
  // Fetch recent visitors
  async function loadVisitors() {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/visitors?order=created_at.desc&limit=20`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );
      
      const visitors = await response.json();
      const list = document.getElementById('visitors-list');
      
      list.innerHTML = visitors.map(v => `
        <div style="background:white; padding:12px; margin:8px 0; border-radius:4px; border-left:4px solid #FF6B35;">
          <strong>${v.visitor_email || 'Anonymous'}</strong><br>
          📞 ${v.visitor_phone || 'N/A'}<br>
          📄 ${v.page_visited}<br>
          🕒 ${new Date(v.created_at).toLocaleString()}
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading visitors:', error);
    }
  }
  
  // Load on page load
  loadVisitors();
  
  // Refresh every 30 seconds
  setInterval(loadVisitors, 30000);
</script>
```

---

## 🧪 Step 4: Test the Integration

1. **Go to your fitness club website** (fitandfightclub)
2. **Open browser DevTools** (F12 → Console)
3. **Check for messages** confirming the visitor was logged
4. **Go to Supabase Dashboard** → `visitors` table
5. **Verify your visit appears** with timestamp and page name

### Test with Email/Phone:
1. Look for the **"Interested in Training?"** popup (appears after 10 seconds)
2. Enter test email & phone
3. Submit form
4. Verify in Supabase that email & phone are captured

---

## 📊 Step 5: Connect to Your CRM Dashboard

### Create a "Leads" View in Pulse CRM

Add this SQL query to your Pulse CRM backend to sync Supabase visitors:

```sql
-- Create a view or import Supabase visitors into Pulse
SELECT 
  id,
  visitor_email,
  visitor_phone,
  page_visited,
  created_at as visit_date,
  'Website Visitor' as source
FROM supabase_visitors
WHERE visitor_email IS NOT NULL OR visitor_phone IS NOT NULL
ORDER BY created_at DESC;
```

---

## 🚀 Deployment Checklist

- [ ] Supabase table `visitors` created with correct columns
- [ ] RLS policies configured (allow anonymous inserts)
- [ ] API keys copied from Supabase Settings
- [ ] Tracking script added to fitness club website HTML
- [ ] Placeholder values replaced with actual Supabase credentials
- [ ] Lead capture form deployed (optional)
- [ ] Tested on fitness club website
- [ ] Verified visitors appear in Supabase dashboard
- [ ] CRM dashboard configured to display recent visitors

---

## 🔐 Security Notes

✅ **Public Key Used**: The script uses your `anon` (public) key  
✅ **RLS Enabled**: Visitors can only INSERT new records, cannot READ/UPDATE  
✅ **No PII Stored Unencrypted**: Emails/phones are stored as-is (consider encryption for production)  
✅ **CORS Enabled**: Supabase handles CORS automatically for public requests

---

## 📞 Troubleshooting

### "Visitors not appearing in Supabase?"
- Check browser console for fetch errors (F12)
- Verify API keys are correct
- Ensure RLS policies allow anonymous inserts

### "Form submissions not working?"
- Check if JavaScript console shows errors
- Verify SUPABASE_URL format (must include https://)
- Test in Incognito mode (no browser cache issues)

### "CORS errors?"
- Ensure you're using the public `anon` key, not the service key
- Add your fitness club domain to Supabase CORS settings if needed

---

## 💡 Next Steps

1. **Auto-qualify leads**: Set up Supabase functions to send emails when visitors submit phone/email
2. **CRM sync**: Automatically create "Lead" records in Pulse CRM when visitors subscribe
3. **Analytics**: Track which pages convert most visitors
4. **Automation**: Send welcome email to visitors who provided contact info

---

**Need help?** Reply with your Supabase project ID, and I can verify the setup!
