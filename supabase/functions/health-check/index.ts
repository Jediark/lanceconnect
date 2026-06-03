import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { handleError } from '../_shared/errors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          status: 'ERROR',
          message: 'Server environment misconfigured: missing environment variables',
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check database connection by making a minimal select query on leads
    const { error: dbError } = await supabase.from('leads').select('id').limit(1)

    const dbHealthy = !dbError
    const statusCode = dbHealthy ? 200 : 500

    return new Response(
      JSON.stringify({
        status: dbHealthy ? 'OK' : 'DEGRADED',
        database: dbHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        error: dbError ? dbError.message : null
      }),
      {
        status: statusCode,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    return handleError(error)
  }
})
