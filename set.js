const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNEc3UjI1eWxYR1ByV1Fac3Bpby85M0I3amhwTGFRS1NocTBSL2IwTkJuYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWGlUeVhEMUk3amUzVkY4ZWs0NGlUdEdwN21NTHNseERja3RoNWdLYUhGST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPRE5McTd1WnBsbjc5N09Tc0YvVzdVNytDckdTVjBTRGZaMk5sL1V3WTI0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJScjVSSytQbFVZcXJicmYveEZzVFg2SFBsZXJjb0JrenNuOHRrMXhvT25rPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNDdFVNWjlkUTFpQWxHQzNIR0ZDUzZra1U2aWg1U3F1ZjNaaGE4TXo1SG89In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdpRjhtRjF4VzJiSEdtYjlzY0VTQ3FBRGdHY28xRVk0ampiU21iOTdwRVU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY0JiZkp1aGE4K09FbjNWd0t1ZnNNbUFSUWF2UFlYQ043SllYZ0I5YlNraz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRWgvQ0RIQ0ZLQ0FJNTkxUm9vRE5zOUdPVG1FNkZrNnRrbGZJaU9YazlrVT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Imx2V25RQjIybC93Ynk2SWQveHdkYXVoT0xockVYOE0zQ1A1SVg1RC9lc1NvWDRvVENTVmV0SVlSZithTEdTMmR0YnRubE9JSEtPNTFTVzBFdFRITEF3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTcxLCJhZHZTZWNyZXRLZXkiOiJCcXk2VzlsazV2Vk41OTN2c0JZR1dKNEVaR2M3cDVqN1NsV2J5NDZHL0k4PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJVVFp4R3NPS1FldUFNSTB5cy1NZkx3IiwicGhvbmVJZCI6IjQ5MWRkN2NjLTNjMDctNGE0NS1iZTlkLTM2ZmQ5NmNkZTBlZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJZaVdobkxZM1dUT0ZQR3hTRTZpSVlGWEIzeWM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOFpYenhwRUJGMTVBVjd5MTdERHU4UXRIMzFjPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkFCQ0QxMjM0IiwibWUiOnsiaWQiOiI5NDc3MDg5Mzc5NDo2MkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLwnZCIIPCdkIDwnZCMIPCdkJHwnZCE8J2QgPCdkItcblxu8J2QgVxuXG7wnZCLXG5cbvCdkIBcblxu8J2QglxuXG7wnZCKXG5cbuKCqcOY4rGg4oKjIiwibGlkIjoiMTE0Mzk2OTkwODI0NTYwOjYyQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSlRha05FREVJemRwTUlHR0FRZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiNkhyUTgvazVWSUR5NUhFcWkzcEpVeGcvWlFFUWt3NHFkYi9ZTXFTb0RWOD0iLCJhY2NvdW50U2lnbmF0dXJlIjoid0F5SFo5WWgxZDdIdTJwa0gxU2hNMFl3eGxKZ3NNdEJIVGxNWjVkNU9xMnRTOXFpa1A1VXErY1RyQXY3Q2lzanNJQjhuOER6Wjh1Rm5pL1p0SlV1RFE9PSIsImRldmljZVNpZ25hdHVyZSI6IkYwWFkyZ3p2WVplTW16Umk5cHhyLzMzSmpza0lzRTJoYTFUaTR4UG5iR2pvRThBZVNQYVZOdm11V1VPbFFBSzFMS2VBaFFuUGcrdUcrdlFnejlQRkR3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3NzA4OTM3OTQ6NjJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZWg2MFBQNU9WU0E4dVJ4S290NlNWTVlQMlVCRUpNT0tuVy8yREtrcUExZiJ9fV0sInBsYXRmb3JtIjoic21iYSIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FJSUNBPT0ifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQ5NjI2NTIwfQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "xh_clinton",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "94770893794",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",       
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "yes",                     
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'Toxic-MD',
    URL : process.env.BOT_MENU_LINKS || 'https://i.ibb.co/mChCjFPL/ad76194e124ff34e.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
