npm install prisma@5 @prisma/client@5 --save-dev
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
