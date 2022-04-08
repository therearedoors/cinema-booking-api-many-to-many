const prisma = require('../utils/prisma');

const getScreenById = async(req, res) => {
        const screen = await prisma.screen.findUnique({
            where : {
                id: Number(req.params.id)
            },
            include: {
                screenings: true,
                seats: true
            }
        })
        res.json({screen: screen})
}

module.exports = { getScreenById };
