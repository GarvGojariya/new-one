import crypto from "crypto";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
import { ApiError } from "./ApiError";
const iv = crypto.randomBytes(16);
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

const decrypt = async (text) => {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = crypto.createDecipheriv(
        process.env.CRYPTO_ENCRYPT_DECRYPT_ALGORITHM,
        Buffer.from(process.env.CRYPTO_ENCRYPT_DECRYPT_KEY),
        iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const encrypt = async (text) => {
    let cipher = crypto.createCipheriv(
        process.env.CRYPTO_ENCRYPT_DECRYPT_ALGORITHM,
        Buffer.from(process.env.CRYPTO_ENCRYPT_DECRYPT_KEY),
        iv
    );

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString("hex"),
        encryptedData: encrypted.toString("hex"),
    };
};

const generateEncryptedVarifyLink = async (user) => {
    const userDetails = {
        id: user.id,
        name: user.name,
        expireIn: dayjs(),
    };
    try {
        const string = await JSON.stringify(userDetails);
        var encryptedStr = await encrypt(string);
        return encryptedStr;
    } catch (error) {
        throw new ApiError(
            error.status || 500,
            error.message || "Something went wrong"
        );
    }
};

const sendEmailWithVarifyLink = async (email, link, text, subject) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text + " " + link,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new error();
        } else {
        }
    });
};

export {
    generateEncryptedVarifyLink,
    sendEmailWithVarifyLink,
    encrypt,
    decrypt,
};
