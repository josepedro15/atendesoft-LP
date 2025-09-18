// Script para testar o contexto de autenticação
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vlayangmpcogxoolcksc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuthContext() {
  console.log('🔍 Testando contexto de autenticação...')
  
  const email = 'jopedromkt@gmail.com'
  const password = 'Skinread1'
  
  try {
    // 1. Fazer login
    console.log('🔑 Fazendo login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (loginError) {
      console.log('❌ Erro no login:', loginError.message)
      return
    }
    
    console.log('✅ Login realizado!')
    console.log('👤 Usuário:', loginData.user?.email)
    console.log('🎫 Sessão:', loginData.session ? 'Criada' : 'Não criada')
    
    // 2. Verificar sessão atual
    console.log('🔍 Verificando sessão atual...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Erro ao verificar sessão:', sessionError.message)
    } else {
      console.log('✅ Sessão atual:', sessionData.session ? 'Ativa' : 'Inativa')
      if (sessionData.session) {
        console.log('👤 Usuário da sessão:', sessionData.session.user?.email)
      }
    }
    
    // 3. Verificar usuário atual
    console.log('👤 Verificando usuário atual...')
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.log('❌ Erro ao verificar usuário:', userError.message)
    } else {
      console.log('✅ Usuário atual:', userData.user ? 'Logado' : 'Não logado')
      if (userData.user) {
        console.log('📧 Email:', userData.user.email)
        console.log('🆔 ID:', userData.user.id)
      }
    }
    
    // 4. Testar logout
    console.log('🚪 Testando logout...')
    const { error: logoutError } = await supabase.auth.signOut()
    
    if (logoutError) {
      console.log('❌ Erro no logout:', logoutError.message)
    } else {
      console.log('✅ Logout realizado!')
    }
    
    // 5. Verificar se realmente fez logout
    console.log('🔍 Verificando se logout funcionou...')
    const { data: finalSession } = await supabase.auth.getSession()
    console.log('✅ Sessão após logout:', finalSession.session ? 'Ainda ativa' : 'Inativa')
    
  } catch (error) {
    console.log('❌ Erro geral:', error)
  }
}

testAuthContext()
