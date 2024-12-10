import dotenv from "dotenv";

dotenv.config();

interface AppConfig {
  name: string;
  serverURL: string;
  apiURL: string;
  clientURL: string;
}

interface OtpConfig {
  apiKey: string;
  senderId: string;
}

interface SendEmailConfig {
  host: string;
  user: string;
  pass: string;
}

interface JwtConfig {
  accessSecret: string;
  accessTokenLife: string;
  refreshSecret: string;
  refreshTokenLife: string;
}

interface InstanceConfig {
  key_id: string;
  key_secret: string;
}

interface Config {
  accessSecret(tokenWithoutBearer: any, accessSecret: any, arg2: (err: any, decoded: any) => Promise<any>): unknown;
  app: AppConfig;
  otp: OtpConfig;
  sendEmail: SendEmailConfig;
  database: string;
  jwt: JwtConfig;
  instance: InstanceConfig;
}
const config: Config = {
    app: {
        name: "WA-ERP",
        serverURL: process.env.BASE_SERVER_URL || "",
        apiURL: process.env.BASE_API_URL || "",
        clientURL: process.env.BASE_CLIENT_URL || "http://localhost:3000",
    },
    otp: {
        apiKey: process.env.OTP_APIKEY || "",
        senderId: process.env.SENDER_ID || "",
    },
    sendEmail: {
        host: process.env.HOST_EMAIL || "",
        user: process.env.USER || "",
        pass: process.env.PASSWORD || "",
    },
    database: process.env.DB_CONNECT || "",
    jwt: {
        accessSecret: process.env.ACCESS_TOKEN_SECRET || "",
        accessTokenLife: process.env.ACCESS_TOKEN_LIFE || "",
        refreshSecret: process.env.REFRESH_TOKEN_SECRET || "",
        refreshTokenLife: process.env.REFRESH_TOKEN_LIFE || "",
    },
    instance: {
        key_id: process.env.KEY_ID || "",
        key_secret: process.env.KEY_SECRET || "",
    },
    accessSecret: function (tokenWithoutBearer: any, accessSecret: any, arg2: (err: any, decoded: any) => Promise<any>): unknown {
        throw new Error("Function not implemented.");
    }
};

export default config;