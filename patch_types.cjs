const fs = require('fs');

function patch(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Update interface
  content = content.replace(
    /category: 'government' \| 'industry' \| 'international' \| 'premium_corporate' \| 'corporate' \| 'supporting';/,
    "category: 'government_partners' | 'fitis_corporate_partners' | 'industry_partners' | 'international_bodies' | 'premium_corporate_partners' | 'corporate_partners';"
  );

  // Update CATEGORY_ORDER array
  content = content.replace(
    /const CATEGORY_ORDER = \[\n\s*'government',\n\s*'corporate',\n\s*'industry',\n\s*'international',\n\s*'premium_corporate',\n\];/,
    "const CATEGORY_ORDER = [\n  'government_partners',\n  'fitis_corporate_partners',\n  'industry_partners',\n  'international_bodies',\n  'premium_corporate_partners',\n  'corporate_partners',\n];"
  );

  // also check original Partners.tsx format which had supporting
  content = content.replace(
    /const CATEGORY_ORDER = \[\n\s*'government',\n\s*'industry',\n\s*'international',\n\s*'premium_corporate',\n\s*'corporate',\n\s*'supporting',\n\];/,
    "const CATEGORY_ORDER = [\n  'government_partners',\n  'fitis_corporate_partners',\n  'industry_partners',\n  'international_bodies',\n  'premium_corporate_partners',\n  'corporate_partners',\n];"
  );

  // Update CATEGORY_LABELS
  content = content.replace(
    /const CATEGORY_LABELS: Record<string, string> = \{\n\s*government: 'Government Partners',\n\s*corporate: 'FITIS Corporate Partners',\n\s*industry: 'Industry Partners',\n\s*international: 'International Bodies',\n\s*premium_corporate: 'Premium Corporate Partners',\n\s*\};\n/s,
    "const CATEGORY_LABELS: Record<string, string> = {\n  government_partners: 'Government Partners',\n  fitis_corporate_partners: 'FITIS Corporate Partners',\n  industry_partners: 'Industry Partners',\n  international_bodies: 'International Bodies',\n  premium_corporate_partners: 'Premium Corporate Partners',\n  corporate_partners: 'Corporate Partners',\n};\n"
  );

  content = content.replace(
    /const CATEGORY_LABELS: Record<string, string> = \{\n\s*government: 'GOVERNMENT PARTNERS',\n\s*industry: 'INDUSTRY PARTNERS',\n\s*international: 'INTERNATIONAL BODIES',\n\s*premium_corporate: 'PREMIUM CORPORATE PARTNERS',\n\s*corporate: 'FITIS CORPORATE PARTNERS',\n\s*supporting: 'SUPPORTING PARTNERS',\n\};/s,
    "const CATEGORY_LABELS: Record<string, string> = {\n  government_partners: 'GOVERNMENT PARTNERS',\n  fitis_corporate_partners: 'FITIS CORPORATE PARTNERS',\n  industry_partners: 'INDUSTRY PARTNERS',\n  international_bodies: 'INTERNATIONAL BODIES',\n  premium_corporate_partners: 'PREMIUM CORPORATE PARTNERS',\n  corporate_partners: 'CORPORATE PARTNERS',\n};"
  );

  fs.writeFileSync(path, content, 'utf8');
}

patch('src/pages/Home.tsx');
patch('src/pages/Partners.tsx');
console.log('Patched types successfully.');
