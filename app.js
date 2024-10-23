import express from 'express'
import complainRoutes from './routes/complainRoutes.js'
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/ping', (req, res) => {
    res.send('pong')
});

app.use('/complain', complainRoutes);

export default app;