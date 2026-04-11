-- Maphoshy Lifestyle — Seed Content
-- Migration: 003_seed_content
-- Populates content tables from existing hardcoded data

-- ============================================================
-- PORTFOLIO ITEMS (all 47 existing images)
-- ============================================================
insert into public.portfolio_items (src, alt, category, label, display_order) values
  ('/assets/image00001.jpeg', 'Maphoshy Lifestyle — personal styling',  'styling',       'Personal Styling',   1),
  ('/assets/image00002.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   2),
  ('/assets/image00003.jpeg', 'Maphoshy Lifestyle — event styling',     'event',         'Event Styling',      3),
  ('/assets/image00004.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     4),
  ('/assets/image00005.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   5),
  ('/assets/image00006.jpeg', 'Maphoshy Lifestyle — corporate styling', 'corporate',     'Corporate Styling',  6),
  ('/assets/image00007.jpeg', 'Maphoshy Lifestyle — event styling',     'event',         'Event Styling',      7),
  ('/assets/image00008.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     8),
  ('/assets/image00009.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   9),
  ('/assets/image00010.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   10),
  ('/assets/image00011.jpeg', 'Maphoshy Lifestyle — event',             'event',         'Event Styling',      11),
  ('/assets/image00012.jpeg', 'Maphoshy Lifestyle — alteration',        'alteration',    'Alteration',         12),
  ('/assets/image00013.jpeg', 'Maphoshy Lifestyle — corporate',         'corporate',     'Corporate Styling',  13),
  ('/assets/image00014.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     14),
  ('/assets/image00015.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   15),
  ('/assets/image00016.jpeg', 'Maphoshy Lifestyle — event',             'event',         'Event Styling',      16),
  ('/assets/image00017.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   17),
  ('/assets/image00018.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     18),
  ('/assets/image00019.jpeg', 'Maphoshy Lifestyle — corporate',         'corporate',     'Corporate Styling',  19),
  ('/assets/image00020.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   20),
  ('/assets/image00021.jpeg', 'Maphoshy Lifestyle — event',             'event',         'Event Styling',      21),
  ('/assets/image00022.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     22),
  ('/assets/image00023.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   23),
  ('/assets/image00024.jpeg', 'Maphoshy Lifestyle — alteration',        'alteration',    'Alteration',         24),
  ('/assets/image00025.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   25),
  ('/assets/image00026.jpeg', 'Maphoshy Lifestyle — event',             'event',         'Event Styling',      26),
  ('/assets/image00027.jpeg', 'Maphoshy Lifestyle — corporate',         'corporate',     'Corporate Styling',  27),
  ('/assets/image00028.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     28),
  ('/assets/image00029.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   29),
  ('/assets/image00030.jpeg', 'Maphoshy Lifestyle — event',             'event',         'Event Styling',      30),
  ('/assets/image00031.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   31),
  ('/assets/image00032.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     32),
  ('/assets/image00033.jpeg', 'Maphoshy Lifestyle — corporate',         'corporate',     'Corporate Styling',  33),
  ('/assets/image00034.jpeg', 'Maphoshy Lifestyle — event',             'event',         'Event Styling',      34),
  ('/assets/image00035.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   35),
  ('/assets/image00036.jpeg', 'Maphoshy Lifestyle — alteration',        'alteration',    'Alteration',         36),
  ('/assets/image00037.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   37),
  ('/assets/image00038.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     38),
  ('/assets/image00039.jpeg', 'Maphoshy Lifestyle — event',             'event',         'Event Styling',      39),
  ('/assets/image00040.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   40),
  ('/assets/image00041.jpeg', 'Maphoshy Lifestyle — corporate',         'corporate',     'Corporate Styling',  41),
  ('/assets/image00042.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     42),
  ('/assets/image00043.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   43),
  ('/assets/image00044.jpeg', 'Maphoshy Lifestyle — event',             'event',         'Event Styling',      44),
  ('/assets/image00045.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   45),
  ('/assets/image00046.jpeg', 'Maphoshy Lifestyle — custom garment',    'custom_garment','Custom Garment',     46),
  ('/assets/image00047.jpeg', 'Maphoshy Lifestyle — styling',           'styling',       'Personal Styling',   47)
on conflict do nothing;

-- ============================================================
-- SERVICE CONTENT
-- ============================================================
insert into public.service_content (service_key, title, description, includes, price_from, booking_key, icon_name) values
  (
    'consultation',
    'Personal Style Consultation',
    'Your style journey starts here. In this deep-dive session, Portia gets to know you — your lifestyle, personality, body shape, colour palette and goals. Together you''ll define your signature style and build a clear roadmap to achieve it.',
    array[
      '60–90 minute style assessment',
      'Body shape and colour analysis',
      'Lifestyle and wardrobe audit',
      'Personalised style brief',
      'Shopping list and brand recommendations'
    ],
    'R 500',
    'consultation',
    'Sparkles'
  ),
  (
    'wardrobe',
    'Wardrobe Curation & Editing',
    'A cluttered wardrobe leads to decision fatigue and wasted money. Portia visits your space (or works with you virtually), edits what no longer serves you, organises what stays, and identifies the exact pieces that will complete your wardrobe.',
    array[
      'Full wardrobe audit',
      'Category-by-category edit',
      'Styling and outfit mapping',
      'Gap analysis shopping list',
      'Storage and organisation tips'
    ],
    'R 800',
    'wardrobe',
    'Shirt'
  ),
  (
    'shopping',
    'Personal Shopping Services',
    'Skip the overwhelm. Portia does the research, visits the stores, and presents you with curated options that fit your style, body and budget — saving you hours and money.',
    array[
      'Pre-shopping style brief',
      'In-store or online sourcing',
      'Budget-aligned selections',
      'Try-on session and fit review',
      'Final look approval and care guidance'
    ],
    'R 600',
    'shopping',
    'ShoppingBag'
  ),
  (
    'corporate',
    'Professional & Corporate Styling',
    'Your appearance is part of your personal brand. Portia works with professionals and executives to build a wardrobe that reflects their position, communicates confidence and aligns with their industry.',
    array[
      'Industry and role analysis',
      'Dress code interpretation',
      'Power wardrobe building',
      'Grooming and accessory guidance',
      'Presentation and interview dressing'
    ],
    'R 700',
    'corporate',
    'Briefcase'
  ),
  (
    'event',
    'Event & Special Occasion Styling',
    'Every milestone deserves an unforgettable look. Whether it''s a wedding, graduation, gala, birthday shoot or media appearance — Portia will make sure you look and feel extraordinary.',
    array[
      'Event brief and theme consultation',
      'Outfit sourcing or custom design',
      'Accessories and hair & makeup direction',
      'Final outfit approval',
      'On-the-day styling (optional)'
    ],
    'R 650',
    'event',
    'Star'
  ),
  (
    'custom_garment',
    'Custom Design & In-House Alterations',
    'When off-the-rack just won''t do. Portia designs and produces bespoke garments from scratch — tailored precisely to your measurements, fabric preferences and occasion. She also offers expert alterations on existing pieces.',
    array[
      'Design consultation and brief',
      'Fabric and trim selection',
      'Full body measurements',
      'Multiple fitting sessions',
      'Finished garment with care instructions'
    ],
    'R 400',
    'custom_garment',
    'Scissors'
  )
on conflict (service_key) do nothing;

-- ============================================================
-- PRICING ENTRIES
-- ============================================================
insert into public.pricing_entries (name, description, price, note, highlight, booking_key, display_order) values
  ('Style Discovery Session',       'For undecided clients — Portia guides you to the right service.',                                        'R 350',      'Video call or in-person',          false, 'style_discovery',  1),
  ('Personal Style Consultation',   '60–90 minute deep-dive into your style identity, colour palette and wardrobe goals.',                    'R 500',      'In-person or virtual',             true,  'consultation',     2),
  ('Wardrobe Curation & Editing',   'Full wardrobe audit, edit and organisation with a shopping gap list.',                                   'From R 800', 'Duration varies by wardrobe size', false, 'wardrobe',         3),
  ('Personal Shopping',             'Portia sources and presents curated options aligned to your style and budget.',                          'From R 600', '+ travel costs if applicable',     false, 'shopping',         4),
  ('Corporate & Professional Styling', 'Build a power wardrobe for your career and brand.',                                                   'From R 700', 'Includes dress code analysis',     false, 'corporate',        5),
  ('Event & Occasion Styling',      'One-off look creation for weddings, graduations, galas and more.',                                       'From R 650', 'Custom garment add-on available',  false, 'event',            6),
  ('Custom Garment Design',         'Bespoke garments designed and made in-house from your measurements.',                                    'From R 400', 'Price excludes fabric cost',        false, 'custom_garment',   7),
  ('In-House Alterations',          'Expert alterations — hemming, taking in/letting out, zip replacement and more.',                         'From R 400', 'Price depends on complexity',       false, 'alteration',       8)
on conflict do nothing;

-- ============================================================
-- FAQS
-- ============================================================
insert into public.faqs (question, answer, display_order) values
  (
    'Why do I pay upfront?',
    'The consultation fee secures Portia''s time and expertise for your session. It ensures that only committed clients are scheduled, which means Portia can give each client her full attention without last-minute cancellations.',
    1
  ),
  (
    'Can the consultation fee be deducted from my final service cost?',
    'Yes — for clients who proceed to a full service (custom garment, wardrobe, etc.) within 30 days of their consultation, the consultation fee is credited towards the total. Speak to Portia directly to confirm this arrangement.',
    2
  ),
  (
    'What payment methods are accepted?',
    'All payments are processed securely through PayFast. You can pay via credit or debit card (Visa, Mastercard), EFT, Capitec Pay, and SnapScan. Your card details are never shared with Maphoshy Lifestyle.',
    3
  ),
  (
    'What happens if I need to cancel or reschedule?',
    'Please give at least 48 hours'' notice for cancellations or rescheduling. Portia will work with you to find a new date. Refunds for cancellations are handled on a case-by-case basis — reach out via WhatsApp or email.',
    4
  ),
  (
    'Are virtual consultations available?',
    'Yes! Most consultations can be done via video call. The Style Discovery Session, Personal Style Consultation and Personal Shopping are all available virtually. Custom garment and alteration services require an in-person fitting.',
    5
  )
on conflict do nothing;
