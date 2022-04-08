const prisma = require('../utils/prisma');

const createTicket = async(req, res) => {
  /*  const {
        movieTitle,
        screeningStartsAt,
        customerId,
        seatCodes
    } = req.body;*/
    const {
        screeningId,
        customerId,
        seatCodes,
        screenId
    } = req.body;
/*
    const movie = await prisma.movie.findFirst({
        where: {
            title: {
                equals: movieTitle
            }
        }
    })

    const screening = await prisma.screening.findFirst({
        where: {
            startsAt: {
                equals: new Date(Date.parse(screeningStartsAt))
            },
            movieId: {
                equals: movie.id
            }
        }
    })
    */
    const seats = []

    for (const seatCode of seatCodes) {
        const seat = await prisma.seat.findFirst({
            where: {
                seatCode: {
                    equals: seatCode
                },
                screenId: {
                    equals: screenId
                }
            }
        })
        const seatId = {id: seat.id}
        seats.push(seatId)
    }

    const createdTicket = await prisma.ticket.create({
        data: {
            screening: {
                connect: {
                   id: screeningId
                }
            },
            customer: {
                connect: {
                    id: customerId
                }
            },
            seats: {
                connect: seats
            }
        }
    })

    res.json({ticket: createdTicket})
}

module.exports = { createTicket };
