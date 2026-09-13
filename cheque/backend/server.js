const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/authRoutes'));
app.use('/api/banks', require('./routes/bankRoutes'));
app.use('/api/cheques', require('./routes/chequeRoutes'));
app.use('/api/parties', require('./routes/partyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));


app.listen(5000, () => {
  console.log('Server running on http://192.168.1.64:5000');
});
