import { motion } from 'framer-motion'

const line = {
  hidden: { y: '108%' },
  show: (delay) => ({ y: '0%', transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay } }),
}

// Headline whose lines rise out of a mask the first time it scrolls into view.
// The untransformed heading is what gets observed, so clipped lines still trigger.
export default function Lines({ lines, as = 'h2', className = 'h2', delay = 0, id }) {
  const Tag = motion[as]
  return (
    <Tag className={className} id={id} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
      {lines.map((text, i) => (
        <span className="mask" key={i}>
          <motion.span className="mask__inner" variants={line} custom={delay + i * 0.09}>
            {text}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
