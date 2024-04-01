import * as jose from "jose";
import { DataTypes } from "sequelize";
import bcryptjs from "bcryptjs";
export const userModel = (sequelize) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        refreshToken: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
    });

    // Attach hook to hash password before creating a new user
    User.beforeCreate(async (user, options) => {
        if (user.changed("password")) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);
        }
    });
    User.prototype.generateAccessToken = async function () {
        // return jwt.sign(
        // {
        //     id: this.id,
        //     email: this.email,
        //     name: this.name,
        // },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     {
        //         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        //     }
        // );
        return new jose.SignJWT({
            id: this.id,
            email: this.email,
            name: this.name,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY)
            .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
    };
    User.prototype.generateRefreshToken = async function () {
        // return jwt.sign(
        //     {
        //         _id: this._id,
        //         email: this.email,
        //     },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     {
        //         expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        //     }
        // );
        return new jose.SignJWT({
            id: this.id,
            email: this.email,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY)
            .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));
    };
    User.prototype.isPasswordCorrect = async function (password) {
        return bcryptjs.compare(password, this.password);
    };
    return User;
};
