import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_token: process.env.jwt_access_secret,
  jwt_refresh_token: process.env.jwt_refresh_secret,
  jwt_refresh_expires_id: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_access_expires_id: process.env.JWT_ACCESS_EXPIRES_IN,
};
