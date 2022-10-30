import cors from "cors";
import allowedOrigins from "./allowedOrigins";

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
