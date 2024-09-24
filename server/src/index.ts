import cors from 'cors';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import routes from './routes';
require('dotenv').config();

const allowlist = ['http://localhost:5173'];

const corsOptionsDelegate = (req: any, callback: any) => {
	let corsOptions;
	let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

	if (isDomainAllowed) {
		corsOptions = {
			origin: true,
			credentials: true,
			exposedHeaders: ['Content-Disposition'],
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			optionsSuccessStatus: 204,
		};
	} else {
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

const app: Application = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
	.connect(process.env.DB_URL ?? '')
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptionsDelegate));

// Routes
app.use('/api', routes);

app.use('/api-status', (req, res) => {
	res.json({ success: true });
});

app.listen(PORT, () => {
	console.log(process.env.PORT);
	console.log(`Server is running on http://localhost:${PORT}`);
});
