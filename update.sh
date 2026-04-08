docker compose down
git checkout master
git pull origin
npm i
npx prisma migrate prod
docker compose up -d