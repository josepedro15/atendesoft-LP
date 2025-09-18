// Script para testar autenticação e criar usuário
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vlayangmpcogxoolcksc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  console.log('🔍 Testando autenticação...')
  
  try {
    // 1. Testar signup
    console.log('📝 Criando usuário de teste...')
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'teste@atendesoft.com',
      password: '123456',
      options: {
        data: {
          full_name: 'Usuário Teste'
        }
      }
    })
    
    if (signupError) {
      console.log('❌ Erro no signup:', signupError.message)
    } else {
      console.log('✅ Usuário criado:', signupData.user?.email)
      console.log('📧 Confirme o email:', signupData.user?.email_confirmed_at ? 'Já confirmado' : 'Pendente')
    }
    
    // 2. Testar signin
    console.log('🔑 Testando login...')
    const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
      email: 'teste@atendesoft.com',
      password: '123456'
    })
    
    if (signinError) {
      console.log('❌ Erro no login:', signinError.message)
    } else {
      console.log('✅ Login realizado:', signinData.user?.email)
    }
    
    // 3. Testar tabela profiles
    console.log('👤 Testando tabela profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5)
    
    if (profilesError) {
      console.log('❌ Erro ao acessar profiles:', profilesError.message)
      console.log('💡 Execute o SQL de setup no painel do Supabase!')
    } else {
      console.log('✅ Tabela profiles funcionando:', profiles.length, 'perfis encontrados')
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error)
  }
}

testAuth()
