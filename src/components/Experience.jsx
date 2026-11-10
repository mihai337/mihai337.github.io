import Lines from './Lines.jsx'
import { experience, volunteering } from '../data.js'

export default function Experience() {
  return (
    <section className="exp wrap" id="experience" aria-labelledby="exp-title">
      <Lines id="exp-title" lines={['Where I', 'have worked.']} />
      <ol className="exp__list">
        {experience.map((job) => (
          <li className="job" key={job.company}>
            <Lines as="h3" className="job__company" lines={[job.company]} />
            <div className="job__meta">
              <p className="job__role">{job.role}</p>
              <p className="job__when">{job.when}</p>
            </div>
            <ul className="job__points">
              {job.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </li>
        ))}
      </ol>
      <div className="vol">
        <h3 className="h3">Volunteering</h3>
        <ul className="vol__list">
          {volunteering.map((v) => (
            <li key={v.org}>
              <p className="vol__org">{v.org}</p>
              <p className="vol__role">{v.role}</p>
              {v.note && <p className="vol__note">{v.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
