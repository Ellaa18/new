import { useState, useEffect, useRef, useCallback } from 'react'

const HEARTS_TO_WIN = 15
const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝']
const BASKET_WIDTH = 90
const BASKET_HEIGHT = 70
const DOORS_TO_CHOOSE = 3
const MARRY_CARD_URL = new URL('./will u marry me.jpg', import.meta.url).href
const DOOR1_MUSIC_URL = new URL('./WENDI MAK - Tagebignalesh Wey.mp3', import.meta.url).href
const AMBIENT_MUSIC_URL = new URL('./Franz_Liszt_-_Liebestraum_-_Love_Dream(48k).mp3', import.meta.url).href

const DOOR_THEMES = [
  {
    door: 1,
    label: 'በር 1',
    gradient:
      'linear-gradient(135deg, rgba(255,105,180,1) 0%, rgba(190,18,60,1) 45%, rgba(124,58,237,1) 100%)',
    glow: 'rgba(255,105,180,0.55)',
  },
  {
    door: 2,
    label: 'በር 2',
    gradient:
      'linear-gradient(135deg, rgba(56,189,248,1) 0%, rgba(20,184,166,1) 45%, rgba(59,130,246,1) 100%)',
    glow: 'rgba(56,189,248,0.55)',
  },
  {
    door: 3,
    label: 'በር 3',
    gradient:
      'linear-gradient(135deg, rgba(251,191,36,1) 0%, rgba(249,115,22,1) 45%, rgba(236,72,153,1) 100%)',
    glow: 'rgba(251,191,36,0.55)',
  },
]

const PREP1_URL = new URL('./prep 1.jpg', import.meta.url).href
const PREP3_URL = new URL('./prep 3 (2).jpg', import.meta.url).href
const PREP2_URL = new URL('./prep 2.jpg', import.meta.url).href
const WED_DAY_URL = new URL('./wed day.jpg', import.meta.url).href
const PREPARATION_MUSIC_URL = new URL('./Yo_Mariyos_Diges_New_ዮ_ማሪዮስ_ድግስ_ነው_New_Ethiopian_Music_2026_Official.mp3', import.meta.url).href
const WEDDING_MUSIC_URL = new URL('./Abinet_Agonafir_Alemish_Zare_New_አለምሽ_ዛሬ_ነው_አብነት_አጎናፍር_With_LYRICS.mp3', import.meta.url).href
const WEDDING_TEXT = " አሁን ተጋብተናል፡፡ የኔ ነሽ፡፡ በየ ቀኑ እመርጥሻለሁ, በየ ቀኑ አፈቅርሻለሁ, በየ ቀኑ እበዳሻለሁ፡፡ እስከ መጨረሻው አልለይሽም፡፡ 💍"

function getDoorTheme(doorNumber) {
  return DOOR_THEMES.find((d) => d.door === doorNumber) ?? DOOR_THEMES[0]
}

