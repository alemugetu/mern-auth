import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser  from 'cookie-parser';  
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';


const app = express();
const port = process.env.PORT || 4000
connectDB();

//“If a request comes with JSON data in the body, 
// automatically convert it into a JavaScript object.”
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));
app.use(express.urlencoded({ extended: true }));
//API Endpoints


app.get('/', (req, res)=> res.send("API working fine and fixed"));
app.use('/api/auth', authRouter);


app.listen(port, () => 
    console.log(`Server is running on port ${port}`));
