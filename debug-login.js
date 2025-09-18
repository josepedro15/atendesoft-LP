// Script para debugar o problema de login
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vlayangmpcogxoolcksc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLogin() {
  console.log('🔍 Debugando problema de login...')
  
  const email = 'jopedromkt@gmail.com'
  const password = 'Skinread1'
  
  try {
    // 1. Testar se o usuário existe
    console.log('👤 Verificando se usuário existe...')
    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', email)
    
    if (usersError) {
      console.log('❌ Erro ao verificar usuário:', usersError.message)
    } else {
      console.log('✅ Usuário encontrado:', users.length > 0 ? 'Sim' : 'Não')
      if (users.length > 0) {
        console.log('📧 Email confirmado:', users[0].email_confirmed_at ? 'Sim' : 'Não')
        console.log('🔐 Senha hash existe:', users[0].encrypted_password ? 'Sim' : 'Não')
      }
    }
    
    // 2. Testar login
    console.log('🔑 Testando login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (loginError) {
      console.log('❌ Erro no login:', loginError.message)
      console.log('🔍 Código do erro:', loginError.status)
    } else {
      console.log('✅ Login realizado com sucesso!')
      console.log('👤 Usuário:', loginData.user?.email)
      console.log('🎫 Sessão:', loginData.session ? 'Criada' : 'Não criada')
    }
    
    // 3. Verificar perfil
    console.log('👤 Verificando perfil...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (profileError) {
      console.log('❌ Erro ao verificar perfil:', profileError.message)
    } else {
      console.log('✅ Perfil encontrado:', profile)
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error)
  }
}

debugLogin()
