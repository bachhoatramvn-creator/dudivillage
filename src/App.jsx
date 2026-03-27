import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [rooms, setRooms] = useState([])
  const [bookingInfo, setBookingInfo] = useState({
    name: '',
    phone: '',
    check_in: '',
    check_out: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    const { data } = await supabase.from('rooms').select('*')
    setRooms(data || [])
  }

  const bookRoom = async (roomId) => {
    if (!bookingInfo.name || !bookingInfo.phone) {
      alert('Nhập tên và số điện thoại')
      return
    }

    setLoading(true)

    const total = 500000
    const fee = total * 0.1

    const { error } = await supabase.from('bookings').insert([
      {
        room_id: roomId,
        guest_name: bookingInfo.name,
        guest_phone: bookingInfo.phone,
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
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f5f5f5' }}>
      
      {/* HERO */}
      <div style={{ position: 'relative' }}>
  <img
    src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
    style={{
      width: '100%',
      height: '400px',
      objectFit: 'cover',
      filter: 'brightness(70%)'
    }}
  />

  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      textAlign: 'center'
    }}
  >
    <h1 style={{ fontSize: 40, marginBottom: 10 }}>
      🏡 Dudi Village Sóc Sơn
    </h1>
    <p style={{ fontSize: 18 }}>
      Trốn phố – về với thiên nhiên
    </p>
    <p style={{ fontSize: 16, marginTop: 10 }}>
      🔥 Giá chỉ từ 500k/đêm
    </p>
  </div>
</div>

      {/* FORM */}
      <div
  style={{
    background: 'white',
    margin: '-60px auto 20px',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    maxWidth: 500,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  }}
>
  <h2 style={{ textAlign: 'center' }}>Đặt phòng nhanh</h2>

  <input
    placeholder="Tên của bạn"
    value={bookingInfo.name}
    onChange={(e) =>
      setBookingInfo({ ...bookingInfo, name: e.target.value })
    }
    style={{ width: '100%', padding: 12, marginBottom: 10 }}
  />

  <input
    placeholder="Số điện thoại"
    value={bookingInfo.phone}
    onChange={(e) =>
      setBookingInfo({ ...bookingInfo, phone: e.target.value })
    }
    style={{ width: '100%', padding: 12, marginBottom: 10 }}
  />

  <div style={{ display: 'flex', gap: 10 }}>
    <input type="date" style={{ flex: 1, padding: 10 }} />
    <input type="date" style={{ flex: 1, padding: 10 }} />
  </div>
</div>

      {/* ROOMS */}
      <div
  key={room.id}
  style={{
    background: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
  }}
>
  <img
    src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
    style={{ width: '100%', height: 180, objectFit: 'cover' }}
  />

  <div style={{ padding: 15 }}>
    <h3>{room.name}</h3>

    <p style={{ fontWeight: 'bold', color: '#ff5722' }}>
      {room.price} VND / đêm
    </p>

    <p>🌿 Không gian riêng tư</p>
    <p>🔥 Cuối tuần gần hết phòng</p>

    <button
      onClick={() => bookRoom(room.id)}
      style={{
        width: '100%',
        marginTop: 10,
        background: '#ff5722',
        color: 'white',
        border: 'none',
        padding: 12,
        borderRadius: 10,
        fontSize: 16
      }}
    >
      Đặt ngay
    </button>
  </div>
</div>
  )
}

export default App