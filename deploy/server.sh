
# Pull code
cd /home/ubuntu/coin-gift
git checkout master
git pull origin master

# Build and deploy
npm install
npm run build
pm2 restart coin-gift