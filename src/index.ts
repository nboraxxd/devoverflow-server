import express from 'express'

const app = express()
const port = 3000

app.get('/', async (req, res) => {
  const chalk = (await import('chalk')).default

  console.log(chalk.blue('Hello world!'))
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
