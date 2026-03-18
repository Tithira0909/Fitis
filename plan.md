1. **Database schema update**:
   - Modify `chapters` table in `backend/init_db.js` to include the required fields: `name`, `slug`, `short_description`, `hero_title`, `breadcrumb_title`, `members_count`, `members_summary_text`, `view_all_link`, `president_name`, `president_designation`, `president_company`, `president_image_url`, `president_message_body`. (Some of these can also be moved to child tables if it makes sense, but most seem 1:1 with chapter except objectives and exco).
   - Create a `chapter_objectives` table: `id`, `chapter_id`, `objective_text`, `sort_order`.
   - Create a `chapter_exco_members` table: `id`, `chapter_id`, `name`, `designation`, `company`, `role`, `image_url`, `linkedin_url`, `sort_order`, `status`.
   - Update `TABLE_COLUMNS` in `backend/server.js` and add specific endpoints if needed for the related tables.

2. **Backend API updates**:
   - Create a custom GET endpoint `/api/chapters/:slug` that fetches chapter info along with its objectives and exco members to be used by the frontend `ChapterDetail` page.
   - Update `backend/server.js` `TABLE_COLUMNS` to include the new chapter fields, and add specific routes for `chapter_objectives` and `chapter_exco_members`.

3. **Admin Dashboard updates**:
   - In `src/pages/admin/AdminChapters.tsx`, we need to change it from a standard `GenericAdminCrud` to a more custom tabbed layout similar to what was requested (Basic Info, Objectives, President Message, Executive Committee, Members Summary). Or, we can modify `GenericAdminCrud` if it's flexible enough, but a custom `AdminChapterDetail` page or tabs would work better for nested repeatable data.
   - We will need to create child CRUD components or API integration for objectives and exco.

4. **Frontend `ChapterDetail` Page Re-design**:
   - Rewrite `src/pages/ChapterDetail.tsx` to match the exact references:
     - Hero/Breadcrumbs with the title.
     - Objectives section (2-column desktop, 1-column mobile).
     - Members summary strip (highlighted strip with count, description, and "VIEW ALL" button).
     - Executive Committee section (Responsive grid of cards with picture, name, designation, company, role label, linkedIn).
     - President's Message (image left, message right, title "CHAPTER PRESIDENT'S MESSAGE").
   - Fetch data from the API endpoint instead of hardcoded `chaptersData`.

5. **Pre-commit testing**: Use Playwright or visual checks to ensure the pages load and look correctly.
