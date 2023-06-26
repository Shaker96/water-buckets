import { useState } from 'react';
import getShortestPath from '../utils/WaterJugChallenge'
import '../styles/buckets.scss'

type Result = {
  bucketX: number,
  bucketY: number,
  expl?: string
}

function Body() {
  const exceptThis = ['e', 'E', '.', ',', '+', '-']

  const [bucketX, setBucketX] = useState(1);
  const [bucketY, setBucketY] = useState(1);
  const [bucketZ, setBucketZ] = useState(1);
  const [dirty, setDirty] = useState(false);

  const [formattedResults, setFormattedResults] = useState<Result[]>([]);

  const handleBucketInput = (e: React.ChangeEvent) => {
    const el = e.target as HTMLInputElement;
    const val = parseInt(el.value, 10) === 0 ? 1 : parseInt(el.value, 10)
    switch (el.id) {
      case 'x':
        setBucketX(val)
        break;
      case 'y':
        setBucketY(val)
        break;
      default:
        setBucketZ(val)
        break;
    }
    el.value = isNaN(val) ? '' : `${val}`
  }

  const runCalculation = (e: React.FormEvent) => {
    setDirty(true)
    e.preventDefault()
    setFormattedResults([])

    let buckets = bucketX >= bucketY ? { large: bucketX, small: bucketY } : { large: bucketY, small: bucketX }
    let xIsLarge = bucketX >= bucketY
    let results = getShortestPath(buckets, bucketZ)

    if (typeof results === 'string') {
      return
    }

    results?.map((r, i) => {
      if (i === 0) return
      let expl = ''

      if (xIsLarge) {
        expl = r.expl?.replace('large', 'X').replace('small', 'Y') as string
        setFormattedResults(results => [...results, { bucketX: r.large, bucketY: r.small, expl: expl }])
      } else {
        expl = r.expl?.replace('large', 'Y').replace('small', 'X') as string
        setFormattedResults(results => [...results, { bucketY: r.large, bucketX: r.small, expl: expl }])
      }
    });
  }

  return (
    <div className="buckets">
      <form className="buckets__form" onSubmit={runCalculation}>
        <div className='form__inputs-wrapper'>
          <div className='form__input'>
            <label htmlFor="x">Bucket X</label>
            <input type="number" required placeholder="Enter X's capacity" id="x" onChange={handleBucketInput} onKeyDown={e => exceptThis.includes(e.key) && e.preventDefault()} value={bucketX} />
          </div>

          <div className='form__input'>
            <label htmlFor="y">Bucket Y</label>
            <input type="number" required placeholder="Enter Y's capacity" id="y" onChange={handleBucketInput} onKeyDown={e => exceptThis.includes(e.key) && e.preventDefault()} value={bucketY} />
          </div>

          <div className='form__input'>
            <label htmlFor="z">Target Z</label>
            <input type="number" required placeholder="Enter required capacity Z" id="z" onChange={handleBucketInput} onKeyDown={e => exceptThis.includes(e.key) && e.preventDefault()} value={bucketZ} />
          </div>
        </div>
        <button className='form__button'>RUN</button>
      </form>
      {formattedResults.length > 0 && (
        <div className='buckets__result'>
          <h3>Results</h3>
          <table>
            <thead>
              <tr>
                <th>Bucket X</th>
                <th>Bucket Y</th>
                <th>Explanation</th>
              </tr>
            </thead>
            <tbody>
              {formattedResults.map((r, i) => (
                <tr key={i}>
                  <td>{r.bucketX}</td>
                  <td>{r.bucketY}</td>
                  <td>{r.expl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {formattedResults.length === 0 && dirty === true && (
        <h3>No Solution</h3>
      )}
    </div>
  );
}

export default Body;