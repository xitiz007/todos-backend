const allowedOrigins: string[] = [
  "http://localhost:3000",
  "http://localhost:5000",
];

export const getOrigins = () => {
  const clientOrigin = process.env.CLIENT_URL;
  if (clientOrigin) {
    allowedOrigins.push(clientOrigin);
  }
  return allowedOrigins;
};
