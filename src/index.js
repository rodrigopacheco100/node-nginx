const fastify = require("fastify")
const { faker } = require('@faker-js/faker')
const { PrismaClient } = require('@prisma/client')

const server = fastify()

const prisma = new PrismaClient({
  log: ['query']
})

server.get("/", async () => {
  const newName = faker.name.fullName()

  await prisma.people.create({
    data: {
      name: newName
    }
  })

  const people = await prisma.people.findMany({
    select: {
      name: true
    }
  })

  const nameList = people.reduce((acc, person) => {
    return acc + `<li>${person.name}</li>
    `
  }, '')

  return `
          <h1>Full Cycle Rocks!</h1>
          <ul>
            ${nameList}</ul>
          `
})

server.listen({ port: 3000, host: '0.0.0.0' }).then((uri) => {
  console.log('App is running at', uri)
})
