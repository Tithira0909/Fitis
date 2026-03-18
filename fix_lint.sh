sed -i "s/import { getImageUrl } from '..\/lib\/utils';//g" src/components/Navbar.tsx
sed -i 's/render: (val: string, item: any) =>/render: (val: any, item: any) =>/g' src/pages/admin/AdminChapters.tsx
