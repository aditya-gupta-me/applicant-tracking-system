import express, { Application, Request, Response } from "express";
import healthRouter from "./routes/health";
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

const app: Application = express();
const PORT: number = 3000;

// middleware
app.use(express.json())

// health router
app.use('/api/health', healthRouter);

// better-auth
app.all('/api/auth/{*any}', toNodeHandler(auth));

// base endpoint
app.get('/', (req: Request, res: Response) => {
    console.log(req.method, req.url);

    return res.status(200).json({ 
        message: 'Hello world!' 
    })
})

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
})