import { useState } from 'react'
import {saveAs} from 'file-saver'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const handleDownload = () => {
    saveAs(result, 'image.png')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.target.files && event.target.files[0]
    const fr = new FileReader()
    fr.onload = () => {
      setCurrent(fr.result as string)
    }
    fr.readAsDataURL(data as Blob)
    console.log({ data })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.target as HTMLFormElement)
    const image = data.get('image')
    const fr = new FileReader()
    fr.readAsDataURL(image as Blob)
    console.log('RESULT', fr.result)
    fr.onload = () => {
      setLoading(true)
      fetch('http://localhost:80', {
        method: 'post',
        headers: {
          Accepts: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: fr.result }),
      })
        .then((res) => {
          if (!res.ok)
            throw new Error('Error en la peticion. Code: ' + res.status)
          return res.json()
        })
        .then((json) => {
          setResult(json.output || null)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <>
      <header>
        <h1>Replicate plagio</h1>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <input type='file' name='image' onChange={handleChange} />
          <button type='submit'>Send</button>
        </form>
      </header>
      <main>
        <section>
          {current && <img src={current} style={{ maxWidth: 300 }} />}
          {loading && <p> Cargando ... </p>}
          {!loading && result !== null && (
            <div>
              <img src={result} style={{ maxWidth: 600 }} />
              <button onClick={handleDownload}>Descargar</button>
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default App
