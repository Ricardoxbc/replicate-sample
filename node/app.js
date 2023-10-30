import express from 'express'
import Replicate from 'replicate'
import Multer from 'multer'
import fs from 'fs'
import cors from 'cors'

const uploads = Multer({dest: './node/images/'})

const app = express()
const router = express.Router()
const replicate = new Replicate({
  auth: '...',
})

app.use((req, res, next) => {
  console.log(req.url, req.body)
  next()
})
app.use(cors())
app.use(express.json({limit: '25mb'}))
app.use(router)
// app.use(cors({
//     origin: '*',
//     allowedHeaders: '*',
//     methods: ['POST', 'GET']
// }))

// router.post('/', uploads.single('image'), async (req, res) => {
router.post('/', async (req, res) => {
  // const image = req.file
  // const base64 = fs.readFileSync(image.path, {encoding: 'base64'})
  // const mimeType = "image/png";
  // const dataURI = `data:${mimeType};base64,${base64}`;
  // if (!image || !base64 ) {
  const {image} = req.body
  if (!image){
    res.status(500).json({})
    return
  }
  const output = await replicate.run(
    'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
    {
      input: {
        image: image,
        scale: 1
      },
    }
  )
  console.log({ output })
  res.json({ output })
})

app.listen(80, () => {
  console.log('Listen on port', 80)
})
