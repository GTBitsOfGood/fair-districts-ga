import prisma from "../../prisma/prisma";


async function handler(req, res) {
    if (req.method === "POST") {
        await postUpload(req, res);
    }
};

async function postUpload(req, res) {
    

    res.status(200).json({});
};