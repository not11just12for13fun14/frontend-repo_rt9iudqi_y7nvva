import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Tddl75W6Ij9Qp77j/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/70 pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="uppercase tracking-widest text-sm text-rose-600 font-semibold">SOCSE Chai Wala</p>
        <h1 className="mt-3 text-5xl sm:text-6xl font-extrabold text-gray-900">
          Brewed for Campus, Spiced for Culture
        </h1>
        <p className="mt-4 max-w-2xl text-gray-700">
          A playful community where chai meets memes, ideas, and orders. Tap around for easter eggs — k-pop? nah, hip-hop chai drops.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="#order" className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold shadow hover:bg-rose-700 transition">Order Now</a>
          <a href="#community" className="px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold shadow hover:shadow-md transition">Open Community</a>
        </div>
      </div>
    </div>
  )
}

function Egg({ label, onClick, style }) {
  return (
    <button onClick={onClick} style={style} className="absolute text-xs sm:text-sm px-2 py-1 rounded-full bg-black/70 text-white hover:bg-black transition">
      {label}
    </button>
  )
}

function EasterEggs() {
  const [message, setMessage] = useState('')
  const eggs = [
    { label: 'chai & chill', quote: 'Started from the lab, now we’re brewed.', top: '18%', left: '12%' },
    { label: 'genz brainrot', quote: 'No thoughts, only boba. skibidi sip 💅', top: '62%', left: '18%' },
    { label: 'hip-hop drop', quote: 'If you’re reading this, it’s tea late.', top: '38%', left: '76%' },
  ]
  return (
    <div className="relative mt-4 h-32">
      {eggs.map((e, i) => (
        <Egg key={i} label={e.label} style={{ top: e.top, left: e.left }} onClick={() => setMessage(e.quote)} />
      ))}
      {!!message && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow px-4 py-2 text-sm font-medium text-gray-800">
          {message}
        </div>
      )}
    </div>
  )
}

function Community() {
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    bootstrap()
    loadPosts()
  }, [])

  async function bootstrap() {
    // create or fetch demo user
    const handle = '@rvu_guest'
    const res = await fetch(`${BACKEND}/api/users?handle=${encodeURIComponent(handle)}`)
    if (res.ok) {
      const u = await res.json()
      setUser(u)
    } else {
      const create = await fetch(`${BACKEND}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, name: 'RVU Guest', university: 'RVU', bio: 'chai enjoyer' })
      })
      const u = await create.json()
      setUser(u)
    }
  }

  async function loadPosts() {
    const res = await fetch(`${BACKEND}/api/posts`)
    const data = await res.json()
    setPosts(data)
  }

  async function submitPost(e) {
    e.preventDefault()
    if (!text.trim() || !user) return
    const res = await fetch(`${BACKEND}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author_id: user.id, text, tags: ['campus', 'chai'] })
    })
    if (res.ok) {
      setText('')
      loadPosts()
    }
  }

  return (
    <section id="community" className="mt-14">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Community Feed</h2>
        <button onClick={loadPosts} className="text-sm px-3 py-1.5 bg-gray-900 text-white rounded-lg">Refresh</button>
      </div>
      <form onSubmit={submitPost} className="mt-4 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="drop a meme, line, or idea…" className="flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-400" />
        <button className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold">Post</button>
      </form>
      <div className="mt-6 grid gap-3">
        {posts.map(p => (
          <div key={p.id} className="p-4 rounded-2xl bg-white shadow">
            <div className="text-xs text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
            <div className="mt-1 text-gray-800">{p.text}</div>
            {p.tags?.length ? <div className="mt-2 text-xs text-rose-600">#{p.tags.join(' #')}</div> : null}
          </div>
        ))}
      </div>
    </section>
  )
}

function OrderSection() {
  const [cart, setCart] = useState(["Masala Chai", "Cold Boba Pink"])
  const [total, setTotal] = useState(180)
  const [order, setOrder] = useState(null)

  async function startOrder() {
    const handle = '@rvu_guest'
    const res = await fetch(`${BACKEND}/api/users?handle=${encodeURIComponent(handle)}`)
    const u = await res.json()
    const resp = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: u.id, items: cart, total_amount: total })
    })
    const data = await resp.json()
    setOrder(data)
  }

  async function mockPay(success=true) {
    if (!order) return
    const resp = await fetch(`${BACKEND}/api/payments/mock-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id, success })
    })
    const data = await resp.json()
    setOrder(data)
  }

  return (
    <section id="order" className="mt-16">
      <h2 className="text-2xl font-bold">Order Chai</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-2xl bg-white shadow">
          <h3 className="font-semibold">Cart</h3>
          <ul className="mt-2 text-gray-700 list-disc list-inside">
            {cart.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
          <div className="mt-3 font-semibold">Total: ₹{total}</div>
          <button onClick={startOrder} className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white">Start Order</button>
        </div>
        <div className="p-4 rounded-2xl bg-white shadow">
          <h3 className="font-semibold">Payment</h3>
          {!order ? <p className="text-gray-500">Create an order to continue.</p> : (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Order #{order.id}</div>
              <div className="font-medium">Status: <span className={order.payment_status === 'success' ? 'text-emerald-600' : order.payment_status === 'failed' ? 'text-red-600' : 'text-amber-600'}>{order.payment_status}</span></div>
              <div className="flex gap-2">
                <button onClick={() => mockPay(true)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white">Mock Success</button>
                <button onClick={() => mockPay(false)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white">Mock Fail</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-amber-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Hero />
        <EasterEggs />
        <Community />
        <OrderSection />
      </div>
      <footer className="mt-16 text-center text-xs text-gray-500 pb-8">© {new Date().getFullYear()} SOCSE Chai Wala • brewed by RVU grads</footer>
    </div>
  )
}

export default App
