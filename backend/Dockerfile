# /backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# העתקת קבצי הגדרות החבילות בלבד (לניצול זיכרון מטמון של Docker)
COPY package*.json ./

# התקנת ספריות
RUN npm install

# העתקת שאר קבצי הפרויקט
COPY . .

EXPOSE 8080

# פקודת ההפעלה לסביבת פיתוח (Hot Reload)
CMD ["npm", "run", "dev"]