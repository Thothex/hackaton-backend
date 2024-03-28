const wsOnAnswer = (wsConnections, WebSocket, hackathonId) => {
  if (wsConnections) {
    wsConnections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            platform: 'Был получен ответ от команды, запросите обновление дашборда',
            code: 'dashboard_update',
            hackathonId,
          }),
        )
      }
    })
  }
}

export default wsOnAnswer