function Door1ProposalRoom({ onBack, onYes, onSkip, registerSkip }) {
  const boxRef = useRef(null)
  const [noMoves, setNoMoves] = useState(0)
  const [noOffset, setNoOffset] = useState({ x: 160, y: 0 })
  const audioRef = useRef(null)

  const fullQuestion =
    "ፍቅሬ ❤️\n" +
    "ከአንቺ ጋር ከተዋወቅሁበት ቀን ጀምሮ ሕይወቴ በጣም ተለውጧል። አንቺ የምወድሽ ሰው ብቻ አይደለሽም፤ \n" +
    "የልቤ ሰላም፣ ደስታዬ እና ከእኔ ጋር የሕይወቴን ቀሪ ዘመን እንድካፈል የምፈልጋት ሰው ነሽ።\n" +
    "ከአንቺ ጋር መሳቅ፣ መደሰት፣ አንዳንድ ጊዜም ችግሮችን አብረን ማለፍ እፈልጋለሁ። \n" +
    "በየቀኑ እንደገና አንቺን መምረጥ እና ሁሌም ከጎንሽ መቆም እፈልጋለሁ።\n" +
    "እኔ ከአንቺ ጋር የሚያምር ቤተሰብ፣ የሚያምር ሕይወት እና ብዙ የማይረሱ ትዝታዎችን መፍጠር እፈልጋለሁ።\n" +
    "እወድሻለሁ፣ ዛሬም ነገም ሁሌም አንቺን እመርጣለሁ። ❤️💍\n" +
    "ስለዚህ ዛሬ ከልቤ አንድ ጥያቄ አለኝ…\n\n" +
    "ፍቅሬ፣ የሕይወቴ አጋር ትሆኚልኛለሽ? 💖\n"+
    "ታገቢኛለሽ? 💍❤️"
  const [typedQuestion, setTypedQuestion] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const isNoFrozen = noMoves >= 8

  useEffect(() => {
    // Better initial placement on small screens.
    const w = window.innerWidth
    setNoOffset({ x: w < 640 ? 90 : 160, y: 0 })
  }, [])

  const typingIntervalRef = useRef(null)
  useEffect(() => {
    let i = 0
    setTypedQuestion('')
    setTypingDone(false)

    const speedMs = 150
    typingIntervalRef.current = setInterval(() => {
      i += 1
      setTypedQuestion(fullQuestion.slice(0, i))
      if (i >= fullQuestion.length) {
        clearInterval(typingIntervalRef.current)
        typingIntervalRef.current = null
        setTypingDone(true)
      }
    }, speedMs)

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (registerSkip) {
      registerSkip(() => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current)
          typingIntervalRef.current = null
        }
        setTypedQuestion(fullQuestion)
        setTypingDone(true)
      })
    }
  }, [registerSkip, fullQuestion])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.9
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const moveNo = useCallback(() => {
    if (!boxRef.current) return
    const rect = boxRef.current.getBoundingClientRect()
    const padding = 12
    const approxNoW = rect.width * 0.26
    const approxNoH = 48

    const maxX = rect.width / 2 - approxNoW / 2 - padding
    const maxY = rect.height / 2 - approxNoH / 2 - padding

    const x = (Math.random() * 2 - 1) * maxX
    const y = (Math.random() * 2 - 1) * maxY
    setNoOffset({ x, y })
  }, [])

  const lastNoMoveRef = useRef(0)
  const maybeMoveNo = useCallback(() => {
    const now = Date.now()
    if (now - lastNoMoveRef.current < 160) return
    lastNoMoveRef.current = now
    moveNo()
  }, [moveNo])

  const handleNo = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setNoMoves((prev) => prev + 1)
    maybeMoveNo()
  }

  return (
    <div className="w-full max-w-4xl text-center relative">
      <audio ref={audioRef} src={DOOR1_MUSIC_URL} loop preload="auto" />

      <button
        type="button"
        onClick={onBack}
        className="
          absolute top-4 right-4
          px-6 py-3 rounded-full
          font-romantic text-lg text-white
          bg-black/30 border border-white/20
          hover:bg-black/40 active:bg-black/50
          transition-colors duration-200
          touch-manipulation
          z-50
        "
      >
      በር
      </button>
      {onSkip && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSkip(); }}
          className="
            absolute top-4 left-4
            px-4 py-2 rounded-full
            font-romantic text-sm text-white
            bg-black/25 border border-white/15
            hover:bg-black/35 active:bg-black/45
            transition-colors duration-150
            touch-manipulation
            z-50
          "
        >
          S
        </button>
      )}

      <div className="mx-auto max-w-xl mb-4 pt-6 sm:pt-8 text-center">
        <p className="font-body text-pink-200/70 text-sm sm:text-base">
          አንብበሽ ጨርሺ 💕
        </p>
      </div>

      <div className="rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
        <div
          className="p-5 sm:p-8"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,220,220,0.16) 0%, rgba(255,105,180,0.10) 40%, rgba(0,0,0,0.25) 100%)',
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              ref={boxRef}
              className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/30"
            >
              <img
                src={MARRY_CARD_URL}
                alt="Will you marry me postcard"
                className="w-full h-[360px] sm:h-[500px] object-contain bg-black/35"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                <div className="relative">
                  <div className="font-romantic text-base sm:text-lg leading-tight text-white whitespace-pre-wrap break-words"
                    style={{ textShadow: '0 0 18px rgba(0,0,0,0.6)' }}>
                    <span className="outlined-sparkle">{typedQuestion}</span>
                    {!typingDone && <span className="inline-block ml-2 animate-pulse">|</span>}
                  </div>

                  <div className="relative h-[80px] mt-3">
                    {typingDone && (
                      <>
                        <button
                          type="button"
                          onClick={onYes}
                          className="
                            absolute left-1/2 top-1/2 -translate-x-[120%] -translate-y-1/2 z-10
                            px-7 py-3 rounded-full
                            font-romantic text-xl sm:text-2xl text-white
                            bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500
                            shadow-lg shadow-pink-500/30
                            animate-glow
                            hover:scale-[1.03] active:scale-[0.99]
                            transition-transform duration-200
                            touch-manipulation
                          "
                        >
                          አዎ 💖
                        </button>

                        <button
                          type="button"
                          onClick={handleNo}
                          className="
                            absolute left-1/2 top-1/2 z-20
                            px-7 py-3 rounded-full
                            font-romantic text-xl sm:text-2xl text-white
                            bg-black/45 border border-white/25
                            backdrop-blur
                            transition-transform duration-200 ease-out
                            touch-manipulation
                          "
                          style={{
                            transform: `translate(-50%, -50%) translate(${noOffset.x}px, ${noOffset.y}px)`,
                            opacity: isNoFrozen ? 1 : 0.98,
                          }}
                          aria-label="No"
                        >
                          አይ
                        </button>
                      </>
                    )}
                  </div>

                  {typingDone && !isNoFrozen && (
                    <div className="text-center text-white/75 text-xs sm:text-sm mt-1">
                      መጀምሪያ አይ በይ እናትየ💕
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StarField() {
  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  ).current

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star absolute rounded-full bg-white/60"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function FallingHeart({ heart, onMiss }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const timer = setTimeout(() => onMiss(heart.id), heart.duration * 1000 + 200)
    return () => clearTimeout(timer)
  }, [heart.id, heart.duration, onMiss])

  return (
    <div
      ref={ref}
      data-heart-id={heart.id}
      className="falling-heart absolute z-10"
      style={{
        left: `${heart.x}%`,
        fontSize: heart.size,
        animationDuration: `${heart.duration}s, ${heart.swayDuration}s`,
        animationDelay: `${heart.delay}s, ${heart.delay}s`,
      }}
    >
      {heart.emoji}
    </div>
  )
}

