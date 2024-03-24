const { Server } = require('http')
const { WebSocket, WebSocketServer } = require('ws')

function onSocketPreError(e) {
  console.error('WebSocket error', e)
}

function onSocketPostError(e) {
  console.error('WebSocket error', e)
}

let webSocketConnection
const connections = []
module.exports = {
  configure(server) {
    const wss = new WebSocketServer({ noServer: true })

    server.on('upgrade', (request, socket, head) => {
      socket.on('error', onSocketPreError)

      wss.handleUpgrade(request, socket, head, (ws) => {
        socket.removeListener('error', onSocketPreError)
        wss.emit('connection', ws, request)
      })
    })

    wss.on('connection', (ws, req) => {
      ws.on('error', onSocketPostError)
      connections.push(ws)
      // webSocketConnection = ws

      ws.on('message', (msg, isBinary) => {
        console.log('msg', msg.toString('utf8'))
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                Hi: 'Hello',
              }),
              { binary: isBinary },
            )
          }
        })
      })

      ws.on('close', () => {
        const index = connections.indexOf(ws)
        if (index !== -1) {
          connections.splice(index, 1)
        }
        console.log('Connection closed')
      })
    })
  },
  getWebSocketConnection() {
    return connections
  },
}
