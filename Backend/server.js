const app = require('./src/app')
const { initializeRecurringTransactions } = require('./src/services/recurring.service');
require('dotenv').config();
const port = 3000;

app.listen(port, async ()=>{
    console.log('server is running on port 3000')
    try {
        await initializeRecurringTransactions();
        console.log('Recurring transactions initialized');
    } catch (error) {
        console.error('Error initializing recurring transactions:', error);
    }
})