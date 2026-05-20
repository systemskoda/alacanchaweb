import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import mime from 'mime-types'
import ws from 'ws'

const OLD_URL = 'https://ftaasgeagfqgvfjkauua.supabase.co'

const OLD_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0YWFzZ2VhZ2ZxZ3ZmamthdXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNjY0MTYsImV4cCI6MjA5Mzg0MjQxNn0.ksBkIR0JNJUPVcJAQbdkxqLpfdk7CVS_gpptPKpKuXs'

const NEW_URL =
  'https://vdkzomdsakyjznfliwxr.supabase.co'

const NEW_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka3pvbWRzYWt5anpuZmxpd3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg4NTY5NCwiZXhwIjoyMDk0NDYxNjk0fQ.BMH9TPQiQQ-EKhFV_isAJXMPCxv1RntBv6TGFUikodA'

const oldDb = createClient(OLD_URL, OLD_KEY, {
  realtime: {
    transport: ws
  }
})

const newDb = createClient(NEW_URL, NEW_KEY, {
  realtime: {
    transport: ws
  }
})

const migrations = [
  {
    table: 'fotos_2026',
    column: 'url',
    bucket: 'images'
  },
  {
    table: 'sponsors',
    column: 'image_url',
    bucket: 'sponsors'
  },
  {
    table: 'audios',
    column: 'audio_url',
    bucket: 'audios'
  },
  {
    table: 'fotos_historicas',
    column: 'image_url',
    bucket: 'guests'
  }
]

async function migrateFiles(config) {
  console.log(`\n📦 Migrando bucket ${config.bucket}`)

  const { data: rows, error } = await newDb
    .from(config.table)
    .select('*')

  if (error) {
    console.error(error)
    return
  }

  for (const row of rows) {
    try {
      const oldUrl = row[config.column]

      if (!oldUrl) continue

      console.log(`⬇️ Descargando ${oldUrl}`)

      const response = await axios.get(oldUrl, {
        responseType: 'arraybuffer'
      })

      const urlParts = oldUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]

      const contentType =
        response.headers['content-type'] ||
        mime.lookup(fileName) ||
        'application/octet-stream'

      console.log(`⬆️ Subiendo ${fileName}`)

      const { error: uploadError } = await newDb.storage
        .from(config.bucket)
        .upload(fileName, response.data, {
          contentType,
          upsert: true
        })

      if (uploadError) {
        console.error(uploadError)
        continue
      }

      const newUrl =
        `${NEW_URL}/storage/v1/object/public/${config.bucket}/${fileName}`

      const { error: updateError } = await newDb
        .from(config.table)
        .update({
          [config.column]: newUrl
        })
        .eq('id', row.id)

      if (updateError) {
        console.error(updateError)
        continue
      }

      console.log(`✅ Migrado ${fileName}`)
    } catch (err) {
      console.error(err.message)
    }
  }
}

async function run() {
  for (const migration of migrations) {
    await migrateFiles(migration)
  }

  console.log('\n🎉 Storage migrado completamente')
}

run()