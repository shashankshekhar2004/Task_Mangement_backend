

const express = require('express');
const app = express();
require('dotenv').config(); 
const conn = require('./conn'); 
const UserAPI=require('./routes/user')
const TaskAPI=require('./routes/task')
const cors=require('cors');
const gemini=require('./routes/gemini')

app.use(cors());

app.use(express.json());
const PORT = process.env.PORT||8000;

conn();
app.use('/api/v1',UserAPI)
app.use('/api/v2',TaskAPI)
app.use('/api/v3',gemini)

app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
