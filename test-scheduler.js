// test-scheduler.js
import dotenv from "dotenv";
dotenv.config(); // <--- This line is CRUCIAL here too!

// Import the function directly
import { checkAndSendReminders } from './corn-jobs/checkAndSendReminders.js'; // Adjust path if needed

async function runTest() {
    console.log('Manually triggering checkAndSendReminders...');
    try {
        await checkAndSendReminders();
        console.log('Manual check completed. Check your email and database.');
    } catch (error) {
        console.error('Error during manual check:', error);
    }
}

runTest();