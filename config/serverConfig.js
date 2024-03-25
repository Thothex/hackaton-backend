const express = require('express')
const path = require('path')
const morgan = require('morgan')

const serverConfig = (app) => {
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    express.static('public', {
      setHeaders: (res, filePath) => {
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`)
      },
    }),
  )
}

module.exports = serverConfig
