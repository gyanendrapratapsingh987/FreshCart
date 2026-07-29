import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

        const tokenDecode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!tokenDecode.id) {
            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

        req.userId = tokenDecode.id;

        next();

    } catch (error) {
        console.log(error.message);

        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default authUser;