const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    const customer = await createCustomer();
    const movies = await createMovies();
    const screens = await createScreens();
    const screenings = await createScreenings(screens, movies);
    await createSeat()
    //const tickets = await createTickets(customer,screenings)
    process.exit(0);
}

async function createCustomer() {
    const customer = await prisma.customer.create({
        data: {
            name: 'Alice',
            contact: {
                create: {
                    email: 'alice@boolean.co.uk',
                    phone: '1234567890'
                }
            }
        },
        include: {
            contact: true
        }
    });

    console.log('Customer created', customer);

    return customer;
}

async function createMovies() {
    const rawMovies = [
        { title: 'The Matrix', runtimeMins: 120 },
        { title: 'Dodgeball', runtimeMins: 154 },
    ];

    const movies = [];

    for (const rawMovie of rawMovies) {
        const movie = await prisma.movie.create({ data: rawMovie });
        movies.push(movie);
    }

    console.log('Movies created', movies);

    return movies;
}

async function createScreens() {
    const rawScreens = [
        { number: 1}, { number: 2}
    ];

    const screens = [];

    for (const rawScreen of rawScreens) {
        const screen = await prisma.screen.create({
            data: rawScreen
        });

        console.log('Screen created', screen);

        screens.push(screen);
    }

    return screens;
}

async function createScreenings(screens, movies) {
    const screeningDate = new Date();
    const screenings = []
    for (const screen of screens) {
        for (let i = 0; i < movies.length; i++) {
            screeningDate.setDate(screeningDate.getDate() + i);

            const screening = await prisma.screening.create({
                data: {
                    startsAt: screeningDate,
                    movie: {
                        connect: {
                            id: movies[i].id
                        }
                    },
                    screen: {
                        connect: {
                            id: screen.id
                        }
                    }
                }
            });
            screenings.push(screening)
            console.log('Screening created', screening);
        }
    }
    return screenings
}

const createSeat = async() => {
    const seat1 = await prisma.seat.create({
        data: {
            seatCode: 'A1',
            screen: {
                connect: {
                    id: 1
                }
            },
            tickets: {
                create: [{
                    screening: {
                        connect: {
                            id: 1
                        }
                    },
                    customer: {
                        connect: {
                            id: 1
                        }
                    },
                    },
                    {
                        screening: {
                            connect: {
                                id: 2
                            }
                        },
                        customer: {
                            connect: {
                                id: 1
                            }
                        },
                        }
                    ]
                }
            }
        })

        const seat2 = await prisma.seat.create({
        data: {
            seatCode: 'A2',
            screen: {
                connect: {
                    id: 1
                    }
                },
            tickets: {
                create: {
                    screening: {
                        connect: {
                            id: 2
                        }
                    },
                    customer: {
                        connect: {
                            id: 1
                        }
                    }
                }
                    }
                }
            })
            console.log(seat1,seat2)
}

seed()
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
    })
    .finally(() => process.exit(1));