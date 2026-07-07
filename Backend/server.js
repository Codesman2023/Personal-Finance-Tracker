const app = require('./src/app')
const { initializeRecurringTransactions } = require('./src/services/recurring.service');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.listen(port, async ()=>{
    console.log(`Server is running on port ${port}`)
    try {
        await initializeRecurringTransactions();
        console.log('Recurring transactions initialized');
    } catch (error) {
        console.error('Error initializing recurring transactions:', error);
    }
})
