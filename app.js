import express from 'express'

const app = express()

app.use('/', (req, res) => {
    res.send('pong')
});

app.post('/complain', )

export default app