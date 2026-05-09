import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  path: '/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// Store connected admin clients
const adminRooms = new Set<string>()

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Admin joins the kitchen/admin room to receive order updates
  socket.on('join-admin', () => {
    socket.join('admin-room')
    adminRooms.add(socket.id)
    console.log(`Admin joined: ${socket.id}`)
    socket.emit('admin-joined', { message: 'Connected to order updates' })
  })

  // Customer joins a specific order room to track their order status
  socket.on('join-order', (data: { orderId: string }) => {
    socket.join(`order-${data.orderId}`)
    console.log(`Customer watching order: ${data.orderId}`)
  })

  // New order coming in from customer
  socket.on('new-order', (data: {
    orderId: string
    tableNumber: number
    totalItems: number
    totalPrice: string
    customerNote?: string
  }) => {
    console.log(`New order #${data.orderId} from table ${data.tableNumber}`)
    // Broadcast to all admins
    io.to('admin-room').emit('new-order', {
      ...data,
      timestamp: new Date().toISOString()
    })
  })

  // Order status update from admin
  socket.on('order-status-update', (data: {
    orderId: string
    status: string
  }) => {
    console.log(`Order #${data.orderId} status: ${data.status}`)
    // Notify the customer watching this order
    io.to(`order-${data.orderId}`).emit('order-status-changed', {
      orderId: data.orderId,
      status: data.status,
      timestamp: new Date().toISOString()
    })
    // Also notify all other admins
    socket.to('admin-room').emit('order-status-changed', {
      orderId: data.orderId,
      status: data.status,
      timestamp: new Date().toISOString()
    })
  })

  socket.on('disconnect', () => {
    adminRooms.delete(socket.id)
    console.log(`Client disconnected: ${socket.id}`)
  })

  socket.on('error', (error) => {
    console.error(`Socket error (${socket.id}):`, error)
  })
})

const PORT = 3003
httpServer.listen(PORT, () => {
  console.log(`Order WebSocket service running on port ${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('Shutting down order service...')
  httpServer.close(() => {
    console.log('Order service closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('Shutting down order service...')
  httpServer.close(() => {
    console.log('Order service closed')
    process.exit(0)
  })
})
