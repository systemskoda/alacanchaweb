import { createClient } from '@supabase/supabase-js'
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

const tables = [
  { old: 'articles', new: 'articles' },
  { old: 'audios', new: 'audios' },
  { old: 'sponsors', new: 'sponsors' },
  { old: 'images', new: 'fotos_2026' },
  { old: 'guests', new: 'fotos_historicas' },
]

async function migrateTable(tableConfig) {
  console.log(
    `Migrando ${tableConfig.old} -> ${tableConfig.new}...`
  )

  const { data, error } = await oldDb
    .from(tableConfig.old)
    .select('*')

  if (error) {
    console.error('Error leyendo:', error)
    return
  }

  console.log(`${data.length} registros encontrados`)

  if (!data.length) {
    console.log('Tabla vacía')
    return
  }

  const { error: insertError } = await newDb
    .from(tableConfig.new)
    .insert(data)

  if (insertError) {
    console.error('Error insertando:', insertError)
    return
  }

  console.log(`✅ ${tableConfig.new} migrada`)
}

async function run() {
  for (const table of tables) {
    await migrateTable(table)
  }

  console.log('🎉 Migración terminada')
}

run()