function Basket({ x, caughtFlash }) {
  return (
    <div
      className="absolute z-30 transition-transform duration-75 basket-glow"
      style={{
        left: x,
        bottom: '8%',
        width: BASKET_WIDTH,
        height: BASKET_HEIGHT,
        transform: caughtFlash ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="basketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9ecd" />
            <stop offset="50%" stopColor="#ff69b4" />
            <stop offset="100%" stopColor="#e84393" />
          </linearGradient>
          <linearGradient id="basketInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffc0d9" />
            <stop offset="100%" stopColor="#ff85b3" />
          </linearGradient>
        </defs>
        {/* Handle */}
        <path
          d="M 25 25 Q 50 -5 75 25"
          fill="none"
          stroke="url(#basketGrad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Basket body */}
        <path
          d="M 15 30 L 25 75 Q 50 85 75 75 L 85 30 Z"
          fill="url(#basketInner)"
          stroke="url(#basketGrad)"
          strokeWidth="3"
        />
        {/* Weave lines */}
        {[35, 45, 55, 65].map((y) => (
          <line key={y} x1="20" y1={y} x2="80" y2={y - 5} stroke="#ff69b4" strokeWidth="1" opacity="0.4" />
        ))}
        {/* Heart on basket */}
        <text x="50" y="58" textAnchor="middle" fontSize="22">💕</text>
      </svg>
    </div>
  )
}

function SideMessage({ caught, total, phase }) {
  const progress = Math.min(caught / total, 1)

  if (phase === 'complete') {
    return (
      <div className="message-enter flex flex-col items-center justify-center text-center px-4 py-6">
        <p className="font-romantic text-3xl sm:text-4xl md:text-5xl text-pink-200 leading-tight mb-3">
          እንዳለ ልቤን ሰብስበሽ ይዘሻል
        </p>
        <p className="font-romantic text-2xl sm:text-3xl md:text-4xl shimmer-text leading-tight">
          ወደ ውስጥ ግቢ 💕
        </p>
        <div className="mt-6 heart-burst text-6xl sm:text-7xl">💖</div>
      </div>
    )
  }

  if (phase === 'doorMenu') {
    return (
      <div className="message-enter flex flex-col items-center justify-center text-center px-4 py-6 h-full">
        <p className="font-romantic text-3xl sm:text-4xl md:text-5xl text-pink-200 leading-tight mb-3">
          ልቤ ውስጥ ግቢ
        </p>
        <p className="font-romantic text-2xl sm:text-3xl text-pink-100/90 leading-tight shimmer-text">
          ከልቤ ውስጥ በር ምረጭ 💕
        </p>
        <div className="mt-6 text-5xl sm:text-6xl animate-pulse-soft">🚪</div>
        <p className="font-body text-pink-200/70 text-xs sm:text-sm mt-4 max-w-xs">
          በር 1 / በር 2 / በር 3
        </p>
      </div>
    )
  }

  if (phase === 'roomView') {
    return (
      <div className="message-enter flex flex-col items-center justify-center text-center px-4 py-6 h-full">
        
        <div className="mt-4 text-5xl sm:text-6xl">🏰</div>
      </div>
    )
  }

  if (phase === 'marryYes') {
    return (
      <div className="message-enter flex flex-col items-center justify-center text-center px-4 py-6">
        <p className="font-romantic text-4xl sm:text-5xl md:text-6xl text-pink-100 leading-tight mb-4">
          ሚስቴ ነሽ የኔ ህሊናየ 💖
        </p>
        <p className="font-body text-pink-200/80 text-sm sm:text-base mb-6">
          እስከ ዘላለም የኔ ብቻ ነሽ። እኔም ያንቺ ብቻ።
        </p>
        <div className="heart-burst text-7xl sm:text-8xl mb-6 animate-pulse-soft">💍</div>
        <p className="font-romantic text-xl sm:text-2xl text-pink-200/90 leading-relaxed max-w-xs">
         ጋብቻችን እውን ነው።
        </p>
      </div>
    )
  }

  if (phase === 'wedding') {
    return (
      <div className="message-enter flex flex-col items-center justify-center text-center px-4 py-6">
        <p className="font-romantic text-4xl sm:text-5xl md:text-6xl text-pink-100 leading-tight mb-4">
          ጋብቻ 💍
        </p>
        <p className="font-body text-pink-200/80 text-sm sm:text-base mb-6">
          Preparing 
        </p>
        <div className="heart-burst text-7xl sm:text-8xl mb-6 animate-pulse-soft">✨</div>
        <p className="font-romantic text-xl sm:text-2xl text-pink-200/90 leading-relaxed max-w-xs">
          Coming 
        </p>
      </div>
    )
  }

  if (phase === 'final') {
    return (
      <div className="message-enter flex flex-col items-center justify-center text-center px-4 py-6">
        <p className="font-romantic text-4xl sm:text-5xl md:text-6xl text-pink-100 leading-tight mb-4">
          ለ ህሊና
        </p>
        <p className="font-body text-pink-200/80 text-sm sm:text-base mb-6">
          እያንዳንዱ ልብ የኔ ክፍልፋይ ነው።
        </p>
        <div className="heart-burst text-7xl sm:text-8xl mb-6 animate-pulse-soft">❤️</div>
        <p className="font-romantic text-xl sm:text-2xl text-pink-200/90 leading-relaxed max-w-xs">
          ሙሉ ልቤን እና እኔነቴን ወስደሻል።
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-6 h-full">
      
      <p className="font-romantic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-pink-100 leading-tight mb-6 animate-float">
        ለ ህሊና ልቤን እንዳለ ውሰጅው።
      </p>
      <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center max-w-[200px] mb-4">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`progress-heart text-lg sm:text-xl ${i < caught ? 'filled opacity-100' : 'opacity-25'}`}
          >
            {i < caught ? '❤️' : '🤍'}
          </span>
        ))}
      </div>
      <div className="w-full max-w-[180px] h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #ff69b4, #ffb6c1, #ff69b4)',
          }}
        />
      </div>
      <p className="font-body text-pink-200/60 text-xs sm:text-sm">
        {caught} / {total} የያዝሻቸው ልቦች
      </p>
      <p className="font-body text-pink-200/40 text-xs mt-4 hidden sm:block">
        ← ባስከቱን አንቀሳቅሽው የኔ ፍቅር →
      </p>
      <p className="font-body text-pink-200/40 text-xs mt-4 sm:hidden">
        ← ባስከቱን አንቀሳቅሽው የኔ ፍቅር →
      </p>
    </div>
  )
}

