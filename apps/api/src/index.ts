import express, { Application, Request, Response } from "express";
import healthRouter from "./routes/health";
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
import organizationRouter from "./routes/organization";

const app: Application = express();
const PORT: number = 3000;

// Allow all cross-origin requests
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// middleware
app.use(express.json())

// better-auth
app.all('/api/auth/{*any}', toNodeHandler(auth));

// health router
app.use('/api/health', healthRouter);


// organization
app.use('/api/organization', organizationRouter);

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