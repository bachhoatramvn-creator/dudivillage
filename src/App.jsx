import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './Login'

function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [newRoom, setNewRoom] = useState({ name: '', price: '' })
  const [bookingInfo, setBookingInfo] = useState({
    check_in: '',
    check_out: ''
  })
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
  totalRooms: 0,
  totalBookings: 0,
  revenue: 0,
  platformRevenue: 0,
  hostPayout: 0
})

  // AUTH
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // LOAD DATA
  useEffect(() => {
    if (user) {
      saveUserToDB()
      fetchRole()
      fetchRooms()
      fetchBookings()

      if (role === 'admin') {
        fetchStats()
      }
    }
  }, [user, role])

  const saveUserToDB = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)

    if (!data || data.length === 0) {
      await supabase.from('users').insert([
        {
          auth_id: user.id,
          email: user.email,
          role: 'guest'
        }
      ])
    }
  }

  const fetchRole = async () => {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single()

    setRole(data?.role)
  }

  const getUserDB = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    return data
  }

  const fetchRooms = async () => {
    let query = supabase.from('rooms').select('*')

    if (role === 'host') {
      query = query.eq('host_id', user.id)
    }

    const { data } = await query
    setRooms(data || [])
  }

  const fetchBookings = async () => {
    let query = supabase
      .from('bookings')
      .select(`*, rooms(name), users(name)`)

    if (role === 'guest') {
      const userDB = await getUserDB()
      query = query.eq('user_id', userDB.id)
    }

    const { data } = await query
    setBookings(data || [])
  }

  const fetchStats = async () => {
  const { data: rooms } = await supabase.from('rooms').select('*')
  const { data: bookings } = await supabase.from('bookings').select('*')

  const totalRooms = rooms?.length || 0
  const totalBookings = bookings?.length || 0

  const revenue =
    bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0

  const platformRevenue =
    bookings?.reduce((sum, b) => sum + (b.platform_fee || 0), 0) || 0

  const hostPayout =
    bookings?.reduce((sum, b) => sum + (b.host_earning || 0), 0) || 0

  setStats({
    totalRooms,
    totalBookings,
    revenue,
    platformRevenue,
    hostPayout
  })
}

  const bookRoom = async (roomId) => {
    setLoading(true)

    const userDB = await getUserDB()

    
const total = 500000
const fee = total * 0.1

const { error } = await supabase.from('bookings').insert([
  {
    room_id: roomId,
    user_id: userDB.id,
    check_in: bookingInfo.check_in,
    check_out: bookingInfo.check_out,
    total_price: total,
    platform_fee: fee,
    host_earning: total - fee
  }
])

    setLoading(false)

    if (!error) {
      alert('Đặt phòng thành công 🔥')
      fetchBookings()
    }
  }

  const createRoom = async () => {
    const { error } = await supabase.from('rooms').insert([
      {
        name: newRoom.name,
        price: newRoom.price,
        host_id: user.id
      }
    ])

    if (!error) {
      alert('Tạo phòng thành công 🔥')
      setNewRoom({ name: '', price: '' })
      fetchRooms()
    }
  }

  if (!user) {
  return (
    <div>
      <h2>Đặt phòng nhanh</h2>
      <button onClick={() => supabase.auth.signInWithOtp({ email: 'test@gmail.com' })}>
        Tiếp tục
      </button>
    </div>
  )
}

  return (
    <div style={{ padding: 20 }}>
      <h3>USER: {user.email}</h3>
      <h3>ROLE: {role}</h3>

      <button onClick={() => supabase.auth.signOut()}>
        Đăng xuất
      </button>

      {role === 'admin' && (
        <div style={{ border: '2px solid red', padding: 20, margin: 20 }}>
          <h2>📊 Admin Dashboard</h2>
<p>💰 Tổng doanh thu: {stats.revenue} VND</p>
<p>🏦 Nền tảng thu: {stats.platformRevenue} VND</p>
<p>🏡 Trả cho host: {stats.hostPayout} VND</p>
<img 
  src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
  style={{ width: '100%', borderRadius: 12 }}
/>
          <p>🏡 Tổng phòng: {stats.totalRooms}</p>
          <p>📅 Tổng booking: {stats.totalBookings}</p>
          <p>💰 Doanh thu: {stats.revenue} VND</p>
        </div>
      )}

      {role === 'host' && (
        <div style={{ marginBottom: 20 }}>
          <h2>➕ Tạo phòng</h2>
          <input
            placeholder="Tên phòng"
            value={newRoom.name}
            onChange={(e) =>
              setNewRoom({ ...newRoom, name: e.target.value })
            }
          />
          <input
            placeholder="Giá"
            value={newRoom.price}
            onChange={(e) =>
              setNewRoom({ ...newRoom, price: e.target.value })
            }
          />
          <button onClick={createRoom}>Tạo phòng</button>
        </div>
      )}

      <h1>Danh sách phòng</h1>

      {rooms.map((room) => {
        return (
          <div
            key={room.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 12,
              padding: 15,
              margin: 15
            }}
          >
            <h2>{room.name}</h2>
            <p>{room.price} VND / đêm</p>

            <input
              type="date"
              onChange={(e) =>
                setBookingInfo({
                  ...bookingInfo,
                  check_in: e.target.value
                })
              }
            />

            <input
              type="date"
              onChange={(e) =>
                setBookingInfo({
                  ...bookingInfo,
                  check_out: e.target.value
                })
              }
            />

            <button onClick={() => bookRoom(room.id)}>
              {loading ? 'Đang đặt...' : 'Đặt phòng'}
            </button>
          </div>
        )
      })}

      <h2>Danh sách booking</h2>

      {bookings.map((b) => {
        return (
          <div
            key={b.id}
            style={{
              border: '1px solid #999',
              margin: 10,
              padding: 10
            }}
          >
            <p>👤 {b.users?.name}</p>
            <p>🏡 {b.rooms?.name}</p>
          </div>
        )
      })}
    </div>
  )
}

export default App