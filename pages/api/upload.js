import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
    storage: multer.diskStorage({
      destination: './tmp',
      filename: (req, file, cb) => cb(null, file.originalname),
    }),
});
  
const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

// Returns middleware that processes multiple files sharing the same field name.
const uploadMiddleware = upload.array('theFiles');

// Adds the middleware to Next-Connect
apiRoute.use(uploadMiddleware);

// Process a POST request
apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
});

export default apiRoute;

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
};