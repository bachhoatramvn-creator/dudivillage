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
            height: '300px',
            objectFit: 'cover'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            color: 'white'
          }}
        >
          <h1 style={{ margin: 0 }}>🏡 Dudi Village Sóc Sơn</h1>
          <p>Không gian nghỉ dưỡng giữa thiên nhiên</p>
          <p>🔥 Giá từ 500k/đêm</p>
        </div>
      </div>

      {/* FORM */}
      <div
        style={{
          background: 'white',
          margin: 20,
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        <h2>Đặt phòng nhanh</h2>

        <input
          placeholder="Tên của bạn"
          value={bookingInfo.name}
          onChange={(e) =>
            setBookingInfo({ ...bookingInfo, name: e.target.value })
          }
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="Số điện thoại"
          value={bookingInfo.phone}
          onChange={(e) =>
            setBookingInfo({ ...bookingInfo, phone: e.target.value })
          }
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="date"
            style={{ flex: 1, padding: 10 }}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, check_in: e.target.value })
            }
          />

          <input
            type="date"
            style={{ flex: 1, padding: 10 }}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, check_out: e.target.value })
            }
          />
        </div>
      </div>

      {/* ROOMS */}
      <div style={{ padding: 20 }}>
        <h2>Danh sách phòng</h2>

        {rooms.map((room) => {
          return (
            <div
              key={room.id}
              style={{
                background: 'white',
                borderRadius: 12,
                padding: 20,
                marginBottom: 15,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              <h3>{room.name}</h3>
              <p style={{ fontWeight: 'bold' }}>
                {room.price} VND / đêm
              </p>

              <p>🌿 View thiên nhiên</p>
              <p>🔥 Cuối tuần dễ hết phòng</p>

              <button
                onClick={() => bookRoom(room.id)}
                style={{
                  background: '#ff5722',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Đang đặt...' : 'Đặt phòng'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App