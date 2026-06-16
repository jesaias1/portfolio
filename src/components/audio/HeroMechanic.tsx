export function HeroMechanic() {
  return (
    <div className="mechanic" aria-label="Animated MIDI drawing and controller input demonstration">
      <div className="mechanic__panel mechanic__panel--midium">
        <div className="mechanic__label">MIDIUM gesture input</div>
        <svg viewBox="0 0 640 320" role="img" aria-label="A drawn line becomes MIDI notes">
          <defs>
            <pattern id="midi-grid" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 40" fill="none" stroke="rgba(240,240,236,.16)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="640" height="320" fill="url(#midi-grid)" />
          <g className="mechanic__notes">
            <rect x="72" y="210" width="56" height="12" rx="2" />
            <rect x="146" y="184" width="78" height="12" rx="2" />
            <rect x="250" y="152" width="48" height="12" rx="2" />
            <rect x="326" y="168" width="96" height="12" rx="2" />
            <rect x="458" y="112" width="66" height="12" rx="2" />
          </g>
          <path
            className="mechanic__drawn-line"
            d="M 56 232 C 122 184, 160 174, 216 186 S 304 130, 370 154 S 470 96, 566 126"
            fill="none"
            pathLength="1"
          />
          <circle className="mechanic__cursor" cx="566" cy="126" r="8" />
        </svg>
      </div>
      <div className="mechanic__panel mechanic__panel--abyx">
        <div className="mechanic__label">ABYX controller output</div>
        <div className="controller" aria-hidden="true">
          <div className="controller__body">
            <span className="controller__stick controller__stick--left" />
            <span className="controller__stick controller__stick--right" />
            <span className="controller__dpad" />
            <span className="controller__button controller__button--blue" />
            <span className="controller__button controller__button--red" />
            <span className="controller__button controller__button--yellow" />
            <span className="controller__button controller__button--green" />
            <span className="controller__pulse controller__pulse--one" />
            <span className="controller__pulse controller__pulse--two" />
          </div>
        </div>
        <div className="signal-bars" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} style={{ animationDelay: `${index * 80}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