export default function App() {
  const [phase, setPhase] = useState('playing') // playing | complete | final
  const [hearts, setHearts] = useState([])
  const [caught, setCaught] = useState(0)
  const [basketX, setBasketX] = useState(0)
  const [caughtFlash, setCaughtFlash] = useState(false)
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [selectedDoor, setSelectedDoor] = useState(null) // 1..3

  const containerRef = useRef(null)
  const basketXRef = useRef(0)
  const caughtRef = useRef(0)
  const heartsRef = useRef([])
  const caughtIdsRef = useRef(new Set())
  const heartIdRef = useRef(0)
  const draggingRef = useRef(false)
  const rafRef = useRef(null)
  const ambientAudioRef = useRef(null)
  const slideshowAudioRef = useRef(null)
  const audioFallbackRef = useRef(null)
  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [slideshowRunning, setSlideshowRunning] = useState(false)
  const [showWeddingOption, setShowWeddingOption] = useState(false)
  const [weddingTypingDone, setWeddingTypingDone] = useState(false)
  const [weddingTyped, setWeddingTyped] = useState('')
  const door1SkipRef = useRef(null)

  const playAmbientMusic = useCallback(() => {
    const audio = ambientAudioRef.current
    if (!audio) return

    audio.volume = 0.42
    audio.play().catch(() => {})
  }, [])

  useEffect(() => {
    const audio = ambientAudioRef.current
    const ambientPhases = ['playing', 'complete', 'final', 'doorMenu']

    if (ambientPhases.includes(phase)) {
      playAmbientMusic()
      return
    }

    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [phase, playAmbientMusic])

  const goToDoors = useCallback(() => {
    console.log('goToDoors clicked')
    setPhase('doorMenu')
  }, [])

  const skipAll = useCallback(() => {
    console.log('skipAll clicked', phase)
    // Door1 typing skip
    if (phase === 'roomView' && selectedDoor === 1 && door1SkipRef.current) {
      door1SkipRef.current()
      return
    }

    // Slideshow: jump to last slide and show wedding options
    if (phase === 'slideshow') {
      setSlideshowIndex(2)
      setShowWeddingOption(true)
      setSlideshowRunning(false)
      const audio = slideshowAudioRef.current
      if (audio) { audio.pause(); audio.currentTime = 0 }
      return
    }

    // Wedding typing: finish text
    if (phase === 'weddingDay' || phase === 'weddingCard') {
      setWeddingTyped(WEDDING_TEXT)
      setWeddingTypingDone(true)
      const audio = slideshowAudioRef.current
      if (audio) { audio.pause(); audio.currentTime = 0 }
      return
    }
  }, [phase, selectedDoor])

  useEffect(() => {
    basketXRef.current = basketX
  }, [basketX])

  useEffect(() => {
    caughtRef.current = caught
  }, [caught])

  useEffect(() => {
    heartsRef.current = hearts
  }, [hearts])

  const getMaxX = useCallback(() => {
    const w = containerRef.current?.clientWidth ?? dimensions.width
    return Math.max(0, w - BASKET_WIDTH)
  }, [dimensions.width])

  const initBasket = useCallback(() => {
    const maxX = getMaxX()
    const center = maxX / 2
    setBasketX(center)
    basketXRef.current = center
  }, [getMaxX])

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
      const maxX = getMaxX()
      setBasketX((prev) => Math.min(prev, maxX))
    }
    window.addEventListener('resize', handleResize)
    initBasket()
    return () => window.removeEventListener('resize', handleResize)
  }, [getMaxX, initBasket])

  const spawnHeart = useCallback(() => {
    if (phase !== 'playing') return

    const id = heartIdRef.current++
    const heart = {
      id,
      x: Math.random() * 85 + 5,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      size: `${Math.random() * 14 + 22}px`,
      duration: Math.random() * 3 + 4,
      swayDuration: Math.random() * 2 + 2,
      delay: 0,
    }
    setHearts((prev) => [...prev, heart])
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing') return
    const interval = setInterval(spawnHeart, 600)
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnHeart, i * 200)
    }
    return () => clearInterval(interval)
  }, [phase, spawnHeart])

  const handleMiss = useCallback((id) => {
    setHearts((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const checkCollisions = useCallback(() => {
    if (phase !== 'playing') return

    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const basketLeft = basketXRef.current
    const basketRight = basketLeft + BASKET_WIDTH
    const basketTop = containerRect.height * 0.92 - BASKET_HEIGHT
    const basketBottom = containerRect.height * 0.92

    const heartEls = container.querySelectorAll('[data-heart-id]')
    heartEls.forEach((el) => {
      const id = Number(el.dataset.heartId)
      if (caughtIdsRef.current.has(id)) return

      const rect = el.getBoundingClientRect()
      const heartCenterX = rect.left + rect.width / 2 - containerRect.left
      const heartCenterY = rect.top + rect.height / 2 - containerRect.top

      if (
        heartCenterY >= basketTop &&
        heartCenterY <= basketBottom + 20 &&
        heartCenterX >= basketLeft - 10 &&
        heartCenterX <= basketRight + 10
      ) {
        caughtIdsRef.current.add(id)
        setHearts((prev) => prev.filter((h) => h.id !== id))
        setCaughtFlash(true)
        setTimeout(() => setCaughtFlash(false), 150)

        const newCaught = caughtRef.current + 1
        setCaught(newCaught)

        if (newCaught >= HEARTS_TO_WIN) {
          setTimeout(() => setPhase('complete'), 800)
        }
      }
    })
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing') return

    const loop = () => {
      checkCollisions()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, checkCollisions])

  const moveBasket = useCallback((clientX) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const maxX = rect.width - BASKET_WIDTH
    const x = Math.max(0, Math.min(clientX - rect.left - BASKET_WIDTH / 2, maxX))
    setBasketX(x)
    basketXRef.current = x
  }, [])

  const handlePointerDown = (e) => {
    playAmbientMusic()
    draggingRef.current = true
    moveBasket(e.clientX)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return
    moveBasket(e.clientX)
  }

  const handlePointerUp = () => {
    draggingRef.current = false
  }

  const handleGetOnHeart = () => {
    setSelectedDoor(null)
    goToDoors()
  }

  const handleSelectDoor = (doorNumber) => {
    setSelectedDoor(doorNumber)
    setPhase('roomView')
  }

  const handleBackToDoors = () => {
    setSelectedDoor(null)
    goToDoors()
  }

  const handleContinueAfterRoom = () => {
    setSelectedDoor(null)
    setPhase('final')
  }

  const handleYesMarry = () => {
    setSelectedDoor(null)
    setPhase('slideshow')
    setSlideshowIndex(0)
    setSlideshowRunning(true)
    setShowWeddingOption(false)
  }

  const handleWedding = () => {
    setSelectedDoor(null)
    setPhase('wedding')
  }

  // Slideshow effect and audio control
  useEffect(() => {
    const audio = slideshowAudioRef.current
    let slideTimer = null

    const tryPlay = async (src) => {
      if (audio) {
        try {
          audio.pause()
          audio.currentTime = 0
          audio.src = src
          audio.volume = 0.9
          await audio.play()
          console.log('audio.play succeeded', src)
          // stop any fallback
          if (audioFallbackRef.current) {
            try { audioFallbackRef.current.pause() } catch (e) {}
            audioFallbackRef.current = null
          }
          return
        } catch (err) {
          console.warn('audio.play failed, attempting fallback', err)
        }
      }

      // Fallback: create a new Audio() and try to play
      try {
        if (audioFallbackRef.current) {
          try { audioFallbackRef.current.pause() } catch (e) {}
          audioFallbackRef.current = null
        }
        const fb = new Audio(src)
        fb.loop = true
        fb.volume = 0.9
        await fb.play()
        audioFallbackRef.current = fb
        console.log('fallback audio.play succeeded', src)
      } catch (err) {
        console.error('fallback audio.play failed', err)
      }
    }

    if (phase === 'slideshow') {
      setSlideshowRunning(true)
      setSlideshowIndex(0)
      setShowWeddingOption(false)
      tryPlay(PREPARATION_MUSIC_URL)

      let cycles = 0
      slideTimer = setInterval(() => {
        setSlideshowIndex((s) => {
          const next = (s + 1) % 3
          if (next === 0) cycles += 1
          if (cycles >= 2) setShowWeddingOption(true)
          return next
        })
      }, 4800)
    }

    return () => {
      if (slideTimer) clearInterval(slideTimer)
      if (audio) {
        try { audio.pause() } catch (e) {}
        try { audio.currentTime = 0 } catch (e) {}
      }
      if (audioFallbackRef.current) {
        try { audioFallbackRef.current.pause() } catch (e) {}
        audioFallbackRef.current = null
      }
      setSlideshowRunning(false)
    }
  }, [phase])

  // Wedding day audio + typewriter
  useEffect(() => {
    const audio = slideshowAudioRef.current
    const tryPlay = async (src) => {
      if (audio) {
        try {
          audio.pause()
          audio.currentTime = 0
          audio.src = src
          audio.volume = 0.9
          await audio.play()
          console.log('audio.play succeeded', src)
          if (audioFallbackRef.current) {
            try { audioFallbackRef.current.pause() } catch (e) {}
            audioFallbackRef.current = null
          }
          return
        } catch (err) {
          console.warn('audio.play failed, attempting fallback', err)
        }
      }

      try {
        if (audioFallbackRef.current) {
          try { audioFallbackRef.current.pause() } catch (e) {}
          audioFallbackRef.current = null
        }
        const fb = new Audio(src)
        fb.loop = true
        fb.volume = 0.9
        await fb.play()
        audioFallbackRef.current = fb
        console.log('fallback audio.play succeeded', src)
      } catch (err) {
        console.error('fallback audio.play failed', err)
      }
    }

    if (phase === 'weddingDay' || phase === 'weddingCard') {
      tryPlay(WEDDING_MUSIC_URL)

      setWeddingTyped('')
      setWeddingTypingDone(false)
      let i = 0
      const speed = 80
      const id = setInterval(() => {
        i += 1
        setWeddingTyped(WEDDING_TEXT.slice(0, i))
        if (i >= WEDDING_TEXT.length) {
          clearInterval(id)
          setWeddingTypingDone(true)
        }
      }, speed)

      return () => {
        clearInterval(id)
      }
    }

    if (audio) {
      try { audio.pause() } catch (e) {}
      try { audio.currentTime = 0 } catch (e) {}
    }
    if (audioFallbackRef.current) {
      try { audioFallbackRef.current.pause() } catch (e) {}
      audioFallbackRef.current = null
    }
  }, [phase])

  return (
    <div
      className="app-shell relative w-full h-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0f0c29 0%, #302b63 40%, #24243e 70%, #1a0a2e 100%)',
      }}
    >
      <audio ref={ambientAudioRef} src={AMBIENT_MUSIC_URL} loop preload="auto" />
      <StarField />

      {/* Soft aurora glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255,105,180,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(147,112,219,0.2) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-20 flex flex-col sm:flex-row h-full">
        {/* Side message panel - hidden during slideshow/wedding overlays so pictures show fully */}
        {!(phase === 'slideshow' || phase === 'weddingDay' || phase === 'weddingCard') && (
          <aside
            className={`
              relative z-40 flex-shrink-0
              ${phase === 'playing' ? 'sm:w-[280px] md:w-[320px]' : 'sm:w-full'}
              w-full
              ${phase === 'playing' ? 'h-[28vh] sm:h-full' : 'h-full'}
              flex items-center justify-center
              border-b sm:border-b-0 sm:border-r border-pink-500/10
              bg-gradient-to-b sm:bg-gradient-to-r from-black/20 to-transparent
            `}
          >
            <SideMessage caught={caught} total={HEARTS_TO_WIN} phase={phase} />

            {phase === 'complete' && (
              <button
                onClick={handleGetOnHeart}
                className="
                  absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2
                  px-8 py-3.5 rounded-full
                  font-romantic text-xl sm:text-2xl text-white
                  bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500
                  shadow-lg shadow-pink-500/30
                  animate-glow
                  hover:scale-105 active:scale-95
                  transition-transform duration-200
                  touch-manipulation
                  message-enter
                "
                style={{ animationDelay: '0.5s' }}
              >
                ወደ ልቤ ግቢ 💖
              </button>
            )}

            {phase === 'marryYes' && (
              <div
                className="
                  absolute bottom-6 sm:bottom-10
                  left-1/2 -translate-x-1/2
                  flex gap-3
                  px-2
                "
              >
                <button
                  type="button"
                  onClick={handleBackToDoors}
                  className="
                    px-6 py-3 rounded-full
                    font-romantic text-lg text-white
                    bg-black/30 border border-white/20
                    hover:bg-black/40 active:bg-black/50
                    transition-colors duration-200
                    touch-manipulation
                  "
                >
                  በር
                </button>
                <button
                  type="button"
                  onClick={handleWedding}
                  className="
                    px-6 py-3 rounded-full
                    font-romantic text-lg text-white
                    bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500
                    shadow-lg shadow-pink-500/30
                    hover:scale-[1.02] active:scale-[0.99]
                    transition-transform duration-200
                    touch-manipulation
                  "
                >
                  ጋብቻ 💍
                </button>
              </div>
            )}

            {phase === 'wedding' && (
              <button
                type="button"
                onClick={handleBackToDoors}
                className="
                  absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2
                  px-8 py-3.5 rounded-full
                  font-romantic text-xl sm:text-2xl text-white
                  bg-black/30 border border-white/20
                  hover:bg-black/40 active:bg-black/50
                  transition-colors duration-200
                  touch-manipulation
                "
              >
                በር 
              </button>
            )}
          </aside>
        )}

        {/* Game area */}
        <main
          ref={containerRef}
          className={`
            game-stage relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing
            touch-none
            ${phase !== 'playing' ? 'hidden sm:block sm:opacity-30' : ''}
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {hearts.map((heart) => (
            <FallingHeart key={heart.id} heart={heart} onMiss={handleMiss} />
          ))}

          {phase === 'playing' && (
            <Basket x={basketX} caughtFlash={caughtFlash} />
          )}

          {/* Ground glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(255,105,180,0.15), transparent)',
            }}
          />
        </main>
      </div>

      {/* Door / room overlay */}
      {(phase === 'doorMenu' || phase === 'roomView') && (
        <div
          className="overlay-scroll absolute inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: 'radial-gradient(circle at 50% 20%, rgba(255,105,180,0.18) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.8) 100%)',
          }}
        >
            {phase === 'doorMenu' && (
            <div className="w-full max-w-5xl text-center">
              <div className="mx-auto max-w-xl mb-6">
                <p className="font-romantic text-4xl sm:text-5xl md:text-6xl text-pink-100 leading-tight">
                  ልብ ውስጥ
                </p>
                <p className="font-body text-pink-200/70 text-sm sm:text-base mt-2">
                   በር ምረጪ እና ወደ ውስጥ ግቢ
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,220,220,0.2) 0%, rgba(92,40,87,0.45) 55%, rgba(40,22,47,0.85) 100%)',
                  }}
                />
                <div className="door-stage relative px-4 sm:px-8 pt-10 sm:pt-12 pb-20 sm:pb-24">
                  <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-end justify-center">
                    {Array.from({ length: DOORS_TO_CHOOSE }, (_, i) => i + 1).map((doorNumber) => {
                      const theme = getDoorTheme(doorNumber)
                      return (
                        <button
                          key={doorNumber}
                          type="button"
                          onClick={() => handleSelectDoor(doorNumber)}
                            className="door-card
                            group relative w-[170px] h-[270px] sm:w-[190px] sm:h-[300px]
                            transform transition-transform duration-200
                            hover:-translate-y-1 active:translate-y-0
                            touch-manipulation
                          "
                          aria-label={`Open ${theme.label}`}
                        >
                          <div
                            className="absolute inset-0 rounded-t-[18px] rounded-b-md border border-black/30"
                            style={{
                              background: 'linear-gradient(180deg, rgba(62,36,63,0.85) 0%, rgba(35,20,38,0.95) 100%)',
                              boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
                            }}
                          />
                          <div
                            className="absolute top-3 bottom-3 left-3 right-3 rounded-t-[14px] rounded-b-sm border border-white/20"
                            style={{
                              backgroundImage: theme.gradient,
                              boxShadow: `inset 0 0 18px rgba(255,255,255,0.2), 0 0 24px ${theme.glow}`,
                            }}
                          />
                          <div className="absolute top-10 bottom-10 left-8 right-8 border border-white/25 rounded-md" />
                          <div className="absolute top-24 bottom-16 left-8 right-8 border border-white/20 rounded-md" />
                          <div
                            className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/70"
                            style={{
                              background: 'radial-gradient(circle at 30% 30%, #fff 0%, #ffe8a1 40%, #d8a428 100%)',
                            }}
                          />
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
                            <p className="font-romantic text-3xl text-pink-100">{theme.label}</p>
                            <p className="font-body text-white/75 text-xs">ንኪው</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-20"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, rgba(119,72,42,0.95) 0px, rgba(119,72,42,0.95) 18px, rgba(89,50,31,0.95) 18px, rgba(89,50,31,0.95) 36px)',
                  }}
                />
              </div>
            </div>
          )}

          {phase === 'roomView' && selectedDoor && (
            selectedDoor === 1 ? (
              <Door1ProposalRoom onBack={handleBackToDoors} onYes={handleYesMarry} registerSkip={(fn) => { door1SkipRef.current = fn }} onSkip={skipAll} />
            ) : (
              (() => {
              const theme = getDoorTheme(selectedDoor)
              return (
                <div className="w-full max-w-4xl text-center">
                  <div className="mx-auto max-w-xl mb-6">
                    <p
                      className="font-romantic text-4xl sm:text-5xl md:text-6xl leading-tight"
                      style={{
                        color: '#fff',
                        textShadow: `0 0 28px ${theme.glow}`,
                      }}
                    >
                      {theme.label} Room
                    </p>
                    <p className="font-body text-pink-200/70 text-sm sm:text-base mt-2">
                      This is where Door {selectedDoor} contents will go.
                    </p>
                  </div>

                  <div
                    className="rounded-3xl border border-white/15 overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255,220,220,0.18) 0%, rgba(92,40,87,0.4) 58%, rgba(28,15,36,0.9) 100%)',
                      boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 0 40px ${theme.glow}`,
                    }}
                  >
                    <div className="p-6 sm:p-10">
                      <div className="flex flex-col sm:flex-row gap-6 items-stretch justify-center">
                        <div className="flex-1 text-left">
                          <p className="font-romantic text-2xl sm:text-3xl text-white mb-3">
                            Door {selectedDoor} placeholder
                          </p>
                          
                        </div>
                        <div className="flex-1">
                          <div className="rounded-2xl bg-black/25 border border-white/15 p-5 sm:p-6">
                            <div className="w-full max-w-[240px] mx-auto">
                              <div className="relative w-full h-[170px]">
                                <div
                                  className="absolute inset-0 rounded-t-xl rounded-b-md border border-black/30"
                                  style={{
                                    background: 'linear-gradient(180deg, rgba(62,36,63,0.85) 0%, rgba(35,20,38,0.95) 100%)',
                                  }}
                                />
                                <div
                                  className="absolute top-2.5 bottom-2.5 left-2.5 right-2.5 rounded-t-lg rounded-b-sm border border-white/20"
                                  style={{
                                    backgroundImage: theme.gradient,
                                    boxShadow: `inset 0 0 16px rgba(255,255,255,0.2), 0 0 18px ${theme.glow}`,
                                  }}
                                />
                                <div
                                  className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-white/70"
                                  style={{
                                    background:
                                      'radial-gradient(circle at 30% 30%, #fff 0%, #ffe8a1 40%, #d8a428 100%)',
                                  }}
                                />
                              </div>
                            </div>
                            <div className="font-body text-white/90 text-sm sm:text-base mt-3">
                              Selected real door preview
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          type="button"
                          onClick={handleBackToDoors}
                          className="
                            px-6 py-3.5 rounded-full
                            font-romantic text-lg text-white
                            bg-black/30 border border-white/20
                            hover:bg-black/40 active:bg-black/50
                            transition-colors duration-200
                            touch-manipulation
                          "
                        >
                          በር
                        </button>
                        <button
                          type="button"
                          onClick={handleContinueAfterRoom}
                          className="
                            px-6 py-3.5 rounded-full
                            font-romantic text-lg text-white
                            bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500
                            shadow-lg shadow-pink-500/30
                            hover:scale-[1.02] active:scale-[0.99]
                            transition-transform duration-200
                            touch-manipulation
                          "
                        >
                          ቀጥል 💖
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
              })()
            )
          )}
        </div>
      )}

      {/* Slideshow and post-yes flow */}
      {phase === 'slideshow' && (
        <div
          className="overlay-scroll absolute inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: 'radial-gradient(circle at 50% 20%, rgba(255,105,180,0.12) 0%, rgba(0,0,0,0.7) 55%)',
          }}
        >
          <div className="memory-page w-full max-w-4xl text-center">
            <button
              type="button"
              onClick={() => { console.log('slideshow top back clicked'); goToDoors(); }}
              onPointerDown={(e) => { e.stopPropagation(); console.log('slideshow top pointerdown'); goToDoors(); }}
              className="absolute top-4 right-4 px-5 py-2 rounded-full bg-black/30 text-white touch-manipulation pointer-events-auto"
              style={{ zIndex: 9999 }}
            >
              በር              
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); skipAll(); }}
              onPointerDown={(e) => { e.stopPropagation(); skipAll(); }}
              className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/25 text-white touch-manipulation pointer-events-auto"
              style={{ zIndex: 9999 }}
            >
              S
            </button>

            <audio ref={slideshowAudioRef} src={PREPARATION_MUSIC_URL} loop preload="auto" />

            <div className="mx-auto max-w-2xl mb-6">
              <p className="font-body text-xs uppercase tracking-[0.35em] text-pink-200/70 mb-3">
                ምእራፍ አንድ። የዝግጅት ቀን
              </p>
              <p className="font-romantic text-5xl sm:text-6xl md:text-7xl text-pink-100 leading-tight drop-shadow-[0_0_24px_rgba(255,182,193,0.45)]">
                የ ዘላለማችን ጅማሬ
              </p>
              
            </div>

            <div className="memory-stage relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black/20 p-4">
              <div className="relative w-full h-[460px] flex items-center justify-center">
                {[PREP1_URL, PREP2_URL, PREP3_URL].map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`slide-${i}`}
                    className={`slideshow-img ${i === slideshowIndex ? 'active' : ''}`}
                    style={{ position: 'absolute', inset: 0, maxHeight: '100%', objectFit: 'contain' }}
                  />
                ))}

                <div className="absolute left-6 top-6">
                  <div className="big-yes">ሚስቴ ሆነሻል 💖</div>
                </div>

                {/* flayer emojis */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="flayer" style={{ left: '20%', top: '10%' }}>💍</div>
                  <div className="flayer" style={{ left: '70%', top: '6%', animationDelay: '0.3s' }}>✨</div>
                  <div className="flayer" style={{ left: '40%', top: '2%', animationDelay: '0.6s' }}>💕</div>
                </div>
              </div>

              <div className="mt-4">
                  {showWeddingOption ? (
                  <div className="flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => { setPhase('weddingDay') }}
                      className="px-6 py-3 rounded-full font-romantic text-lg text-white bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500"
                    >
                       የጋብቻ ቀን
                    </button>
                    
                    
                  </div>
                ) : (
                  <div className="text-white/70">የኔ ጣፋጭ አፈቅርሻልሁ...</div>
                )}
                  {/* Always show a clear Back button at the bottom for touch users */}
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={goToDoors}
                      onPointerDown={(e) => { e.stopPropagation(); goToDoors(); }}
                      className="px-6 py-3 rounded-full bg-black/40 text-white touch-manipulation"
                    >
                      በር
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'weddingDay' && (
        <div
          className="overlay-scroll absolute inset-0 z-60 flex items-center justify-center px-4"
          style={{ background: 'radial-gradient(circle at 50% 20%, rgba(255,105,180,0.14) 0%, rgba(0,0,0,0.8) 60%)' }}
        >
          <div className="w-full max-w-4xl text-center relative">
            <button
              type="button"
              onClick={() => { console.log('weddingDay top back clicked'); goToDoors(); }}
              onPointerDown={(e) => { e.stopPropagation(); console.log('weddingDay top pointerdown'); goToDoors(); }}
              className="absolute top-4 right-4 px-5 py-2 rounded-full bg-black/30 text-white touch-manipulation pointer-events-auto"
              style={{ zIndex: 9999 }}
            >
              በር
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); skipAll(); }}
              onPointerDown={(e) => { e.stopPropagation(); skipAll(); }}
              className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/25 text-white touch-manipulation pointer-events-auto"
              style={{ zIndex: 9999 }}
            >
              S
            </button>

            <audio ref={slideshowAudioRef} src={WEDDING_MUSIC_URL} loop preload="auto" />

            <div className="rounded-[2rem] border border-amber-100/25 overflow-hidden shadow-2xl p-5 sm:p-8 bg-gradient-to-br from-amber-100/10 via-rose-300/10 to-black/25">
              <div className="mb-5">
                
                <p className="font-romantic text-5xl sm:text-6xl md:text-7xl text-amber-50 leading-tight drop-shadow-[0_0_24px_rgba(253,230,138,0.45)]">
                  ዘላለማችን እዚህ ጋር ይጀምራል። ህሊና እና እላ
                </p>
              </div>
              <img src={WED_DAY_URL} alt="wedding-card" className="w-full h-[440px] object-contain bg-black/30 mb-4" />

              <div className="mx-auto max-w-xl text-left">
                <div className="font-romantic text-lg sm:text-xl text-white whitespace-pre-wrap">
                  <span className="outlined-sparkle">{weddingTyped}</span>
                  {!weddingTypingDone && <span className="inline-block ml-2 animate-pulse">|</span>}
                </div>

                {/* bottom back buttons removed - use top-right Back to return to doors */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={goToDoors}
                    onPointerDown={(e) => { e.stopPropagation(); goToDoors(); }}
                    className="px-7 py-3 rounded-full bg-black/40 border border-white/20 text-white touch-manipulation shadow-lg shadow-black/20"
                  >
                    በር
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'weddingCard' && (
        <div
          className="overlay-scroll absolute inset-0 z-60 flex items-center justify-center px-4"
          style={{ background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 100%)' }}
        >
          <div className="w-full max-w-4xl text-center relative">
            <button
              type="button"
              onClick={() => { console.log('weddingCard top back clicked'); goToDoors(); }}
              onPointerDown={(e) => { e.stopPropagation(); console.log('weddingCard top pointerdown'); goToDoors(); }}
              className="absolute top-4 right-4 px-5 py-2 rounded-full bg-black/30 text-white touch-manipulation pointer-events-auto"
              style={{ zIndex: 9999 }}
            >
              በር
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); skipAll(); }}
              onPointerDown={(e) => { e.stopPropagation(); skipAll(); }}
              className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/25 text-white touch-manipulation pointer-events-auto"
              style={{ zIndex: 9999 }}
            >
              S
            </button>

            <audio ref={slideshowAudioRef} src={WEDDING_MUSIC_URL} loop preload="auto" />

            <div className="rounded-3xl border border-white/15 overflow-hidden shadow-2xl p-6 bg-black/10">
              <img src={WED_DAY_URL} alt="wedding-card" className="w-full h-[520px] object-contain bg-black/30 mb-4" />

              <div className="mx-auto max-w-xl text-left">
                <div className="font-romantic text-lg sm:text-xl text-white whitespace-pre-wrap">
                  <span className="outlined-sparkle">{weddingTyped}</span>
                  {!weddingTypingDone && <span className="inline-block ml-2 animate-pulse">|</span>}
                </div>
                {/* bottom back buttons removed - top-right Back returns to doors */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={goToDoors}
                    onPointerDown={(e) => { e.stopPropagation(); goToDoors(); }}
                    className="px-6 py-3 rounded-full bg-black/40 text-white touch-manipulation"
                  >
                    በር
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating ambient hearts in background */}
      {['final', 'doorMenu', 'roomView', 'marryYes', 'wedding'].includes(phase) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 15}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 3}s`,
              }}
            >
              {HEART_EMOJIS[i % HEART_EMOJIS.length]}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
