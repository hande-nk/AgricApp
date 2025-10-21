cat > README.md << 'EOF'
# AgricApp

Full-stack web app with:
- **Frontend:** React (Create React App)
- **Backend:** Node.js/Express, MongoDB

## Local setup
```bash
# backend
cd backend
npm install
cp .env.example .env   # fill values
npm run dev            # or: npm start

# frontend
cd ../frontend
npm install
npm start
