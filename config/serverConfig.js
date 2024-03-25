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
        const fileName = path.basename(filePath)
        const encodedFileName = encodeURIComponent(fileName)
        res.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`)
      },
    }),
  )
}

module.exports = serverConfig
